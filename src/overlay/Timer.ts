export default class Timer {
  private interval!: number
  private callImminentlyTimeout!: number
  private seconds: number = 0
  private dateLastCall?: Date
  private dateStart!: Date
  private datePause!: Date
  private readonly onTickCallback: () => void
  private readonly everyMs = 1000

  constructor (onTickCallback) {
    this.onTickCallback = onTickCallback

    this.start()
  }

  public pause () {
    clearInterval(this.interval)
    clearTimeout(this.callImminentlyTimeout)
    this.datePause = new Date()
  }

  public resume () {
    const dateLastCall = this.dateLastCall === undefined ? +this.dateStart : +this.dateLastCall
    // get ms diff TODO "this.datePause" very rarely > 1000
    const timeout = this.everyMs - (+this.datePause - dateLastCall)

    this.start(timeout)
  }

  public reset () {
    this.seconds = 0

    clearInterval(this.interval)
  }

  public getFormated () {
    return `0${this.seconds / 60 ^ 0}`.slice(-2) + ':' + ('0' + this.seconds % 60).slice(-2)
  }

  public getSeconds () {
    return this.seconds
  }

  private start (callImminentlyAfterMs: number | null = null) {
    const tick = () => {
      this.seconds++
      this.dateLastCall = new Date()
      this.onTickCallback()
    }

    this.dateStart = new Date()

    if (callImminentlyAfterMs !== null) {
      clearTimeout(this.callImminentlyTimeout)
      this.callImminentlyTimeout = setTimeout(() => {
        tick()

        clearInterval(this.interval)
        this.interval = setInterval(tick, this.everyMs)
      }, callImminentlyAfterMs)

      return
    }

    this.interval = setInterval(tick, this.everyMs)
  }
}
