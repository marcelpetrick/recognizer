export interface Translations {
  readonly languageCode: string
  readonly languagePickerLabel: string
  readonly appTitle: string
  readonly visualConcentrationEyebrow: string
  readonly tagline: string
  readonly yourNameLabel: string
  readonly optionalLabel: string
  readonly namePlaceholder: string
  readonly defaultPlayerName: string
  readonly chooseChallenge: string
  readonly cardsUnit: string
  readonly challengeSizeLabel: (size: number) => string
  readonly startChallenge: string
  readonly howToPlay: string
  readonly rankings: string
  readonly settings: string
  readonly helpTitle: string
  readonly helpSteps: readonly [string, string, string, string, string]
  readonly helpNote: string
  readonly backToMenu: string
  readonly challengeComplete: string
  readonly niceWork: (name: string) => string
  readonly finalTime: string
  readonly resultSummary: (cardCount: number, wrongCount: number) => string
  readonly newPersonalBest: string
  readonly rankInTier: (rank: number) => string
  readonly playAgain: string
  readonly mainMenu: string
  readonly viewRankings: string
  readonly localRankings: string
  readonly bestTimes: (size: number) => string
  readonly playYourWay: string
  readonly enableSounds: string
  readonly reduceAnimations: string
  readonly clearData: string
  readonly clearDataConfirm: string
  readonly leaveGameConfirm: string
  readonly leaveGame: string
  readonly gameInstruction: string
  readonly matchesProgress: (completed: number, total: number) => string
  readonly elapsedTime: string
  readonly matchingCards: string
  readonly warningNotShared: string
  readonly currentCard: string
  readonly nextCard: string
}

export const en: Translations = {
  languageCode: 'EN',
  languagePickerLabel: 'Language',
  appTitle: 'Recognizer',
  visualConcentrationEyebrow: 'Visual concentration',
  tagline: 'Find the one symbol shared by both cards — fast.',
  yourNameLabel: 'Your name',
  optionalLabel: '(optional)',
  namePlaceholder: 'Player',
  defaultPlayerName: 'Player',
  chooseChallenge: 'Choose your challenge',
  cardsUnit: 'cards',
  challengeSizeLabel: (size) => `${size} cards`,
  startChallenge: 'Start timed challenge',
  howToPlay: 'How to play',
  rankings: 'Rankings',
  settings: 'Settings',
  helpTitle: 'Find the one match',
  helpSteps: [
    'Two cards appear with eight symbols each.',
    'They share exactly one symbol.',
    'Click that symbol on either card.',
    'The right card becomes your new card and a new card appears.',
    'Finish every pair as quickly as you can.',
  ],
  helpNote:
    'The clock runs continuously. Wrong picks only show a small warning, so you can keep trying.',
  backToMenu: 'Back to menu',
  challengeComplete: 'Challenge complete',
  niceWork: (name) => `Nice work, ${name}!`,
  finalTime: 'Final time',
  resultSummary: (cardCount, wrongCount) =>
    `${cardCount} cards · ${wrongCount} wrong pick${wrongCount === 1 ? '' : 's'}`,
  newPersonalBest: 'New personal best!',
  rankInTier: (rank) => `Rank #${rank} in this tier`,
  playAgain: 'Play again',
  mainMenu: 'Main menu',
  viewRankings: 'View rankings',
  localRankings: 'Local rankings',
  bestTimes: (size) => `${size}-card best times`,
  playYourWay: 'Play your way',
  enableSounds: 'Enable feedback sounds',
  reduceAnimations: 'Reduce animations',
  clearData: 'Clear local game data',
  clearDataConfirm: 'Clear all local rankings and preferences?',
  leaveGameConfirm:
    'Leave this challenge? Your current run will not be saved.',
  leaveGame: 'Leave game',
  gameInstruction: 'Find the symbol that appears on both cards.',
  matchesProgress: (completed, total) => `${completed} of ${total} matches`,
  elapsedTime: 'Elapsed time',
  matchingCards: 'Matching cards',
  warningNotShared: 'Not the shared symbol — keep looking!',
  currentCard: 'Your current card',
  nextCard: 'Next card',
}

