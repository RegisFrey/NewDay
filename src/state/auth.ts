
enum AuthState {
    NotAuthenticated, // either never attempted auth, or code gave up after errors
    Authenticated, // should be able to grab a token for this tab
    TokenRejected, // was authorized, but a later request with token caused a 401 error
    Deauthenticated, // user deliberately logged out
}

/* Persist */
export let authState: AuthState = AuthState.NotAuthenticated; // await useStorageValue<boolean>('authenticated', AuthState.NotAuthenticated),
export let token = ""; // store in Sync? // await useStorageValue<boolean>('token', ''),
/* Tab only */
export let authError = false;
export let authErrorMessage = "";

export function authOnNewTab () : void {
    if (authState === AuthState.Authenticated) {
        authenticateSilentlyForToken()
    }
}

export function authenticateSilentlyForToken () : void {
    if (authState === AuthState.Authenticated) {
        authenticate(false);
    } else {
        console.warn("Silent authentication can only be attempted if was previously authenticated");
    }
}

export function authenticateInteractively () : void {
    authenticate(true);
}

export function deauthenticate () : void {
    token = ""
    authState === AuthState.Deauthenticated
    // TODO: actually revoke the OAuth permissions 
}

export function tokenRejected () : void {
    token = "" // clear bad token?
    authState === AuthState.TokenRejected
}

function authenticate (interactive: boolean) {
    try {
        chrome.identity.getAuthToken(
            { interactive: true },
            function (_token) {
                if (_token) {
                    console.log("Authenticate success ", _token);
                    authState === AuthState.Authenticated
                    token = _token
                    authErrorMessage = "";
                    authError = false;
                }
            }
        );
    } catch (error) {
        console.log("Authenticate error ", error);
        
        token = ""
        authState = AuthState.NotAuthenticated

        if (interactive) {
            authErrorMessage = error.message;
            authError = true;
        }
    }
}
