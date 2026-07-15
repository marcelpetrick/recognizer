import {
  clearGameData,
  defaultGameData,
  loadGameData,
  saveGameData,
  storageKey,
} from './storage'
import { emptyRankings } from './rankings'

function createMemoryStorage(): Storage {
  const data = new Map<string, string>()
  return {
    get length() {
      return data.size
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => data.delete(key),
    setItem: (key, value) => data.set(key, value),
  }
}

describe('local game storage', () => {
  it('round-trips validated data', () => {
    const storage = createMemoryStorage()
    const data = {
      ...defaultGameData(),
      preferences: { ...defaultGameData().preferences, playerName: 'Mia' },
      nextInsertionOrder: 3,
    }

    expect(saveGameData(storage, data)).toBe(true)
    expect(loadGameData(storage)).toEqual(data)
  })

  it('recovers from malformed data and storage failures', () => {
    const storage = createMemoryStorage()
    storage.setItem(storageKey, '{not valid json')
    expect(loadGameData(storage)).toEqual(defaultGameData())

    const failingStorage = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
      removeItem: () => {
        throw new Error('blocked')
      },
    }
    expect(loadGameData(failingStorage)).toEqual(defaultGameData())
    expect(saveGameData(failingStorage, defaultGameData())).toBe(false)
    expect(clearGameData(failingStorage)).toBe(false)
  })

  it('clears saved data', () => {
    const storage = createMemoryStorage()
    saveGameData(storage, defaultGameData())
    expect(clearGameData(storage)).toBe(true)
    expect(storage.getItem(storageKey)).toBeNull()
  })

  it('migrates legacy v1 data to the current version, defaulting language to English', () => {
    const storage = createMemoryStorage()
    const rankings = emptyRankings()
    rankings[10] = [
      {
        id: 'a',
        playerName: 'Mia',
        challengeSize: 10,
        elapsedMs: 4200,
        completedAt: 1000,
        insertionOrder: 0,
      },
    ]
    const legacyData = {
      version: 1,
      preferences: {
        playerName: 'Mia',
        challengeSize: 10,
        soundEnabled: true,
        reducedMotion: false,
      },
      rankings,
      nextInsertionOrder: 1,
    }
    storage.setItem(storageKey, JSON.stringify(legacyData))

    const loaded = loadGameData(storage)
    expect(loaded.version).toBe(2)
    expect(loaded.preferences).toEqual({
      playerName: 'Mia',
      challengeSize: 10,
      soundEnabled: true,
      reducedMotion: false,
      language: 'en',
    })
    expect(loaded.rankings).toEqual(rankings)
    expect(loaded.nextInsertionOrder).toBe(1)
  })
})
