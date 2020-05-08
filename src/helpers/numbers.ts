export function toInteger (num: string): number {
  const res = parseInt(num, 10);

  if (isNaN(res)) {
    return 0;
  }
  return res;
}