export const de: Translations = {
  languageCode: 'DE',
  languagePickerLabel: 'Sprache',
  appTitle: 'Recognizer',
  visualConcentrationEyebrow: 'Visuelles Konzentrationsspiel',
  tagline: 'Finde das eine Symbol, das beide Karten teilen — schnell.',
  yourNameLabel: 'Dein Name',
  optionalLabel: '(optional)',
  namePlaceholder: 'Spieler',
  defaultPlayerName: 'Spieler',
  chooseChallenge: 'Wähle deine Herausforderung',
  cardsUnit: 'Karten',
  challengeSizeLabel: (size) => `${size} Karten`,
  startChallenge: 'Zeitchallenge starten',
  howToPlay: 'Spielanleitung',
  rankings: 'Bestenliste',
  settings: 'Einstellungen',
  helpTitle: 'Finde die eine Übereinstimmung',
  helpSteps: [
    'Zwei Karten erscheinen mit je acht Symbolen.',
    'Sie teilen genau ein Symbol.',
    'Klicke dieses Symbol auf einer der beiden Karten.',
    'Die richtige Karte wird deine neue Karte, und eine neue Karte erscheint.',
    'Löse jedes Paar so schnell wie möglich.',
  ],
  helpNote:
    'Die Uhr läuft durchgehend. Falsche Versuche zeigen nur eine kurze Warnung, sodass du weiter versuchen kannst.',
  backToMenu: 'Zurück zum Menü',
  challengeComplete: 'Herausforderung abgeschlossen',
  niceWork: (name) => `Gut gemacht, ${name}!`,
  finalTime: 'Endzeit',
  resultSummary: (cardCount, wrongCount) =>
    wrongCount === 1
      ? `${cardCount} Karten · 1 falscher Versuch`
      : `${cardCount} Karten · ${wrongCount} falsche Versuche`,
  newPersonalBest: 'Neue persönliche Bestzeit!',
  rankInTier: (rank) => `Rang #${rank} in dieser Stufe`,
  playAgain: 'Nochmal spielen',
  mainMenu: 'Hauptmenü',
  viewRankings: 'Bestenliste ansehen',
  localRankings: 'Lokale Bestenliste',
  bestTimes: (size) => `Beste Zeiten (${size} Karten)`,
  playYourWay: 'Spiele auf deine Art',
  enableSounds: 'Feedback-Töne aktivieren',
  reduceAnimations: 'Animationen reduzieren',
  clearData: 'Lokale Spieldaten löschen',
  clearDataConfirm: 'Alle lokalen Bestenlisten und Einstellungen löschen?',
  leaveGameConfirm:
    'Diese Herausforderung verlassen? Dein aktueller Lauf wird nicht gespeichert.',
  leaveGame: 'Spiel verlassen',
  gameInstruction: 'Finde das Symbol, das auf beiden Karten erscheint.',
  matchesProgress: (completed, total) => `${completed} von ${total} Paaren`,
  elapsedTime: 'Verstrichene Zeit',
  matchingCards: 'Passende Karten',
  warningNotShared: 'Nicht das gemeinsame Symbol — schau weiter!',
  currentCard: 'Deine aktuelle Karte',
  nextCard: 'Nächste Karte',
}

// Croatian numeral agreement for "pokušaj" (attempt) depends on the last
// one or two digits, not just whether the count equals 1.
function croatianWrongPicksPhrase(count: number): string {
  const lastTwo = count % 100
  const last = count % 10
  if (last === 1 && lastTwo !== 11) {
    return 'pogrešan pokušaj'
  }
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) {
    return 'pogrešna pokušaja'
  }
  return 'pogrešnih pokušaja'
}

export const hr: Translations = {
  languageCode: 'HR',
  languagePickerLabel: 'Jezik',
  appTitle: 'Recognizer',
  visualConcentrationEyebrow: 'Vizualna igra koncentracije',
  tagline: 'Pronađi jedan simbol koji dijele obje karte — brzo.',
  yourNameLabel: 'Tvoje ime',
  optionalLabel: '(neobavezno)',
  namePlaceholder: 'Igrač',
  defaultPlayerName: 'Igrač',
  chooseChallenge: 'Odaberi izazov',
  cardsUnit: 'karata',
  challengeSizeLabel: (size) => `${size} karata`,
  startChallenge: 'Pokreni izazov na vrijeme',
  howToPlay: 'Kako se igra',
  rankings: 'Ljestvica',
  settings: 'Postavke',
  helpTitle: 'Pronađi jedno podudaranje',
  helpSteps: [
    'Pojavljuju se dvije karte, svaka s osam simbola.',
    'Dijele točno jedan simbol.',
    'Klikni taj simbol na bilo kojoj karti.',
    'Ispravna karta postaje tvoja nova karta i pojavljuje se nova karta.',
    'Riješi svaki par što brže možeš.',
  ],
  helpNote:
    'Sat radi neprekidno. Pogrešni pokušaji samo prikazuju kratko upozorenje, pa možeš nastaviti pokušavati.',
  backToMenu: 'Natrag na izbornik',
  challengeComplete: 'Izazov završen',
  niceWork: (name) => `Bravo, ${name}!`,
  finalTime: 'Konačno vrijeme',
  resultSummary: (cardCount, wrongCount) =>
    `${cardCount} karata · ${wrongCount} ${croatianWrongPicksPhrase(wrongCount)}`,
  newPersonalBest: 'Novi osobni rekord!',
  rankInTier: (rank) => `Rang #${rank} u ovoj kategoriji`,
  playAgain: 'Igraj ponovno',
  mainMenu: 'Glavni izbornik',
  viewRankings: 'Pogledaj ljestvicu',
  localRankings: 'Lokalna ljestvica',
  bestTimes: (size) => `Najbolja vremena (${size} karata)`,
  playYourWay: 'Igraj na svoj način',
  enableSounds: 'Uključi zvučne povratne informacije',
  reduceAnimations: 'Smanji animacije',
  clearData: 'Obriši lokalne podatke igre',
  clearDataConfirm: 'Obrisati sve lokalne ljestvice i postavke?',
  leaveGameConfirm:
    'Napustiti ovaj izazov? Trenutni pokušaj neće biti spremljen.',
  leaveGame: 'Napusti igru',
  gameInstruction: 'Pronađi simbol koji se pojavljuje na obje karte.',
  matchesProgress: (completed, total) => `${completed} od ${total} parova`,
  elapsedTime: 'Proteklo vrijeme',
  matchingCards: 'Karte za podudaranje',
  warningNotShared: 'To nije zajednički simbol — nastavi tražiti!',
  currentCard: 'Tvoja trenutna karta',
  nextCard: 'Sljedeća karta',
}
