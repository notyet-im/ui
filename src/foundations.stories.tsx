import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from './components/Panel'
import { Eyebrow } from './components/Controls'
import { flowColors } from './tokens'

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
  ['--cf-bg', 'Page background'],
  ['--cf-panel', 'Panel surface'],
  ['--cf-panel-2', 'Recessed surface — tracks, tiles, controls'],
  ['--cf-line', 'Hairlines and borders'],
]

const TEXT_TOKENS = [
  ['--cf-text', 'Primary text'],
  ['--cf-dim', 'Secondary text'],
  ['--cf-dim-2', 'Tertiary text — eyebrows, captions'],
]

const TYPE_SCALE = [
  ['--cf-text-micro', '10.5px', 'Eyebrows, matrix cells'],
  ['--cf-text-tiny', '11px', 'Kickers, footers'],
  ['--cf-text-xs', '11.5px', 'Panel subtitles'],
  ['--cf-text-sm', '12px', 'Controls'],
  ['--cf-text-base', '12.5px', 'Body and list rows'],
  ['--cf-text-md', '13px', 'Ring labels'],
  ['--cf-text-lg', '13.5px', 'Panel titles, tabs'],
  ['--cf-text-xl', '14.5px', 'Momentum figures'],
  ['--cf-text-2xl', '15px', 'Stat tile figures'],
  ['--cf-text-3xl', '18px', 'Selection title'],
  ['--cf-text-4xl', '25px', 'Selection net'],
  ['--cf-text-5xl', '27px', 'Page title'],
]

function Swatch({ token, note, color }: { token: string; note: string; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--cf-radius-control)',
          border: '1px solid var(--cf-line)',
          background: color ?? `var(${token})`,
          flex: 'none',
        }}
      />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--cf-font-mono)', fontSize: 'var(--cf-text-base)' }}>{token}</div>
        <div style={{ fontSize: 'var(--cf-text-xs)', color: 'var(--cf-dim)' }}>{note}</div>
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
          <Swatch token="--cf-inflow" note={`Capital arriving · ${flowColors.inflow}`} />
          <Swatch token="--cf-outflow" note={`Capital leaving · ${flowColors.outflow}`} />
          <Swatch token="--cf-neutral" note={`Unattributed flow · ${flowColors.neutral}`} />
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
            <span style={{ fontFamily: 'var(--cf-font-mono)', fontSize: 'var(--cf-text-xs)', color: 'var(--cf-dim)', minWidth: 150 }}>
              {token}
            </span>
            <span style={{ fontSize: 'var(--cf-text-xs)', color: 'var(--cf-dim-2)' }}>{note}</span>
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
          ['--cf-radius-swatch', '2px'],
          ['--cf-radius-bar', '3px'],
          ['--cf-radius-cell', '4px'],
          ['--cf-radius-control', '6px'],
          ['--cf-radius-field', '8px'],
          ['--cf-radius-tile', '9px'],
          ['--cf-radius-strip', '10px'],
          ['--cf-radius-panel', '12px'],
        ].map(([token, value]) => (
          <div key={token} style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <div
              style={{
                width: 68,
                height: 68,
                background: 'var(--cf-panel-2)',
                border: '1px solid var(--cf-line)',
                borderRadius: `var(${token})`,
              }}
            />
            <div style={{ fontFamily: 'var(--cf-font-mono)', fontSize: 'var(--cf-text-micro)', color: 'var(--cf-dim)' }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  ),
}
