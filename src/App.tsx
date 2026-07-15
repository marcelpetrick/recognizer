import { useEffect, useMemo, useRef, useState } from 'react'
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
import { matchingDecisionCount, type SymbolId } from './domain/types'
import { translations } from './i18n'
import { GameView } from './views/GameView'
import { HelpView } from './views/HelpView'
import { MenuView } from './views/MenuView'
import { RankingsView } from './views/RankingsView'
import { ResultsView } from './views/ResultsView'
import { SettingsView } from './views/SettingsView'

type View = 'menu' | 'help' | 'game' | 'results' | 'rankings' | 'settings'

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
    document.documentElement.lang = language
  }, [language])

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

  function leaveGame() {
    sessionId.current += 1
    if (transitionTimeoutId.current !== null) {
      window.clearTimeout(transitionTimeoutId.current)
      transitionTimeoutId.current = null
    }
    setView('menu')
    setRun(null)
    setTimer(null)
  }

  function clearData() {
    clearGameData(window.localStorage)
    skipNextSave.current = true
    setGameData(defaultGameData())
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
    return <HelpView t={t} onBack={() => setView('menu')} />
  }

  if (view === 'results' && run && timer) {
    return (
      <ResultsView
        t={t}
        playerName={playerName}
        challengeSize={challengeSize}
        elapsedMs={elapsedMilliseconds(timer, timer.finishedAt ?? now)}
        incorrectSelections={run.incorrectSelections}
        personalBest={resultSummary?.personalBest ?? false}
        retained={resultSummary?.retained ?? false}
        rank={resultSummary?.rank}
        onPlayAgain={startGame}
        onMainMenu={() => setView('menu')}
        onViewRankings={() => setView('rankings')}
      />
    )
  }

  if (view === 'rankings') {
    return (
      <RankingsView
        t={t}
        challengeSize={challengeSize}
        entries={gameData.rankings[challengeSize]}
        onBack={() => setView('menu')}
      />
    )
  }

  if (view === 'settings') {
    return (
      <SettingsView
        t={t}
        soundEnabled={soundEnabled}
        reducedMotion={reducedMotion}
        onUpdatePreferences={updatePreferences}
        onClearData={clearData}
        onBack={() => setView('menu')}
      />
    )
  }

  if (view === 'game' && run && timer && sharedSymbol !== undefined) {
    return (
      <GameView
        t={t}
        run={run}
        completed={completedDecisionCount(run)}
        decisionCount={decisionCount}
        elapsedMs={elapsed}
        warning={warning}
        selectedSymbolId={selectedSymbolId}
        onSelect={handleSelection}
        onLeaveGame={leaveGame}
      />
    )
  }

  return (
    <MenuView
      t={t}
      language={language}
      playerName={playerName}
      challengeSize={challengeSize}
      onUpdatePreferences={updatePreferences}
      onStartGame={startGame}
      onShowHelp={() => setView('help')}
      onShowRankings={() => setView('rankings')}
      onShowSettings={() => setView('settings')}
    />
  )
}
