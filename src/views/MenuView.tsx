import {
  challengeSizes,
  languages,
  type ChallengeSize,
  type Language,
  type Preferences,
} from '../domain/types'
import { translations, type Translations } from '../i18n'

interface MenuViewProps {
  readonly t: Translations
  readonly language: Language
  readonly playerName: string
  readonly challengeSize: ChallengeSize
  readonly onUpdatePreferences: (changes: Partial<Preferences>) => void
  readonly onStartGame: () => void
  readonly onShowHelp: () => void
  readonly onShowRankings: () => void
  readonly onShowSettings: () => void
}

export function MenuView({
  t,
  language,
  playerName,
  challengeSize,
  onUpdatePreferences,
  onStartGame,
  onShowHelp,
  onShowRankings,
  onShowSettings,
}: MenuViewProps) {
  return (
    <main className="app-shell">
      <section className="panel menu-panel">
        <div
          className="language-picker"
          role="group"
          aria-label={t.languagePickerLabel}
        >
          {languages.map((code) => (
            <button
              key={code}
              className={`language-button${language === code ? ' is-active' : ''}`}
              type="button"
              aria-pressed={language === code}
              onClick={() => onUpdatePreferences({ language: code })}
            >
              {translations[code].languageCode}
            </button>
          ))}
        </div>
        <p className="eyebrow">{t.visualConcentrationEyebrow}</p>
        <h1>{t.appTitle}</h1>
        <p className="intro">{t.tagline}</p>
        <label className="field-label" htmlFor="player-name">
          {t.yourNameLabel} <span>{t.optionalLabel}</span>
        </label>
        <input
          id="player-name"
          className="name-input"
          value={playerName}
          maxLength={24}
          autoComplete="nickname"
          placeholder={t.namePlaceholder}
          onChange={(event) =>
            onUpdatePreferences({ playerName: event.target.value })
          }
        />
        <fieldset className="challenge-picker">
          <legend>{t.chooseChallenge}</legend>
          <div className="tier-buttons">
            {challengeSizes.map((size) => (
              <button
                key={size}
                className={`tier-button${challengeSize === size ? ' is-active' : ''}`}
                type="button"
                aria-label={t.challengeSizeLabel(size)}
                aria-pressed={challengeSize === size}
                onClick={() => onUpdatePreferences({ challengeSize: size })}
              >
                <strong>{size}</strong>
                <span>{t.cardsUnit}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <button
          className="button start-button"
          type="button"
          onClick={onStartGame}
        >
          {t.startChallenge}
        </button>
        <button
          className="text-button menu-help"
          type="button"
          onClick={onShowHelp}
        >
          {t.howToPlay}
        </button>
        <div className="menu-links">
          <button
            className="text-button"
            type="button"
            onClick={onShowRankings}
          >
            {t.rankings}
          </button>
          <button
            className="text-button"
            type="button"
            onClick={onShowSettings}
          >
            {t.settings}
          </button>
        </div>
        <p className="version-tag">v{__APP_VERSION__}</p>
      </section>
    </main>
  )
}
