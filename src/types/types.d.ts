import Game from '~/game'

declare global {
  interface Window {
    game: Game
  }
}
