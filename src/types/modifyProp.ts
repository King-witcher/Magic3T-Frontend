export type ModifyProp<T extends object, TFrom, TTo> = {
  [K in keyof T]: Exclude<T[K], undefined> extends TFrom
    ? TTo
    : T[K] extends object
    ? ModifyProp<T[K], TFrom, TTo>
    : T[K]
}
