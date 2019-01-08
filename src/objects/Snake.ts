import { snakeSize, ceilsXCount, ceilsYCount } from '~/config'
import GameScene from '~/scenes/GameScene'
import AbstractBonus from '~/objects/bonus/AbstractBonus'

export default class Snake {
  public snakeHeadX: number
  public snakeHeadY: number
  public bodyPartsSprites: Phaser.GameObjects.Sprite[] = []
  // первый элемент - это конец хвоста, последний - начало змеи
  public bodyPartsPositions: any[]
  // съеденные бонусы (внутри змеи) в виде индексов относительно bodyPartsSprites элементов
  public bodyPartsBonuses: any[] = []
  public size: number
  public readonly DIRECTIONS = {
    UP: 'up',
    RIGHT: 'right',
    DOWN: 'down',
    LEFT: 'left'
  }
  private initialLength: number = 20
  private dead: boolean = false
  private currentDir: string = this.DIRECTIONS.UP
  private lastMoveDir: string = this.currentDir
  private scene: GameScene

  constructor (scene, x, y) {
    this.scene = scene
    this.snakeHeadX = x
    this.snakeHeadY = y
    this.size = snakeSize // this.scene.ceil * this.snakeCeilsSize
    this.bodyPartsPositions = this.getInitialSnakeBody()

    // build snake
    this.buildSnake()
  }

  public isDead (): boolean {
    return this.dead
  }
  public setDead (status: boolean): void {
    this.dead = status
  }

  public getTail () {
    return this.bodyPartsPositions[0]
  }

  public getHead () {
    return this.bodyPartsPositions[this.getSnakeLength() - 1]
  }

  public setDir (wantMoveDir) {
    const oldDir = this.lastMoveDir

    if (!oldDir || !wantMoveDir || wantMoveDir === this.getDirOpposite(oldDir)) {
      return
    }

    this.currentDir = wantMoveDir
  }

  public move (): void {
    const pos = {
      x: this.snakeHeadX,
      y: this.snakeHeadY
    }
    const dir = this.currentDir

    // changes pos variable
    this.changePosByDir(dir, pos)
    this.snakeHeadX = pos.x
    this.snakeHeadY = pos.y

    this.bodyPartsPositions.shift()
    this.bodyPartsPositions.push({
      ...pos,
      dir
    })

    // движение относительно границ
    this.moveRegardingWorldBoundaries()

    this.updateBodyPartsPositions()
    this.updateBodyPartsSpritesFrames()
    this.updateBodyPartsBonuses()

    this.lastMoveDir = this.currentDir
  }

  public moveRegardingWorldBoundaries () {
    const head = this.getHead()
    const xStartPos = this.scene.getCeilXPos(1)
    const yStartPos = this.scene.getCeilYPos(1)
    const xEndPos = this.scene.getCeilXPos(ceilsXCount)
    const yEndPos = this.scene.getCeilYPos(ceilsYCount)

    let x
    let y

    if (head.x < xStartPos) {
      x = xEndPos
    }
    if (head.x > xEndPos) {
      x = xStartPos
    }
    if (head.y < yStartPos) {
      y = yEndPos
    }
    if (head.y > yEndPos) {
      y = yStartPos
    }

    this.setSnakeHeadPos(x, y)
  }

  public setSnakeHeadPos (x, y) {
    const head = this.getHead()

    // x === undefined || x === null
    if (!x && x !== 0) {
      x = head.x
    }
    if (!y && y !== 0) {
      y = head.y
    }

    head.x = this.snakeHeadX = x
    head.y = this.snakeHeadY = y
  }

  public onTakenBonus (bonus: AbstractBonus) {
    // this.growSnake()

    const posIndex = this.getSnakeLength() - 2 // "- 1" — head
    const { x, y } = this.bodyPartsPositions[posIndex]
    const sprite = this.addBodyBonusSprite(x, y)

    this.bodyPartsBonuses.push({
      posIndex,
      sprite
    })
  }

  public growSnake () {
    const tail = this.getTail()
    const newDir = this.getDirOpposite(tail.dir)
    const newTailPos = {
      ...tail,
      dir: newDir
    }
    this.changePosByDir(newDir, newTailPos)

    this.bodyPartsPositions.unshift({
      ...newTailPos
    })
    this.bodyPartsSprites.unshift(
      this.addSprite(newTailPos.x, newTailPos.y)
    )

    // end of tail (0 - tail index)
    this.updateBodyPartsSpritesFrames(0)
    // and subsequent element
    this.updateBodyPartsSpritesFrames(1)

    // as a new element is added to the beginning of the array (end of the tail),
    // it is necessary to shift the elements by one position so that there is no correspondence
    this.bodyPartsBonuses = this.bodyPartsBonuses.map(k => ({ ...k, posIndex: ++k.posIndex }))
  }

  public getSnakeLength () {
    return this.bodyPartsPositions.length
  }

  private updateBodyPartsBonuses () {
    this.bodyPartsBonuses = this.bodyPartsBonuses.map((bonus) => {
      let { posIndex: i } = bonus
      const { sprite } = bonus

      // чем больше вычитание тем быстрее скорость перемещеняя в желудке
      i -= 2
      // if not zero
      if (i >= 0) {
        const { x, y } = this.bodyPartsPositions[i]

        // animated movement (bad idea)
        this.scene.add
          .tween({
            targets: sprite,
            x,
            y,
            duration: 100
          })
        // sprite.x = x
        // sprite.y = y
      } else {
        sprite.destroy()
        this.growSnake()
      }

      return { ...bonus, posIndex: i }
    }).filter(({ posIndex }) => posIndex >= 0) // filter >= 0 items (array indexes)
  }

