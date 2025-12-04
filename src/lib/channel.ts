import { defer } from '@/utils/utils'

type Receiver<T> = (value: T) => void
type Sender<T> = {
  value: T
  resolve: () => void
}

/**
 * A simple FIFO channel for sending and receiving messages asynchronously.
 */
export class Channel<T> {
  private senders: Sender<T>[] = []
  private receivers: Receiver<T>[] = []

  /**
   * Returns the number of items currently in the channel's queue.
   */
  get length(): number {
    return this.senders.length
  }

  /**
   * Sends data to the channel.
   * If there are any receivers waiting, the data is immediately delivered to the first one.
   * Otherwise, the data is queued until a receiver is available.
   */
  async send(data: T): Promise<void> {
    return new Promise((resolve) => {
      const receiver = this.receivers.shift()
      if (receiver)
        // Defers the call to make the behavior deterministic
        defer(() => {
          receiver(data)
          resolve()
        })
      else this.senders.push({ value: data, resolve })
    })
  }

  /**
   * Returns an async generator that yields values as they are received.
   */
  async *iter(): AsyncGenerator<T> {
    while (true) {
      yield await this.receive()
    }
  }

  /**
   * Receives data from the channel.
   * If there is data in the queue, it is immediately returned.
   * Otherwise, the receiver waits until data is sent to the channel.
   */
  async receive(): Promise<T> {
    return new Promise<T>((resolve) => {
      const sender = this.senders.shift()
      if (sender) {
        sender.resolve()
        resolve(sender.value)
      } else {
        this.receivers.push(resolve)
      }
    })
  }
}
