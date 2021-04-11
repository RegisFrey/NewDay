import { ref } from "vue";
import { useStorageValue } from "../helpers/storage";

export enum AuthState {
    NotAuthenticated, // 0 - either never attempted auth, or code gave up after errors
    Authenticated, // 1 - should be able to grab a token for this tab
    TokenRejected, // 2 - was authorized, but a later request with token caused a 401 error
    Deauthenticated, // 3 - user deliberately logged out
}

/* Env Value */
export const chromeIdentityIsSupported =
  window && 'chrome' in window && 'identity' in window.chrome;
/* Persist - actual persistence handled in initializeStorage */
let authState = ref(AuthState.NotAuthenticated);
let token = ref("");
/* Tab Only */
export let authError = ref(false);
export let authErrorMessage = ref("");
/* Internal */
let initializedFromStorage = false;
const authenticatedCallbacks: (() => any)[] = [];
const DefaultAuthError = 'Could not authenticate. Try again later.';

export function registerAuthenticatedCallback (callback: () => any) {
    authenticatedCallbacks.push(callback)
}

/* This mainly bumps the token and tries to catch errors early */
export function authOnNewTab () : void {
    if (authState.value === AuthState.Authenticated) {
        authenticateSilentlyForToken() 
    }
}

export function authenticateSilentlyForToken () : void {
    if (authState.value === AuthState.Authenticated) {
        authenticate(false);
    } else {
        console.warn("Silent authentication can only be attempted if was previously authenticated");
    }
}

export function authenticateInteractively () : void {
    authenticate(true);
}

export function deauthenticate () : void {
    console.log("Attempting to deauthenticate");
    fetch('https://accounts.google.com/o/oauth2/revoke?token=' + token.value)
        .then((response) => {
            if (response.ok) {
                chrome.identity.removeCachedAuthToken({ token: token.value }, () => {})
                token.value = ""
                authState.value = AuthState.Deauthenticated
                console.log("Deauthenticated"); 
            } else {
                throw new Error('Could not revoke token: ' + response.text() );
            }
        })
}

function clearToken () {
    chrome.identity.removeCachedAuthToken({ token: token.value }, () => {})
    token.value = ""
}

export function onTokenRejected () : void {
    // Current Behavior: Treat rejected as a deauth and require new interactive flow.
    clearToken();
    authState.value = AuthState.TokenRejected
    // Alternate Behavior, tries to stay logged in
    // We first retry (e.g. via AuthState.TokenRetrying)
    // if AuthState.TokenRetrying is already our AuthState, then we deauthenticate fully via AuthState.TokenRejected
}

/** Initialize auth values from storage if needed and return */
export async function getAuthStateAndToken () {
    if (!initializedFromStorage) {
        token = await useStorageValue<string>('token', '', token)
        authState = await useStorageValue<AuthState>('authState', AuthState.NotAuthenticated, authState)
        initializedFromStorage = true
    }
    return {
        token,
        authState
    }
}

function onAuthenticationError (interactive: boolean, errorMessage: string = DefaultAuthError) {
    console.error("Authentication error: " + errorMessage);
    clearToken();
    if (interactive) {
        authErrorMessage.value = errorMessage;
        authError.value = true;
    }
}

function authenticate (interactive: boolean = true) {
    try {
        chrome.identity.getAuthToken(
            { interactive },
            function (returnedToken) {
                // This sucks, why can't Chrome use standard error throwing or callbacks?
                if (chrome.runtime.lastError) {
                    if (
                        chrome.runtime.lastError.message === 'OAuth2 not granted or revoked.' ||
                        chrome.runtime.lastError.message === 'The user did not approve access.'
                    ) {
                        onAuthenticationError(interactive, 'You must grant New Day calendar access permissions on your Google Account');
                    } else {
                        console.debug('chrome.runtime.lastError within getAuthToken', chrome.runtime.lastError)
                    }
                }
                if (returnedToken) {
                    console.log("Authentication success ", returnedToken);
                    authState.value = AuthState.Authenticated
                    token.value = returnedToken
                    authErrorMessage.value = "";
                    authError.value = false;
                    authenticatedCallbacks.forEach(callback => callback())
                }
            }
        );
    } catch (error) {
        onAuthenticationError(interactive);
    }
}
