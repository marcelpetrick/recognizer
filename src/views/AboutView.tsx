import type { Translations } from '../i18n'

// The canonical project locations. Kept out of the translation tables: they
// are the same in every language, and a mistyped copy per language would be a
// broken link nobody notices.
const repositoryUrl = 'https://github.com/marcelpetrick/recognizer'
const licenseUrl = `${repositoryUrl}/blob/master/LICENSE`
const authorEmail = 'mail@marcelpetrick.it'
const authorName = 'Marcel Petrick'

interface AboutViewProps {
  readonly t: Translations
  readonly onBack: () => void
}

export function AboutView({ t, onBack }: AboutViewProps) {
  return (
    <main className="app-shell">
      <section className="panel about-panel">
        <p className="eyebrow">{t.about}</p>
        <h1>{t.appTitle}</h1>
        <p className="intro">{t.tagline}</p>
        <dl className="about-list">
          <div className="about-row">
            <dt>{t.aboutAuthorLabel}</dt>
            <dd>
              {authorName}{' '}
              <a className="text-link" href={`mailto:${authorEmail}`}>
                {authorEmail}
              </a>
            </dd>
          </div>
          <div className="about-row">
            <dt>{t.aboutLicenseLabel}</dt>
            <dd>
              <a
                className="text-link"
                href={licenseUrl}
                target="_blank"
                rel="noreferrer"
              >
                GPL-3.0-or-later
              </a>
            </dd>
          </div>
          <div className="about-row">
            <dt>{t.aboutVersionLabel}</dt>
            <dd>v{__APP_VERSION__}</dd>
          </div>
        </dl>
        <p className="about-note">{t.aboutLicenseNote}</p>
        <a
          className="button button-secondary back-button"
          href={repositoryUrl}
          target="_blank"
          rel="noreferrer"
        >
          {t.aboutSourceCode}
        </a>
        <button
          className="button button-secondary back-button"
          type="button"
          onClick={onBack}
        >
          {t.backToMenu}
        </button>
      </section>
    </main>
  )
}
