export function cleanEnv<T>(env: T, _spec: any): T {
  return env;
}
export function str(_opts?: any): any {
  return undefined;
}
export function num(_opts?: any): any {
  return undefined;
}
export function bool(_opts?: any): any {
  return undefined;
}
export function url(_opts?: any): any {
  return undefined;
}
export function makeValidator<T>(fn: (input: string) => T): (input: string) => T {
  return fn;
}
