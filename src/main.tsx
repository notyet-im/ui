import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TrackerShowcase } from './tracker/TrackerShowcase'

const container = document.getElementById('root')
if (!container) throw new Error('#root not found')

createRoot(container).render(
  <StrictMode>
    <TrackerShowcase />
  </StrictMode>,
)
