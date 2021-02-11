export function debounce<T extends Function>(callback: T, wait = 500) {
  let h = 0;
  const callable = (...args: any) => {
    window.clearTimeout(h);
    h = window.setTimeout(() => callback(...args), wait);
  };
  return <T>(<any>callable);
}
