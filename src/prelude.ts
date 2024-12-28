import {
  Result as ResultClass,
  Ok as ResultOk,
  Err as ResultErr,
} from '@/utils/rust/result'

window.Ok = ResultOk
window.Err = ResultErr

declare global {
  type Result<T, E> = ResultClass<T, E>
  function Ok<T, E>(data: T): ResultClass<T, E>
  function Err<T, E>(error: E): ResultClass<T, E>
}