  private updateBodyPartsPositions () {
    this.bodyPartsPositions.forEach((pos, i) => {
      const sprite = this.bodyPartsSprites[i]

      sprite.x = pos.x
      sprite.y = pos.y
    })
  }

  private updateBodyPartsSpritesFrames (specificPosIndex: number | null = null) {
    const HEAD = {
      up: 3,
      right: 4,
      down: 9,
      left: 8
    }
    const TAIL = {
      up: 13,
      right: 14,
      down: 19,
      left: 18
    }
    const MIDDLE = {
      vertical: 7,
      horizontal: 1
    }

    const process = (pos, i) => {
      const sprite = this.bodyPartsSprites[i]
      const dir = pos.dir
      const next = this.bodyPartsPositions[i + 1]

      const setTex = (frame) => {
        sprite.setTexture('snake', frame)
      }

      // head
      if (i === this.getSnakeLength() - 1) {
        setTex(HEAD[dir])
      } else if (!i) { // хвост
        // хвост не в повороте
        if (dir === next.dir) {
          setTex(TAIL[dir])
        } else { // ХВОСТ в повороте
          setTex(TAIL[next.dir])
        }
      } else if (dir !== next.dir) { // углы
        // for example, turnAndReverseTurn('up', 'left', 2) is equivalent to:
        // "if (dir === 'up' && next.dir === 'left' || dir === 'right' && next.dir === 'down') {"
        const turnAndReverseTurn = (dirStart, dirTurn, frame) => {
          if ((dir === dirStart && next.dir === dirTurn)
            || (dir === this.getDirOpposite(dirTurn) && next.dir === this.getDirOpposite(dirStart))
          ) {
            setTex(frame)
          }
        }

        turnAndReverseTurn(this.DIRECTIONS.UP, this.DIRECTIONS.LEFT, 2)
        turnAndReverseTurn(this.DIRECTIONS.UP, this.DIRECTIONS.RIGHT, 0)
        turnAndReverseTurn(this.DIRECTIONS.RIGHT, this.DIRECTIONS.UP, 12)
        turnAndReverseTurn(this.DIRECTIONS.LEFT, this.DIRECTIONS.UP, 5)
      } else { // middle part
        // ['right', 'left'].includes(dir)
        // const frame = ['up', 'down'].includes(dir) ? MIDDLE.vertical : MIDDLE.horizontal

        setTex([
          MIDDLE.horizontal,
          MIDDLE.vertical
        ][
          +[this.DIRECTIONS.UP, this.DIRECTIONS.DOWN].includes(dir)
          ])
      }
    }

    if (specificPosIndex !== null) {
      process(
        this.bodyPartsPositions[specificPosIndex],
        specificPosIndex
      )
    } else {
      this.bodyPartsPositions.forEach(process)
    }
  }

  private getInitialSnakeBody () {
    const body: any[] = []
    const partsCount = this.initialLength

    // важно чтобы начиналось с 0
    for (let i = 0; i < partsCount; i++) {
      // push тоже не работает
      body.unshift({
        x: this.snakeHeadX,
        y: this.snakeHeadY + this.size * i,
        dir: this.currentDir
      })
    }

    return body
  }

  private changePosByDir (dir, pos) {
    switch (dir) {
      case this.DIRECTIONS.UP:
        pos.y -= this.size
        break
      case this.DIRECTIONS.RIGHT:
        pos.x += this.size
        break
      case this.DIRECTIONS.DOWN:
        pos.y += this.size
        break
      case this.DIRECTIONS.LEFT:
        pos.x -= this.size
        break
    }

    return pos
  }

  private getDirOpposite (dir) {
    const dirs = [
      [this.DIRECTIONS.UP, this.DIRECTIONS.DOWN],
      [this.DIRECTIONS.RIGHT, this.DIRECTIONS.LEFT]
    ]

    for (const dirArr of dirs) {
      if (dirArr.includes(dir)) {
        return dirArr.find((i: string) => i !== dir)
      }
    }

    // Same as above:
    // switch (dir) {
    //   case this.DIRECTIONS.UP:
    //     return this.DIRECTIONS.DOWN
    //   case this.DIRECTIONS.RIGHT:
    //     return this.DIRECTIONS.LEFT
    //   case this.DIRECTIONS.DOWN:
    //     return this.DIRECTIONS.UP
    //   case this.DIRECTIONS.LEFT:
    //     return this.DIRECTIONS.RIGHT
    // }
  }

  private buildSnake (): void {
    for (const bodyPart of this.bodyPartsPositions) {
      this.bodyPartsSprites.push(
        this.addSprite(bodyPart.x, bodyPart.y)
      )
    }

    this.updateBodyPartsSpritesFrames()
  }

  private addSprite (x, y) {
    const sprite = this.scene.add.sprite(x, y, 'snake', 4)

    // setSize это другое
    sprite.setDisplaySize(this.size, this.size)

    return sprite
  }

  private addBodyBonusSprite (x, y) {
    const sprite = this.scene.add.sprite(x, y, 'snake', 16) // 15

    sprite.setDepth(3)
    sprite.setDisplaySize(this.size / 2, this.size / 2)

    return sprite
  }
}
