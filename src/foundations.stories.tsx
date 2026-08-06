import type { Meta, StoryObj } from '@storybook/react-vite'
import { Eyebrow } from './components/Controls'
import { Panel } from './components/Panel'
import { deltaColors } from './tokens'

const meta = {
  title: 'Foundations/Tokens',
  parameters: {
    docs: {
      description: {
        component:
          'Every value in the system. Surfaces and text flip with the theme; data semantics do not — teal always means a value went up, rust always means it went down, in either theme.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const SURFACE_TOKENS = [
  ['--ny-bg', 'Page background'],
  ['--ny-surface', 'Panel surface'],
  ['--ny-surface-sunken', 'Recessed surface — tracks, tiles, controls'],
  ['--ny-border', 'Hairlines and borders'],
]

const TEXT_TOKENS = [
  ['--ny-text', 'Primary text'],
  ['--ny-text-muted', 'Secondary text'],
  ['--ny-text-subtle', 'Tertiary text — eyebrows, captions'],
]

const TYPE_SCALE = [
  ['--ny-font-size-2xs', '11px', 'Eyebrows, matrix cells'],
  ['--ny-font-size-xs', '12px', 'Captions, help text'],
  ['--ny-font-size-sm', '13px', 'Controls, dense body'],
  ['--ny-font-size-md', '14px', 'Body — the default'],
  ['--ny-font-size-lg', '16px', 'Section titles'],
  ['--ny-font-size-xl', '18px', 'Panel and dialog titles'],
  ['--ny-font-size-2xl', '22px', 'Major section heading'],
  ['--ny-font-size-3xl', '28px', 'Page title'],
  ['--ny-font-size-4xl', '36px', 'Display'],
]

/** Named for the pixel value each holds, so a literal maps without a lookup. */
const SPACE_SCALE = ['0', 'px', '2', '4', '8', '12', '16', '20', '24', '32', '40', '48', '64']

const SPACE_ROLES = [
  ['--ny-inset', '16px', 'Default component padding'],
  ['--ny-inset-compact', '8px', 'Dense controls'],
  ['--ny-stack', '12px', 'Default vertical rhythm'],
  ['--ny-gutter', '24px', 'Grid gutter — 16px below 768px'],
]

const ELEVATION = [
  ['--ny-shadow-sm', 'Hover lift, Card'],
  ['--ny-shadow-md', 'Popover, Tooltip'],
  ['--ny-shadow-lg', 'Dialog, Toast'],
]

function Swatch({ token, note, color }: { token: string; note: string; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--ny-radius-md)',
          border: '1px solid var(--ny-border)',
          background: color ?? `var(${token})`,
          flex: 'none',
        }}
      />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--ny-font-mono)', fontSize: 'var(--ny-font-size-sm)' }}>{token}</div>
        <div style={{ fontSize: 'var(--ny-font-size-xs)', color: 'var(--ny-text-muted)' }}>{note}</div>
      </div>
    </div>
  )
}

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      <Panel>
        <Eyebrow>Surfaces</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          {SURFACE_TOKENS.map(([token, note]) => (
            <Swatch key={token} token={token} note={note} />
          ))}
        </div>
      </Panel>
      <Panel>
        <Eyebrow>Text</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          {TEXT_TOKENS.map(([token, note]) => (
            <Swatch key={token} token={token} note={note} />
          ))}
        </div>
      </Panel>
      <Panel>
        <Eyebrow>Data semantics — theme-invariant</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          <Swatch token="--ny-positive" note={`Value went up · ${deltaColors.positive}`} />
          <Swatch token="--ny-negative" note={`Value went down · ${deltaColors.negative}`} />
          <Swatch token="--ny-neutral" note={`Unselected or flat · ${deltaColors.neutral}`} />
        </div>
      </Panel>
    </div>
  ),
}

