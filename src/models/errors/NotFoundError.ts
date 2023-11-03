export class NotFoundError extends Error {
  constructor(collection: string, id: string) {
    super(`Couldn't find document with id ${id} in collection ${collection}.`)
  }
}
