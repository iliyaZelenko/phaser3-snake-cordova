import AbstractStorage from '~/storage/AbstractStorage'
import LocalStorage from '~/storage/LocalStorage'

export default class MainMenuScene extends Phaser.Scene {
  public storage!: AbstractStorage
  private highscore: string | number = 2

  constructor () {
    super({
      key: 'MainMenuScene'
    })
  }

  public init (): void {
    this.storage = new LocalStorage()

    window.game.hideOverlay()
  }

  public create (): void {
    this.addEventsListeners()

    this.highscore = this.storage.get('max-score') // || 'You have no record'

    this.add.bitmapText(
      this.sys.canvas.width / 2 - 105,
      this.sys.canvas.height / 2 - 90,
      'main-font',
      'S N A K E',
      24
    )

    let text = 'PRES ANY KEY'

    if (this.highscore !== null) {
      text += '\n\n\n\n HIGHSCORE: ' + this.highscore
    }
    this.add.bitmapText(
      this.sys.canvas.width / 2 - 50,
      this.sys.canvas.height / 2 + 10,
      'main-font',
      text,
      8,
      1
    )
  }

  private addEventsListeners () {
    const startScene = () => {
      this.scene.start('GameScene')

      this.sys.canvas.removeEventListener('click', startScene)
      this.sys.canvas.removeEventListener('touchstart', startScene)
    }

    this.input.keyboard.on('keydown', startScene)
    this.sys.canvas.addEventListener('click', startScene)
    this.sys.canvas.addEventListener('touchstart', startScene)
  }
}
