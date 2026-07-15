import type { Preferences } from '../domain/types'
import type { Translations } from '../i18n'

interface SettingsViewProps {
  readonly t: Translations
  readonly soundEnabled: boolean
  readonly reducedMotion: boolean
  readonly onUpdatePreferences: (changes: Partial<Preferences>) => void
  readonly onClearData: () => void
  readonly onBack: () => void
}

export function SettingsView({
  t,
  soundEnabled,
  reducedMotion,
  onUpdatePreferences,
  onClearData,
  onBack,
}: SettingsViewProps) {
  return (
    <main className="app-shell">
      <section className="panel settings-panel">
        <p className="eyebrow">{t.settings}</p>
        <h1>{t.playYourWay}</h1>
        <label className="setting-toggle">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(event) =>
              onUpdatePreferences({ soundEnabled: event.target.checked })
            }
          />
          {t.enableSounds}
        </label>
        <label className="setting-toggle">
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(event) =>
              onUpdatePreferences({ reducedMotion: event.target.checked })
            }
          />
          {t.reduceAnimations}
        </label>
        <button
          className="button button-danger"
          type="button"
          onClick={() => {
            if (window.confirm(t.clearDataConfirm)) {
              onClearData()
            }
          }}
        >
          {t.clearData}
        </button>
        <button
          className="text-button menu-help"
          type="button"
          onClick={onBack}
        >
          {t.backToMenu}
        </button>
      </section>
    </main>
  )
}
