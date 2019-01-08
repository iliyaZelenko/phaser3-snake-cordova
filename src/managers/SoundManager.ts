export default class SoundManager {
  public sounds: {[key: string]: Phaser.Sound.BaseSound} = {}

  public add (sound: Phaser.Sound.BaseSound | Phaser.Sound.BaseSound[]) {
    if (sound instanceof Phaser.Sound.BaseSound) {
      this.sounds[sound.key] = sound
    }
    if (Array.isArray(sound)) {
      sound.forEach(this.add.bind(this))
    }
  }

  public get (key: string): Phaser.Sound.BaseSound {
    return this.sounds[key]
  }

  public play (key: string) {
    this.get(key).play()
  }
}