export const Typography: Story = {
  render: () => (
    <Panel style={{ maxWidth: 760 }}>
      <Eyebrow>Type scale — IBM Plex Sans, with IBM Plex Mono for every figure</Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
        {TYPE_SCALE.map(([token, size, note]) => (
          <div key={token} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={{ fontSize: `var(${token})`, fontWeight: 600, minWidth: 130 }}>{size}</span>
            <span
              style={{
                fontFamily: 'var(--ny-font-mono)',
                fontSize: 'var(--ny-font-size-xs)',
                color: 'var(--ny-text-muted)',
                minWidth: 150,
              }}
            >
              {token}
            </span>
            <span style={{ fontSize: 'var(--ny-font-size-xs)', color: 'var(--ny-text-subtle)' }}>{note}</span>
          </div>
        ))}
      </div>
    </Panel>
  ),
}

export const Radii: Story = {
  render: () => (
    <Panel style={{ maxWidth: 760 }}>
      <Eyebrow>Radii — a size scale, smallest to pill</Eyebrow>
      <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          ['--ny-radius-none', '0'],
          ['--ny-radius-xs', '2px'],
          ['--ny-radius-sm', '4px'],
          ['--ny-radius-md', '6px'],
          ['--ny-radius-lg', '8px'],
          ['--ny-radius-xl', '12px'],
          ['--ny-radius-full', 'pill'],
        ].map(([token, value]) => (
          <div key={token} style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <div
              style={{
                width: 68,
                height: 68,
                background: 'var(--ny-surface-sunken)',
                border: '1px solid var(--ny-border)',
                borderRadius: `var(${token})`,
              }}
            />
            <div
              style={{
                fontFamily: 'var(--ny-font-mono)',
                fontSize: 'var(--ny-font-size-2xs)',
                color: 'var(--ny-text-muted)',
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  ),
}

export const Spacing: Story = {
  render: () => (
    <Panel style={{ maxWidth: 760 }}>
      <Eyebrow>Spacing — 4px base, each token named for the value it holds</Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
        {SPACE_SCALE.map((step) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                fontFamily: 'var(--ny-font-mono)',
                fontSize: 'var(--ny-font-size-2xs)',
                color: 'var(--ny-text-muted)',
                width: 120,
                flex: 'none',
              }}
            >
              --ny-space-{step}
            </span>
            <div
              style={{
                width: `var(--ny-space-${step})`,
                height: 14,
                background: 'var(--ny-accent)',
                borderRadius: 'var(--ny-radius-xs)',
                flex: 'none',
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <Eyebrow>Roles — prefer these over raw steps for component chrome</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 12 }}>
          {SPACE_ROLES.map(([token, value, note]) => (
            <div key={token} style={{ display: 'flex', gap: 12, fontSize: 'var(--ny-font-size-xs)' }}>
              <span style={{ fontFamily: 'var(--ny-font-mono)', width: 160, flex: 'none' }}>{token}</span>
              <span style={{ fontFamily: 'var(--ny-font-mono)', width: 56, flex: 'none' }}>{value}</span>
              <span style={{ color: 'var(--ny-text-muted)' }}>{note}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  ),
}

export const Elevation: Story = {
  render: () => (
    <Panel style={{ maxWidth: 760 }}>
      <Eyebrow>Elevation — for content that leaves the page plane</Eyebrow>
      <div style={{ display: 'flex', gap: 24, marginTop: 18, flexWrap: 'wrap' }}>
        {ELEVATION.map(([token, note]) => (
          <div key={token} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <div
              style={{
                width: 128,
                height: 72,
                background: 'var(--ny-surface-raised)',
                border: '1px solid var(--ny-border)',
                borderRadius: 'var(--ny-radius-lg)',
                boxShadow: `var(${token})`,
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--ny-font-mono)', fontSize: 'var(--ny-font-size-2xs)' }}>
                {token}
              </div>
              <div style={{ fontSize: 'var(--ny-font-size-2xs)', color: 'var(--ny-text-muted)' }}>{note}</div>
            </div>
          </div>
        ))}
      </div>
      <p
        style={{
          marginTop: 20,
          fontSize: 'var(--ny-font-size-xs)',
          color: 'var(--ny-text-muted)',
          maxWidth: 620,
        }}
      >
        Shadows are lighter in the light theme — there, the hairline border carries most of the separation and
        a heavy shadow reads as dirt rather than as elevation.
      </p>
    </Panel>
  ),
}
