export class Timer {
  private remainingMs: number
  private remainingAt: number | null = null

  constructor(time: number) {
    this.remainingMs = time
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

  setRemaining(time: number) {
    this.remainingMs = time
    if (this.remainingAt) this.remainingAt = Date.now()
  }

  getRemaining(): number {
    if (this.remainingAt) {
      const result = this.remainingMs + (this.remainingAt - Date.now())
      return result >= 0 ? result : 0
    }
    const result = this.remainingMs
    return result >= 0 ? result : 0
  }

  reset(remainingMs: number) {
    this.remainingAt = null
    this.remainingMs = remainingMs
  }
}
