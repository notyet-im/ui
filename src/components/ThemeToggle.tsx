import { IconButton } from './Controls'
import type { ThemeName } from '../tokens'

export interface ThemeToggleProps {
  theme: ThemeName
  onChange: (theme: ThemeName) => void
  /** Accessible label. Should describe the *result*, e.g. "Switch to light theme". */
  label?: string
  className?: string
}

/**
 * Switches between the dark and light palettes.
 *
 * The icon shows the *current* theme (sun while dark, moon while light),
 * matching the original prototype.
 */
export function ThemeToggle({ theme, onChange, label, className }: ThemeToggleProps) {
  const isDark = theme === 'dark'
  const resolvedLabel = label ?? (isDark ? 'Switch to light theme' : 'Switch to dark theme')

  return (
    <IconButton
      label={resolvedLabel}
      className={className}
      onClick={() => onChange(isDark ? 'light' : 'dark')}
    >
      {isDark ? (
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.6v2.4M12 19v2.4M2.6 12h2.4M19 12h2.4M5.4 5.4l1.7 1.7M16.9 16.9l1.7 1.7M18.6 5.4l-1.7 1.7M7.1 16.9l-1.7 1.7" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1z" />
        </svg>
      )}
    </IconButton>
  )
}
