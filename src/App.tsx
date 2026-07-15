import { useEffect, useMemo, useRef, useState } from 'react'
import { SymbolCard } from './components/SymbolCard'
import { playFeedbackTone } from './feedback'
import { createChallenge } from './domain/challenge'
import {
  completedDecisionCount,
  createGameRun,
  currentMatch,
  finishTransition,
  selectSymbol,
  type GameRun,
} from './domain/game'
import {
  elapsedMilliseconds,
  finishTimer,
  formatDuration,
  startTimer,
  type RunTimer,
} from './domain/timer'
import { insertResult, isPersonalBest } from './domain/rankings'
import {
  clearGameData,
  defaultGameData,
  loadGameData,
  saveGameData,
  type StoredGameData,
} from './domain/storage'
import {
  challengeSizes,
  languages,
  matchingDecisionCount,
  type SymbolId,
} from './domain/types'
import { translations } from './i18n'

type View = 'menu' | 'help' | 'game' | 'results' | 'rankings' | 'settings'

function displayName(name: string, defaultName: string): string {
  return name.trim() || defaultName
}

export function App() {
  const [view, setView] = useState<View>('menu')
  const [gameData, setGameData] = useState<StoredGameData>(() =>
    loadGameData(window.localStorage),
  )
  const [run, setRun] = useState<GameRun | null>(null)
  const [timer, setTimer] = useState<RunTimer | null>(null)
  const [now, setNow] = useState(0)
  const [selectedSymbolId, setSelectedSymbolId] = useState<SymbolId>()
  const [warning, setWarning] = useState('')
  const sessionId = useRef(0)
  const transitionTimeoutId = useRef<number | null>(null)
  const skipNextSave = useRef(false)
  const [resultSummary, setResultSummary] = useState<{
    rank?: number
    personalBest: boolean
    retained: boolean
  }>()

  const { playerName, challengeSize, soundEnabled, reducedMotion, language } =
    gameData.preferences
  const t = translations[language]

  const elapsed = timer ? elapsedMilliseconds(timer, now) : 0
  const decisionCount = matchingDecisionCount(challengeSize)

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false
      return
    }
    saveGameData(window.localStorage, gameData)
  }, [gameData])

  useEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'full'
  }, [reducedMotion])

  useEffect(() => {
    if (view !== 'game' || !timer || run?.phase === 'completed') {
      return undefined
    }

    const intervalId = window.setInterval(() => setNow(Date.now()), 100)
    return () => window.clearInterval(intervalId)
  }, [run?.phase, timer, view])

  useEffect(
    () => () => {
      if (transitionTimeoutId.current !== null) {
        window.clearTimeout(transitionTimeoutId.current)
      }
    },
    [],
  )

  const sharedSymbol = useMemo(
    () => (run && run.phase !== 'completed' ? currentMatch(run) : undefined),
    [run],
  )

  function startGame() {
    sessionId.current += 1
    if (transitionTimeoutId.current !== null) {
      window.clearTimeout(transitionTimeoutId.current)
      transitionTimeoutId.current = null
    }
    const newRun = createGameRun(
      createChallenge(challengeSize),
      Math.floor(Math.random() * 2_147_483_647),
    )
    const startedAt = Date.now()
    setRun(newRun)
    setTimer(startTimer(startedAt))
    setNow(startedAt)
    setSelectedSymbolId(undefined)
    setWarning('')
    setResultSummary(undefined)
    setView('game')
  }

  function updatePreferences(changes: Partial<StoredGameData['preferences']>) {
    setGameData((data) => ({
      ...data,
      preferences: { ...data.preferences, ...changes },
    }))
  }

  function handleSelection(symbolId: SymbolId) {
    if (!run || !timer) {
      return
    }

    const selection = selectSymbol(run, symbolId)
    setRun(selection.run)

    if (selection.result === 'incorrect') {
      if (soundEnabled) {
        playFeedbackTone('incorrect')
      }
      setWarning(t.warningNotShared)
      return
    }

    if (selection.result !== 'correct') {
      return
    }

    setWarning('')
    if (soundEnabled) {
      playFeedbackTone('correct')
    }
    setSelectedSymbolId(symbolId)
    const activeSessionId = sessionId.current
    transitionTimeoutId.current = window.setTimeout(() => {
      if (activeSessionId !== sessionId.current) {
        return
      }

      const nextRun = finishTransition(selection.run)
      setRun(nextRun)
      setSelectedSymbolId(undefined)

      if (nextRun.phase === 'completed') {
        const finishedTimer = finishTimer(timer, Date.now())
        const result = {
          id: `${finishedTimer.finishedAt ?? Date.now()}-${Math.random()}`,
          // Store the raw name, not a localized placeholder: this is
          // persisted and rendered later, potentially under a different
          // language than the one active when the run finished.
          playerName: playerName.trim(),
          challengeSize,
          elapsedMs: elapsedMilliseconds(
            finishedTimer,
            finishedTimer.finishedAt ?? Date.now(),
          ),
          completedAt: finishedTimer.finishedAt ?? Date.now(),
        }
        const personalBest = isPersonalBest(gameData.rankings, result)
        const inserted = insertResult(
          gameData.rankings,
          result,
          gameData.nextInsertionOrder,
        )
        setGameData({
          ...gameData,
          rankings: inserted.rankings,
          nextInsertionOrder: gameData.nextInsertionOrder + 1,
        })
        setResultSummary({
          rank: inserted.rank,
          personalBest,
          retained: inserted.retained,
        })
        setTimer(finishedTimer)
        setNow(finishedTimer.finishedAt ?? Date.now())
        setView('results')
      }
      transitionTimeoutId.current = null
    }, 240)
  }

  if (view === 'help') {
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
          <button
            className="button"
            type="button"
            onClick={() => setView('menu')}
          >
            {t.backToMenu}
          </button>
        </section>
      </main>
    )
  }

  if (view === 'results' && run && timer) {
    return (
      <main className="app-shell">
        <section className="panel results-panel">
          <p className="eyebrow">{t.challengeComplete}</p>
          <h1>{t.niceWork(displayName(playerName, t.defaultPlayerName))}</h1>
          <p className="result-time" aria-label={t.finalTime}>
            {formatDuration(
              elapsedMilliseconds(timer, timer.finishedAt ?? now),
              true,
            )}
          </p>
          <p>{t.resultSummary(challengeSize, run.incorrectSelections)}</p>
          {resultSummary?.personalBest && (
            <p className="achievement">{t.newPersonalBest}</p>
          )}
          {resultSummary?.retained && resultSummary.rank && (
            <p className="achievement">{t.rankInTier(resultSummary.rank)}</p>
          )}
          <div className="button-row">
            <button className="button" type="button" onClick={startGame}>
              {t.playAgain}
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => setView('menu')}
            >
              {t.mainMenu}
            </button>
            <button
              className="text-button"
              type="button"
              onClick={() => setView('rankings')}
            >
              {t.viewRankings}
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (view === 'rankings') {
    const entries = gameData.rankings[challengeSize]
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
          <button
            className="button"
            type="button"
            onClick={() => setView('menu')}
          >
            {t.backToMenu}
          </button>
        </section>
      </main>
    )
  }

  if (view === 'settings') {
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
                updatePreferences({ soundEnabled: event.target.checked })
              }
            />
            {t.enableSounds}
          </label>
          <label className="setting-toggle">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(event) =>
                updatePreferences({ reducedMotion: event.target.checked })
              }
            />
            {t.reduceAnimations}
          </label>
          <button
            className="button button-danger"
            type="button"
            onClick={() => {
              if (window.confirm(t.clearDataConfirm)) {
                clearGameData(window.localStorage)
                skipNextSave.current = true
                setGameData(defaultGameData())
              }
            }}
          >
            {t.clearData}
          </button>
          <button
            className="text-button menu-help"
            type="button"
            onClick={() => setView('menu')}
          >
            {t.backToMenu}
          </button>
        </section>
      </main>
    )
  }

  if (view === 'game' && run && timer && sharedSymbol !== undefined) {
    const completed = completedDecisionCount(run)
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
            {formatDuration(elapsed)}
          </div>
          <button
            className="text-button"
            type="button"
            onClick={() => {
              if (window.confirm(t.leaveGameConfirm)) {
                sessionId.current += 1
                if (transitionTimeoutId.current !== null) {
                  window.clearTimeout(transitionTimeoutId.current)
                  transitionTimeoutId.current = null
                }
                setView('menu')
                setRun(null)
                setTimer(null)
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
            onSelect={handleSelection}
          />
          <SymbolCard
            card={run.cards[run.currentIndex + 1]}
            label={t.nextCard}
            seed={run.layoutSeeds[run.cards[run.currentIndex + 1].id]}
            selectedSymbolId={selectedSymbolId}
            disabled={run.phase !== 'active'}
            onSelect={handleSelection}
          />
        </section>
      </main>
    )
  }

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
              onClick={() => updatePreferences({ language: code })}
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
            updatePreferences({ playerName: event.target.value })
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
                onClick={() => updatePreferences({ challengeSize: size })}
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
          onClick={startGame}
        >
          {t.startChallenge}
        </button>
        <button
          className="text-button menu-help"
          type="button"
          onClick={() => setView('help')}
        >
          {t.howToPlay}
        </button>
        <div className="menu-links">
          <button
            className="text-button"
            type="button"
            onClick={() => setView('rankings')}
          >
            {t.rankings}
          </button>
          <button
            className="text-button"
            type="button"
            onClick={() => setView('settings')}
          >
            {t.settings}
          </button>
        </div>
        <p className="version-tag">v{__APP_VERSION__}</p>
      </section>
    </main>
  )
}
