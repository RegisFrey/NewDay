/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<T extends Function>(callback: T, wait = 500): any {
  let timeoutId = 0;
  const callable = (...args: any) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), wait);
  };
  return <T>(<any>callable);
}
