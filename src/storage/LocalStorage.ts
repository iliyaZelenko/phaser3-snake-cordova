import AbstractStorage from '~/storage/AbstractStorage'

export default class LocalStorage extends AbstractStorage {
  public set (key, val) {
    localStorage.setItem(key, val)
  }

  public get (key): string | null {
    return localStorage.getItem(key)
  }
}
