import { emptyRankings, rankingLimit, type TieredRankings } from './rankings'
import {
  challengeSizes,
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

function isPreferencesBase(
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

function parseRankings(value: unknown): TieredRankings | undefined {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  const rankingRecord = value as Record<string, unknown>
  const rankings = emptyRankings()
  for (const tier of challengeSizes) {
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
      .slice(0, rankingLimit)
  }
  return rankings
}

const supportedVersions = [1, currentVersion] as const

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
    data.nextInsertionOrder < 0 ||
    !supportedVersions.includes(data.version as 1 | typeof currentVersion) ||
    !isPreferencesBase(data.preferences)
  ) {
    return undefined
  }

  // Every schema version shares this base shape; only `language` (added in
  // v2) needs repairing when it's missing (v1 data) or invalid.
  const storedLanguage = (data.preferences as Record<string, unknown>).language
  const language = isLanguage(storedLanguage) ? storedLanguage : 'en'

  return {
    version: currentVersion,
    preferences: { ...data.preferences, language },
    rankings,
    nextInsertionOrder: data.nextInsertionOrder,
  }
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
