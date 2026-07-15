import { SymbolCard } from '../components/SymbolCard'
import type { GameRun } from '../domain/game'
import { formatDuration } from '../domain/timer'
import type { SymbolId } from '../domain/types'
import type { Translations } from '../i18n'

interface GameViewProps {
  readonly t: Translations
  readonly run: GameRun
  readonly completed: number
  readonly decisionCount: number
  readonly elapsedMs: number
  readonly warning: string
  readonly selectedSymbolId?: SymbolId
  readonly onSelect: (symbolId: SymbolId) => void
  readonly onLeaveGame: () => void
}

export function GameView({
  t,
  run,
  completed,
  decisionCount,
  elapsedMs,
  warning,
  selectedSymbolId,
  onSelect,
  onLeaveGame,
}: GameViewProps) {
  return (
    <main className="game-shell">
      <header className="game-header">
        <div>
          <p className="eyebrow">{t.appTitle}</p>
          <p className="progress-text">
            {t.matchesProgress(completed, decisionCount)}
          </p>
        </div>
        <div className="timer" aria-label={t.elapsedTime}>
          {formatDuration(elapsedMs)}
        </div>
        <button
          className="text-button"
          type="button"
          onClick={() => {
            if (window.confirm(t.leaveGameConfirm)) {
              onLeaveGame()
            }
          }}
        >
          {t.leaveGame}
        </button>
      </header>
      <p className="game-instruction">{t.gameInstruction}</p>
      <p className="warning" role="status" aria-live="polite">
        {warning}
      </p>
      <section className="cards-grid" aria-label={t.matchingCards}>
        <SymbolCard
          card={run.cards[run.currentIndex]}
          label={t.currentCard}
          seed={run.layoutSeeds[run.cards[run.currentIndex].id]}
          selectedSymbolId={selectedSymbolId}
          disabled={run.phase !== 'active'}
          onSelect={onSelect}
        />
        <SymbolCard
          card={run.cards[run.currentIndex + 1]}
          label={t.nextCard}
          seed={run.layoutSeeds[run.cards[run.currentIndex + 1].id]}
          selectedSymbolId={selectedSymbolId}
          disabled={run.phase !== 'active'}
          onSelect={onSelect}
        />
      </section>
    </main>
  )
}
