import { beforeEach } from 'vitest'

/**
 * Gives jsdom just enough of the popover API for the show path to run.
 *
 * jsdom implements no part of it — no `showPopover`, no top layer, no light
 * dismiss — and every component that uses it guards on that, so without these
 * stubs the show path never executes and the tests assert nothing.
 *
 * The inline `display` is the load-bearing part: jsdom *does* ship the UA rule
 * `[popover]:not(:popover-open) { display: none }`, and `:popover-open` can
 * never match there, so every popover would be permanently hidden — invisible
 * to `getByRole` and skipped by axe. The browser half (light dismiss, top-layer
 * paint order) is verified in Chromium by design-sync, not here.
 *
 * Call once at the top of a suite. Popover, Tooltip and Toast each carried a
 * byte-identical copy of this before it lived here.
 */
export function stubPopoverApi(): void {
  beforeEach(() => {
    HTMLElement.prototype.showPopover = function showPopover() {
      this.style.display = 'block'
    }
    HTMLElement.prototype.hidePopover = function hidePopover() {
      this.style.display = 'none'
    }
  })
}
