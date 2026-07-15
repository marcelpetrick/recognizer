import { formatDuration } from '../domain/timer'
import type { ChallengeSize, RankingEntry } from '../domain/types'
import type { Translations } from '../i18n'

interface RankingsViewProps {
  readonly t: Translations
  readonly challengeSize: ChallengeSize
  readonly entries: readonly RankingEntry[]
  readonly onBack: () => void
}

export function RankingsView({
  t,
  challengeSize,
  entries,
  onBack,
}: RankingsViewProps) {
  return (
    <main className="app-shell">
      <section className="panel rankings-panel">
        <p className="eyebrow">{t.localRankings}</p>
        <h1>{t.bestTimes(challengeSize)}</h1>
        <ol className="ranking-list">
          {Array.from({ length: 10 }, (_, index) => {
            const entry = entries[index]
            return (
              <li key={entry?.id ?? `empty-${index}`}>
                <span>{index + 1}</span>
                <strong>
                  {entry ? entry.playerName || t.defaultPlayerName : '—'}
                </strong>
                <time>
                  {entry ? formatDuration(entry.elapsedMs, true) : '—'}
                </time>
              </li>
            )
          })}
        </ol>
        <button className="button" type="button" onClick={onBack}>
          {t.backToMenu}
        </button>
      </section>
    </main>
  )
}
