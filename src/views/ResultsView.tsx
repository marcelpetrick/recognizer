import { formatDuration } from '../domain/timer'
import type { ChallengeSize } from '../domain/types'
import type { Translations } from '../i18n'

interface ResultsViewProps {
  readonly t: Translations
  readonly playerName: string
  readonly challengeSize: ChallengeSize
  readonly elapsedMs: number
  readonly incorrectSelections: number
  readonly personalBest: boolean
  readonly retained: boolean
  readonly rank?: number
  readonly onPlayAgain: () => void
  readonly onMainMenu: () => void
  readonly onViewRankings: () => void
}

export function ResultsView({
  t,
  playerName,
  challengeSize,
  elapsedMs,
  incorrectSelections,
  personalBest,
  retained,
  rank,
  onPlayAgain,
  onMainMenu,
  onViewRankings,
}: ResultsViewProps) {
  const name = playerName.trim() || t.defaultPlayerName

  return (
    <main className="app-shell">
      <section className="panel results-panel">
        <p className="eyebrow">{t.challengeComplete}</p>
        <h1>{t.niceWork(name)}</h1>
        <p className="result-time" aria-label={t.finalTime}>
          {formatDuration(elapsedMs, true)}
        </p>
        <p>{t.resultSummary(challengeSize, incorrectSelections)}</p>
        {personalBest && <p className="achievement">{t.newPersonalBest}</p>}
        {retained && rank && (
          <p className="achievement">{t.rankInTier(rank)}</p>
        )}
        <div className="button-row">
          <button className="button" type="button" onClick={onPlayAgain}>
            {t.playAgain}
          </button>
          <button
            className="button button-secondary"
            type="button"
            onClick={onMainMenu}
          >
            {t.mainMenu}
          </button>
          <button
            className="text-button"
            type="button"
            onClick={onViewRankings}
          >
            {t.viewRankings}
          </button>
        </div>
      </section>
    </main>
  )
}
