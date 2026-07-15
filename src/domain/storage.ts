import { emptyRankings, type TieredRankings } from './rankings'
import {
  isChallengeSize,
  isLanguage,
  type Preferences,
  type RankingEntry,
} from './types'

export const storageKey = 'recognizer-game:v1'

export const currentVersion = 2

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface StoredGameData {
  readonly version: typeof currentVersion
  readonly preferences: Preferences
  readonly rankings: TieredRankings
  readonly nextInsertionOrder: number
}

interface StoredGameDataV1 {
  readonly version: 1
  readonly preferences: Omit<Preferences, 'language'>
  readonly rankings: TieredRankings
  readonly nextInsertionOrder: number
}

export const defaultPreferences: Preferences = {
  playerName: '',
  challengeSize: 10,
  soundEnabled: false,
  reducedMotion: false,
  language: 'en',
}

export function defaultGameData(): StoredGameData {
  return {
    version: currentVersion,
    preferences: defaultPreferences,
    rankings: emptyRankings(),
    nextInsertionOrder: 0,
  }
}

function migrateFromV1(data: StoredGameDataV1): StoredGameData {
  return {
    version: currentVersion,
    preferences: { ...data.preferences, language: 'en' },
    rankings: data.rankings,
    nextInsertionOrder: data.nextInsertionOrder,
  }
}

function isRankingEntry(value: unknown): value is RankingEntry {
  if (!value || typeof value !== 'object') {
    return false
  }
  const entry = value as Record<string, unknown>
  return (
    typeof entry.id === 'string' &&
    typeof entry.playerName === 'string' &&
    typeof entry.elapsedMs === 'number' &&
    Number.isFinite(entry.elapsedMs) &&
    typeof entry.completedAt === 'number' &&
    Number.isFinite(entry.completedAt) &&
    typeof entry.insertionOrder === 'number' &&
    Number.isFinite(entry.insertionOrder) &&
    typeof entry.challengeSize === 'number' &&
    isChallengeSize(entry.challengeSize)
  )
}

function isPreferencesV1(
  value: unknown,
): value is Omit<Preferences, 'language'> {
  if (!value || typeof value !== 'object') {
    return false
  }
  const preferences = value as Record<string, unknown>
  return (
    typeof preferences.playerName === 'string' &&
    typeof preferences.challengeSize === 'number' &&
    isChallengeSize(preferences.challengeSize) &&
    typeof preferences.soundEnabled === 'boolean' &&
    typeof preferences.reducedMotion === 'boolean'
  )
}

function isPreferences(value: unknown): value is Preferences {
  return (
    isPreferencesV1(value) &&
    isLanguage((value as Record<string, unknown>).language)
  )
}

function parseRankings(value: unknown): TieredRankings | undefined {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  const rankingRecord = value as Record<string, unknown>
  const rankings = emptyRankings()
  for (const tier of [10, 20, 50] as const) {
    const entries = rankingRecord[tier]
    if (!Array.isArray(entries) || !entries.every(isRankingEntry)) {
      return undefined
    }
    rankings[tier] = entries
      .filter((entry) => entry.challengeSize === tier)
      .sort(
        (first, second) =>
          first.elapsedMs - second.elapsedMs ||
          first.insertionOrder - second.insertionOrder,
      )
      .slice(0, 10)
  }
  return rankings
}

export function parseGameData(value: unknown): StoredGameData | undefined {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  const data = value as Record<string, unknown>
  const rankings = parseRankings(data.rankings)
  if (
    !rankings ||
    typeof data.nextInsertionOrder !== 'number' ||
    !Number.isSafeInteger(data.nextInsertionOrder) ||
    data.nextInsertionOrder < 0
  ) {
    return undefined
  }

  if (data.version === 1 && isPreferencesV1(data.preferences)) {
    return migrateFromV1({
      version: 1,
      preferences: data.preferences,
      rankings,
      nextInsertionOrder: data.nextInsertionOrder,
    })
  }

  if (data.version === currentVersion && isPreferences(data.preferences)) {
    return {
      version: currentVersion,
      preferences: data.preferences,
      rankings,
      nextInsertionOrder: data.nextInsertionOrder,
    }
  }

  return undefined
}

export function loadGameData(storage?: StorageLike): StoredGameData {
  if (!storage) {
    return defaultGameData()
  }
  try {
    const raw = storage.getItem(storageKey)
    return raw
      ? (parseGameData(JSON.parse(raw)) ?? defaultGameData())
      : defaultGameData()
  } catch {
    return defaultGameData()
  }
}

export function saveGameData(
  storage: StorageLike | undefined,
  data: StoredGameData,
): boolean {
  if (!storage) {
    return false
  }
  try {
    storage.setItem(storageKey, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function clearGameData(storage?: StorageLike): boolean {
  if (!storage) {
    return false
  }
  try {
    storage.removeItem(storageKey)
    return true
  } catch {
    return false
  }
}
