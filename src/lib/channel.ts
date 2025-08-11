type Resolver<T> = (value: T) => void

export class Channel<T> {
  private queue: T[] = []
  private waitingResolvers: Resolver<T>[] = []

  send(data: T): void {
    const resolver = this.waitingResolvers.shift()
    if (resolver) resolver(data)
    else this.queue.push(data)
  }

  async receive(): Promise<T> {
    return new Promise<T>((resolve) => {
      const el = this.queue.shift()
      if (el) resolve(el)
      else this.waitingResolvers.push(resolve)
    })
  }
}
