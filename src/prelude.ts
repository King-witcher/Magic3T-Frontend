import {
  Result as ResultClass,
  Err as ResultErr,
  Ok as ResultOk,
} from '@/utils/rust/result'

window.Ok = ResultOk
window.Err = ResultErr

declare global {
  type Result<T, E> = ResultClass<T, E>
  function Ok<T, E>(data: T): ResultClass<T, E>
  function Err<T, E>(error: E): ResultClass<T, E>
}
