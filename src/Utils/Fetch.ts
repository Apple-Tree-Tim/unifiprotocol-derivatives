export const fetchJSON = <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  return fetch(endpoint, options).then((res) => res.json())
}
