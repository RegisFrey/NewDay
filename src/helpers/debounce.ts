export enum DebounceMode {
  EachCallResetsTimeout,
  FirstThenIgnoreForTimeout,
}

/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<T extends Function>(callback: T, wait = 500, mode: DebounceMode = DebounceMode.EachCallResetsTimeout): any {
  if (mode === DebounceMode.EachCallResetsTimeout) {
    return debounceEachCallResetsTimeout(callback, wait);
  } else if (mode === DebounceMode.FirstThenIgnoreForTimeout) {
    return debounceFirstThenIgnoreForTimeout(callback, wait);
  }
}

/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounceEachCallResetsTimeout<T extends Function>(callback: T, wait = 500): any {
  let timeoutId = 0;
  const callable = (...args: any) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), wait);
  };
  return <T>(<any>callable);
}

export function debounceFirstThenIgnoreForTimeout<T extends Function>(callback: T, wait = 500): any {
  let timer = 0;
  const callable = (...args: any) => {
    if (Date.now() - timer > wait) {
      timer = Date.now();
      return callback(...args);
    }
  };
  return <T>(<any>callable);
}