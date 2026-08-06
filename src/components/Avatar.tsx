import { useState } from 'react'
import './Avatar.css'

export interface AvatarProps {
  /** Image URL. When absent — or when it fails to load — initials are drawn instead. */
  src?: string
  /**
   * Who the avatar represents. Required, and never decorative: it is both the
   * accessible name and the source of the initials fallback.
   */
  name: string
  /**
   * `sm` — inside a dense row or a comment byline.
   * `md` — the default, matching a standard control's height.
   * `lg` — a profile header.
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * `circle` — people, the default.
   * `square` — organisations, funds, repositories: anything that is not a person.
   */
  shape?: 'circle' | 'square'
  className?: string
}

/** First letter of the first and last word, so "Ada Lovelace" reads as "AL". */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  const first = Array.from(words[0])[0] ?? ''
  const last = words.length > 1 ? (Array.from(words[words.length - 1])[0] ?? '') : ''
  return (first + last).toUpperCase()
}

/**
 * A person or organisation rendered at a glance.
 *
 * Use `Avatar` for identity; use `Badge` for state. An avatar always resolves to
 * something visible — if `src` is missing or the request fails, it falls back to
 * initials derived from `name`, so a dead image URL degrades to a readable mark
 * rather than to a broken-image glyph.
 */
export function Avatar({ src, name, size = 'md', shape = 'circle', className }: AvatarProps) {
  // The failed URL is stored rather than a boolean, so that pointing the same
  // avatar at a new `src` retries instead of staying stuck on the fallback.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showImage = src != null && src !== '' && src !== failedSrc

  return (
    <span
      className={['ny-avatar', `ny-avatar--${size}`, `ny-avatar--${shape}`, className]
        .filter(Boolean)
        .join(' ')}
    >
      {showImage ? (
        <img className="ny-avatar__image" src={src} alt={name} onError={() => setFailedSrc(src)} />
      ) : (
        <span className="ny-avatar__initials" role="img" aria-label={name}>
          {initialsOf(name)}
        </span>
      )}
    </span>
  )
}
