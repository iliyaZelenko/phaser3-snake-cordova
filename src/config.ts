import BootScene from '~/Scenes/bootScene'
import MainMenuScene from '~/scenes/MainMenuScene'
import GameScene from '~/scenes/GameScene'

import SwipePlugin from 'phaser3-swipe-plugin'

export const gameContainer: HTMLElement = document.querySelector('#game') || document.body
const gameContainerBCR = gameContainer.getBoundingClientRect()
const gameContainerW = gameContainerBCR.width // window.innerWidth
const gameContainerH = gameContainerBCR.height // window.innerHeight

export const canvasContainer: HTMLElement | null = document.querySelector('#game__canvas-wrap')
// this value needs to be changed in file styles/config.sass
export const ceil = 32
export const snakeSize = ceil
export const ceilsXCount = getCeilsCountByPixelsCount(gameContainerW) // - 1 (if scroll)
export const ceilsYCount = getCeilsCountByPixelsCount(gameContainerH)
export const gameWidth = ceilsXCount * ceil
export const gameHeight = ceilsYCount * ceil
export const dephs = {
  background: -2,
  apple: -1,
  text: 10,
  overlayRectangle: 9
}

export const overlay: HTMLElement | null = document.querySelector('#game__overlay')
export const pauseBtn: HTMLElement | null = document.querySelector('#pause-btn')
export const restartBtn: HTMLElement | null = document.querySelector('#restart-btn')
export const debugBtn: HTMLElement | null = document.querySelector('#debug-btn')
export const debugGrid: HTMLElement | null = document.querySelector('#game__grid')

const gameConfig: GameConfig = {
  width: gameWidth,
  height: gameHeight,
  type: Phaser.AUTO,
  parent: canvasContainer || undefined,
  scene: [BootScene, MainMenuScene, GameScene],
  // input: {
  //   keyboard: true,
  //   mouse: true,
  //   touch: true,
  //   gamepad: false
  // },
  fps: {
    target: 144,
    min: 60
  },
  backgroundColor: '#000000',
  plugins: {
    global: [
      {
        key: 'SwipePlugin',
        plugin: SwipePlugin,
        start: true
      }
    ]
  }
}

export default gameConfig

function getCeilsCountByPixelsCount (pixelsCount) {
  return Math.floor(pixelsCount / ceil)
}
