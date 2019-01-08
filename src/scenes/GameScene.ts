import AppleBonus from '~/objects/bonus/AppleBonus'
import Snake from '~/objects/snake'
import { ceilsXCount, ceilsYCount, ceil, gameWidth, gameHeight, dephs } from '~/config'
import Overlay from '~/overlay/Overlay'
import Timer from '~/overlay/Timer'
import LocalStorage from '~/storage/LocalStorage'
import AbstractStorage from '~/storage/AbstractStorage'
import SoundManager from '~/managers/SoundManager'
import PlumBonus from '~/objects/bonus/PlumBonus'
import PearBonus from '~/objects/bonus/PearBonus'
import GrapesBonus from '~/objects/bonus/GrapesBonus'
import PeachBonus from '~/objects/bonus/PeachBonus'
import ApricotBonus from '~/objects/bonus/ApricotBonus'

export default class GameScene extends Phaser.Scene {
  public readonly snakeStartX = this.getCeilXPos(Math.floor(ceilsXCount / 2))
  public readonly snakeStartY = this.getCeilYPos(Math.floor(ceilsYCount / 2))

  public snake!: Snake
  public overlay!: Overlay
  public timer!: Timer
  public storage!: AbstractStorage
  public soundManager!: SoundManager

  private worldIterations = 0
  // TODO хранить в массиве сами бонусы, потом проходится по ним для получения позиций
  private bonusesPositions: any[] = []

  // texts
  private fpsText!: Phaser.GameObjects.BitmapText
  private cursors!: Phaser.Input.Keyboard.CursorKeys

  constructor () {
    super({
      key: 'GameScene'
    })
  }

  public init (): void {
    this.snake = new Snake(this, this.snakeStartX, this.snakeStartY)
    this.overlay = new Overlay(this)
    this.timer = new Timer(() => {
      this.overlay.updateTimer()
    })
    this.storage = new LocalStorage()
    this.soundManager = new SoundManager()

    window.game.showOverlay()

    // input
    this.cursors = this.input.keyboard.createCursorKeys()

    this.addFPSText()
    this.addEventsListeners()
  }

  public create (): void {
    const sprite = this.add.tileSprite(0, 0, gameWidth * 2, gameHeight * 2, 'background')

    sprite.setDepth(dephs.background)

    this.soundManager.add([
      this.sound.add('eat1'),
      this.sound.add('eat2'),
      this.sound.add('eat3'),
      this.sound.add('eat4'),
      this.sound.add('eat5'),
      this.sound.add('dead')
    ])
  }

  // time - elapsed time in milliseconds (pause does not affect!)
  public update (time): void {
    const snakeMoveIterationsRange = 15 // - Math.floor(this.timer.getSeconds() / 4)
    const bonusIterationsRange = 50

    this.worldIterations += 1

    if (this.worldIterations % bonusIterationsRange === 0) {
      this.addBonus()
    }
    if (this.worldIterations % snakeMoveIterationsRange === 0) {
      this.handleInput()
      this.snake.move()

      this.checkCollision()
    }

    this.fpsText.setText(this.getFPS())

    if (this.snake.isDead()) {
      this.onDead()
    }
  }

  public handleInput (): void {
    const wantMoveDir = this.getDirByInput()

    this.snake.setDir(wantMoveDir)
  }

  public getDirByInput (presedKey?) {
    const input = {
      // Format: [button]: key
      [this.snake.DIRECTIONS.UP]: ['w', 'ArrowUp'],
      [this.snake.DIRECTIONS.RIGHT]: ['d', 'ArrowRight'],
      [this.snake.DIRECTIONS.DOWN]: ['s', 'ArrowDown'],
      [this.snake.DIRECTIONS.LEFT]: ['a', 'ArrowLeft']
    }

    // Same as below:
    for (const [button, keys] of Object.entries(input)) {
      if ((this.cursors[button] && this.cursors[button].isDown) || keys.includes(presedKey)) {
        return button
      }
    }
    // Same as above:
    // switch (true) {
    //   case (this.cursors.up && this.cursors.up.isDown) || presedKey === 'w':
    //     return this.snake.DIRECTIONS.UP
    //   case (this.cursors.right && this.cursors.right.isDown) || presedKey === 'd':
    //     return this.snake.DIRECTIONS.RIGHT
    //   case (this.cursors.down && this.cursors.down.isDown) || presedKey === 's':
    //     return this.snake.DIRECTIONS.DOWN
    //   case (this.cursors.left && this.cursors.left.isDown) || presedKey === 'a':
    //     return this.snake.DIRECTIONS.LEFT
    // }
  }

