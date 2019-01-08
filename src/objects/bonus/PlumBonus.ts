import { ceil, dephs } from '~/config'
import AbstractBonus from '~/objects/bonus/AbstractBonus'

// extends Phaser.GameObjects.Graphics
export default class PlumBonus extends AbstractBonus {
  // private readonly scene: GameScene
  private readonly x: number
  private readonly y: number
  private readonly sprite: Phaser.GameObjects.Sprite

  constructor (scene, { x, y }) {
    super(scene)

    this.x = x
    this.y = y

    this.sprite = this.scene.add.sprite(this.x, this.y, 'fruits', 'sprite42')

    // setSize это другое
    this.sprite.setDisplaySize(ceil, ceil)
    this.sprite.setDepth(dephs.apple)
  }

  public getSprite (): Phaser.GameObjects.Sprite {
    return this.sprite
  }

  public onCollisionWithSnake () {
    super.onCollisionWithSnake()

    const sprite = this.getSprite()

    sprite.destroy()
  }
}
