import 'phaser'
import '~/styles/main.sass'
import Game from '~/Game'
import gameConfig, { pauseBtn, restartBtn, debugBtn, debugGrid } from '~/config'

const onReady = () => {
  window.game = new Game(gameConfig)
  console.log('ready!')
}

document.addEventListener('deviceready', onReady)
// window.addEventListener('resize', () => {
//   game.resize(window.innerWidth, window.innerHeight)
// })

if (pauseBtn) {
  pauseBtn.addEventListener('click', () => {
    const scene = window.game.scene.getScene('GameScene')
    const method = scene.sys.isPaused() ? 'resume' : 'pause'
    const datasetKey = scene.sys.isPaused() ? 'pause' : 'resume'

    if (pauseBtn) {
      pauseBtn.textContent = pauseBtn.dataset[datasetKey] || null
    }

    scene.sys[method]()
  })
}
if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    window.game.scene.start('GameScene')
  })
}
if (debugBtn) {
  debugBtn.addEventListener('click', () => {
    if (debugGrid) {
      const isDebug = [undefined, '0'].includes(debugGrid.dataset.hide)

      // '0' or '1'
      debugGrid.dataset.hide = (+isDebug).toString()
      debugGrid.classList.toggle('game__grid--hidden', !isDebug)

      window.game.events.emit('app_toggle_debug', isDebug)
    }
  })
}
