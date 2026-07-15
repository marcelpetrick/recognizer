import type { Translations } from '../i18n'

interface HelpViewProps {
  readonly t: Translations
  readonly onBack: () => void
}

export function HelpView({ t, onBack }: HelpViewProps) {
  return (
    <main className="app-shell">
      <section className="panel help-panel">
        <p className="eyebrow">{t.howToPlay}</p>
        <h1>{t.helpTitle}</h1>
        <ol>
          {t.helpSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p>{t.helpNote}</p>
        <button className="button" type="button" onClick={onBack}>
          {t.backToMenu}
        </button>
      </section>
    </main>
  )
}
