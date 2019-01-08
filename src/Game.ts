import { gameContainer, overlay } from '~/config'

export default class Game extends Phaser.Game {
  constructor (GameConfig: GameConfig) {
    super(GameConfig)

    // or like in the canvasContainer width and height
    gameContainer.style.width = 'unset'
    gameContainer.style.height = 'unset'
  }

  public hideOverlay () {
    if (!overlay) {
      return
    }
    overlay.classList.add('game__overlay--hidden')
  }

  public showOverlay () {
    if (!overlay) {
      return
    }
    overlay.classList.remove('game__overlay--hidden')
  }
}
