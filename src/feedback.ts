export type FeedbackTone = 'correct' | 'incorrect'

// One shared context for all tones: browsers cap concurrent AudioContexts
// (typically six), so creating one per tone made rapid selections silently
// drop their feedback once the cap was hit.
let sharedContext: AudioContext | undefined

/** Plays a brief optional tone without making game input depend on audio support. */
export function playFeedbackTone(tone: FeedbackTone): void {
  try {
    sharedContext ??= new AudioContext()
    const context = sharedContext
    if (context.state === 'suspended') {
      void context.resume()
    }
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = tone === 'correct' ? 'triangle' : 'square'
    oscillator.frequency.value = tone === 'correct' ? 660 : 170
    gain.gain.setValueAtTime(0.035, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.12)
    oscillator.addEventListener('ended', () => {
      oscillator.disconnect()
      gain.disconnect()
    })
  } catch {
    // Audio is optional and can be unavailable until a browser gesture or on older devices.
  }
}
