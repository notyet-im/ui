import type { CSSProperties, ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import type { ThemeName } from '../tokens'
import '../styles/tokens.css'

interface ThemeContextValue {
  theme: ThemeName
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark' })

/** Reads the nearest `ThemeProvider`'s theme. Defaults to `dark` outside one. */
export function useTheme(): ThemeName {
  return useContext(ThemeContext).theme
}

export interface ThemeProviderProps {
  /** Which palette to apply. Default `dark`. */
  theme?: ThemeName
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * Root wrapper for the design system.
 *
 * **Every** Capital Flow component must render inside this — it is what defines
 * the `--cf-*` custom properties the components style themselves with. Outside
 * it, components render unstyled (transparent backgrounds, browser-default
 * text) because every colour they reference resolves to nothing.
 */
export function ThemeProvider({ theme = 'dark', children, className, style }: ThemeProviderProps) {
  const value = useMemo(() => ({ theme }), [theme])
  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={theme} className={['cf-root', className].filter(Boolean).join(' ')} style={style}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
