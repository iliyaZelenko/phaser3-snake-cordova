export default class BootScene extends Phaser.Scene {
  constructor () {
    super({
      key: 'BootScene'
    })
  }

  public update (): void {
    this.scene.start('MainMenuScene')
  }

  public preload (): void {
    /* Text */
    this.load.bitmapFont(
      'main-font',
      'assets/font/snakeFont.png',
      'assets/font/snakeFont.fnt'
    )

    /* Sprites / Images */
    this.load.spritesheet('snake', 'assets/sprites/snake.png', {
      frameWidth: 64
      // frameHeight: 64
    })
    this.load.image('background', 'assets/sprites/background.png')
    this.load.image('timer', 'assets/sprites/timer.png')
    this.load.atlas('fruits', 'assets/sprites/fruits.png', 'assets/sprites/fruits.json')

    /* Sounds */
    this.load.audio('eat1', ['assets/audio/eat1.mp3'])
    this.load.audio('eat2', ['assets/audio/eat2.mp3'])
    this.load.audio('eat3', ['assets/audio/eat3.mp3'])
    this.load.audio('eat4', ['assets/audio/eat4.mp3'])
    this.load.audio('eat5', ['assets/audio/eat5.mp3'])
    this.load.audio('dead', ['assets/audio/dead.mp3'])
  }
}
