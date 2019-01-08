import GameScene from '~/scenes/gameScene'

export default abstract class AbstractBonus {
  protected readonly scene: GameScene

  protected constructor (scene) {
    this.scene = scene
  }

  protected onCollisionWithSnake () {
    this.scene.overlay.incrementApplesCounter()
    this.scene.overlay.updateSnakeLength()
  }
}
