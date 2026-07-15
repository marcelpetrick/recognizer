import { render } from '@testing-library/react'
import { symbolCatalog } from '../domain/symbols'
import { SymbolMark } from './SymbolMark'
import { symbolIcons } from './symbolIcons'

describe('SymbolMark', () => {
  it('maps every catalog symbol to a consistent color-aware vector mark', () => {
    expect(Object.keys(symbolIcons)).toHaveLength(symbolCatalog.length)

    symbolCatalog.forEach((symbol) => {
      expect(symbolIcons[symbol.name]).toBeDefined()
      const { container, unmount } = render(<SymbolMark symbol={symbol} />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveAttribute('fill', symbol.color)
      expect(icon).toHaveAttribute('stroke', '#172033')
      unmount()
    })
  })

  it('never maps two different symbols to the same icon', () => {
    const iconNamesBySymbol = new Map<(typeof symbolIcons)[string], string[]>()
    for (const [name, icon] of Object.entries(symbolIcons)) {
      const names = iconNamesBySymbol.get(icon) ?? []
      names.push(name)
      iconNamesBySymbol.set(icon, names)
    }

    const collisions = [...iconNamesBySymbol.values()].filter(
      (names) => names.length > 1,
    )
    expect(collisions).toEqual([])
  })
})
