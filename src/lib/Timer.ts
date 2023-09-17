export class Timer {
  private remainingMs: number
  private remainingAt: number | null = null

  constructor(timeSecs: number) {
    this.remainingMs = timeSecs * 1000
  }

  pause() {
    if (!this.remainingAt) return

    this.remainingMs = this.remainingMs + (this.remainingAt - Date.now())
    this.remainingAt = null
  }

  start() {
    if (this.remainingAt) return

    this.remainingAt = Date.now()
  }

  setRemaining(timeSecs: number) {
    this.remainingMs = timeSecs * 1000
    if (this.remainingAt) this.remainingAt = Date.now()
  }

  getRemaining(): number {
    if (this.remainingAt) {
      const result = (this.remainingMs + (this.remainingAt - Date.now())) / 1000
      return result >= 0 ? result : 0
    } else {
      const result = this.remainingMs / 1000
      return result >= 0 ? result : 0
    }
  }
}
