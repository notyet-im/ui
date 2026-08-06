import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CapitalFlowTracker } from './tracker/CapitalFlowTracker'

const container = document.getElementById('root')
if (!container) throw new Error('#root not found')

createRoot(container).render(
  <StrictMode>
    <CapitalFlowTracker />
  </StrictMode>,
)
