export async function authenticateForCalendar(interactive = false) {
    debugger;
    const skipNoninteractiveAuth = !interactive && state?.doNotAuth.value;
    if (calendarIsSupported && !skipNoninteractiveAuth) {
      try {
        chrome.identity.getAuthToken({ interactive }, function (token) {
          if (state) {
            if (token) {
              debugger;
              state.doNotAuth.value = false;
              state.authenticated.value = true;
              state.oauthToken.value = token;
              state.authError.value = false;
              nextTick(() => updateCalendar());
            } else {
              state.authenticated.value = false;
              if (interactive) {
                state.authError.value = true;
              }
            }
          }
        });
      } catch (error) {
        if (interactive && state) {
          state.authError.value = true;
        }
        throw new Error('Cannot Get Authorization Token : ' + error);
      }
    }
  }
  