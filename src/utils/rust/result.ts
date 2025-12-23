enum ResultTag {
  Ok = 0,
  Err = 1,
}

/** @deprecated */
export class Result<T, E> {
  private constructor(
    private tag: ResultTag,
    private data: T | E
  ) {}

  is_ok() {
    return this.tag === ResultTag.Ok
  }
  is_err() {
    return this.tag === ResultTag.Err
  }

  static Ok<T, E>(data: T): Result<T, E> {
    return new Result<T, E>(ResultTag.Ok, data)
  }

  static Err<T, E>(data: E): Result<T, E> {
    return new Result<T, E>(ResultTag.Err, data)
  }

  match<MatchResult>({
    Ok,
    Err,
  }: { Ok(data: T): MatchResult; Err(data: E): MatchResult }): MatchResult {
    if (this.is_ok()) return Ok(this.data as unknown as T)
    return Err(this.data as E)
  }
}

/** @deprecated */
export const Ok = Result.Ok
/** @deprecated */
export const Err = Result.Err