  public getRandomCeil () {
    return this.getCeilFullPos(
      this.getRandomInt(1, ceilsXCount), this.getRandomInt(1, ceilsYCount)
    )
  }

  /**
   * Get ceil x coordinate by index
   * @param index from 1
   */
  public getCeilXPos (index: number): number {
    return index * ceil - (ceil / 2)
  }

  /**
   * Get ceil y coordinate by index
   * @param index from 1
   */
  public getCeilYPos (index: number): number {
    return index * ceil - (ceil / 2)
  }

  public getCeilFullPos (xIndex, yIndex) {
    return {
      x: this.getCeilXPos(xIndex),
      y: this.getCeilYPos(yIndex)
    }
  }

  private checkTaran () {
    const taran = this.snake.bodyPartsPositions
      .slice(0, -1)
      .find(i =>
        i.x === this.snake.snakeHeadX && i.y === this.snake.snakeHeadY
      )

    this.snake.setDead(taran)
  }

  private checkTakeBonus () {
    const snakeHalfSize = this.snake.size / 2

    const bonusPos = this.bonusesPositions.find(({ x: bonusX, y: bonusY }) =>
      this.snake.bodyPartsPositions.some(({ x: bodyX, y: bodyY }: any) =>
        bonusX >= bodyX - snakeHalfSize &&
        bonusY >= bodyY - snakeHalfSize &&
        bonusX <= bodyX + snakeHalfSize &&
        bonusY <= bodyY + snakeHalfSize
      )
    )

    if (bonusPos) {
      const bonus = bonusPos.bonus
      const randomSoundKey = 1 + Math.round(Math.random() * (5 - 1))

      this.bonusesPositions = this.bonusesPositions.filter(i => i !== bonusPos)

      bonus.onCollisionWithSnake()
      this.snake.onTakenBonus(bonus)
      this.soundManager.play('eat' + randomSoundKey)
    }
  }

  // TODO bonus does not appear on the snake
  private addBonus () {
    const ceilPos = this.getRandomCeil()
    const bonuses = [AppleBonus, PlumBonus, PearBonus, GrapesBonus, PeachBonus, ApricotBonus]
    const randomBonus = bonuses[Math.round(Math.random() * bonuses.length - 1)]

    const apple = new randomBonus(this, ceilPos)

    this.bonusesPositions.push({ ...ceilPos, bonus: apple })
  }

  private checkCollision (): void {
    this.checkTakeBonus()
    this.checkTaran()
  }

  private getRandomInt (min: number, max: number): number {
    // let rand = Math.round(min - 0.5 + Math.random() * (max - min + 1))
    // return rand

    return Phaser.Math.RND.between(min, max)
  }

  private addEventsListeners () {
    this.input.keyboard.on('keydown', ({ key }) => {
      this.snake.setDir(
        this.getDirByInput(key)
      )
    })
    this.events.on('pause', () => {
      this.timer.pause()
    })
    this.events.on('resume', () => {
      this.timer.resume()
    })
    window.game.events.on('swipe', (dir) => {
      this.snake.setDir(dir)
    })
    window.game.events.on('app_toggle_debug', (isDebug: boolean) => {
      this.fpsText.setVisible(isDebug)
    })
  }

  private onDead () {
    const score = this.overlay.getApplesCounter()
    const maxScore = this.storage.get('max-score')

    if (score > maxScore || maxScore === undefined) {
      this.storage.set('max-score', score)
    }

    this.soundManager.play('dead')
    this.scene.start('MainMenuScene')
  }

  private getFPS () {
    return 'FPS: ' + window.game.loop.actualFps.toFixed(0).toString()
  }

  private addFPSText () {
    this.fpsText = this.add.bitmapText(
      2,
      2,
      'main-font',
      this.getFPS(),
      8
    )
    .setDepth(dephs.text)
    .setVisible(false) // change if necessary
  }
}
