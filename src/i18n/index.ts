import type { Language } from '../domain/types'
import { de, en, hr, type Translations } from './translations'

export type { Translations }

export const translations: Record<Language, Translations> = { en, hr, de }
