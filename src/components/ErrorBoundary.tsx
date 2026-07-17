import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  readonly children: ReactNode
}

interface ErrorBoundaryState {
  readonly hasError: boolean
}

/**
 * Last-resort fallback so a render error shows a recoverable screen instead
 * of a blank page. Deliberately static and dependency-free (no translations
 * lookup, no stored preferences): the crashed state must not be able to
 * crash the fallback too, so the message is shown in all three languages.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Recognizer crashed', error, errorInfo)
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <main className="app-shell">
        <section className="panel" role="alert">
          <p className="eyebrow">Recognizer</p>
          <h1>Oops!</h1>
          <p>
            Something went wrong. / Nešto je pošlo po zlu. / Etwas ist
            schiefgelaufen.
          </p>
          <button
            className="button"
            type="button"
            onClick={() => window.location.reload()}
          >
            Reload / Ponovno učitaj / Neu laden
          </button>
        </section>
      </main>
    )
  }
}
