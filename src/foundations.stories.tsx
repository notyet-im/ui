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
          'Every value in the system. Surfaces and text flip with the theme; flow semantics do not — teal always means capital arriving, rust always means capital leaving, in either theme.',
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
  ['--ny-font-size-2xs', '10.5px', 'Eyebrows, matrix cells'],
  ['--ny-font-size-2xs', '11px', 'Kickers, footers'],
  ['--ny-font-size-xs', '11.5px', 'Panel subtitles'],
  ['--ny-font-size-xs', '12px', 'Controls'],
  ['--ny-font-size-sm', '12.5px', 'Body and list rows'],
  ['--ny-font-size-sm', '13px', 'Ring labels'],
  ['--ny-font-size-md', '13.5px', 'Panel titles, tabs'],
  ['--ny-font-size-md', '14.5px', 'Momentum figures'],
  ['--ny-font-size-lg', '15px', 'Stat tile figures'],
  ['--ny-font-size-xl', '18px', 'Selection title'],
  ['--ny-font-size-2xl', '25px', 'Selection net'],
  ['--ny-font-size-3xl', '27px', 'Page title'],
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
        <Eyebrow>Flow semantics — theme-invariant</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          <Swatch token="--ny-positive" note={`Capital arriving · ${deltaColors.positive}`} />
          <Swatch token="--ny-negative" note={`Capital leaving · ${deltaColors.negative}`} />
          <Swatch token="--ny-neutral" note={`Unattributed flow · ${deltaColors.neutral}`} />
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
      <Eyebrow>Radii — named for what they wrap</Eyebrow>
      <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          ['--ny-radius-xs', '2px'],
          ['--ny-radius-sm', '3px'],
          ['--ny-radius-sm', '4px'],
          ['--ny-radius-md', '6px'],
          ['--ny-radius-lg', '8px'],
          ['--ny-radius-lg', '9px'],
          ['--ny-radius-xl', '10px'],
          ['--ny-radius-xl', '12px'],
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
