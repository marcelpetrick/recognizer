import { de, en, hr } from './translations'

describe('translations', () => {
  it('uses correct Croatian numeral agreement for wrong-pick counts', () => {
    // last digit 1 (not 11) -> singular "pokušaj"
    expect(hr.resultSummary(10, 1)).toBe('10 karata · 1 pogrešan pokušaj')
    expect(hr.resultSummary(50, 21)).toBe('50 karata · 21 pogrešan pokušaj')
    expect(hr.resultSummary(50, 31)).toBe('50 karata · 31 pogrešan pokušaj')

    // last digit 2-4 (not 12-14) -> paucal "pokušaja"
    expect(hr.resultSummary(10, 2)).toBe('10 karata · 2 pogrešna pokušaja')
    expect(hr.resultSummary(50, 24)).toBe('50 karata · 24 pogrešna pokušaja')

    // 0, 5-20, 25-30, and *11/*12/*13/*14 -> genitive plural "pokušaja"
    expect(hr.resultSummary(10, 0)).toBe('10 karata · 0 pogrešnih pokušaja')
    expect(hr.resultSummary(50, 5)).toBe('50 karata · 5 pogrešnih pokušaja')
    expect(hr.resultSummary(50, 11)).toBe('50 karata · 11 pogrešnih pokušaja')
    expect(hr.resultSummary(50, 12)).toBe('50 karata · 12 pogrešnih pokušaja')
    expect(hr.resultSummary(50, 41)).toBe('50 karata · 41 pogrešan pokušaj')
  })

  it('uses correct German singular/plural for wrong-pick counts', () => {
    expect(de.resultSummary(10, 1)).toBe('10 Karten · 1 falscher Versuch')
    expect(de.resultSummary(10, 2)).toBe('10 Karten · 2 falsche Versuche')
    expect(de.resultSummary(10, 0)).toBe('10 Karten · 0 falsche Versuche')
  })

  it('uses correct English singular/plural for wrong-pick counts', () => {
    expect(en.resultSummary(10, 1)).toBe('10 cards · 1 wrong pick')
    expect(en.resultSummary(10, 2)).toBe('10 cards · 2 wrong picks')
    expect(en.resultSummary(10, 0)).toBe('10 cards · 0 wrong picks')
  })
})
