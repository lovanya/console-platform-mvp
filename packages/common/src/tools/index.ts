export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object'
}

export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function'
}
