import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Example from './App.backgroundremoved'
import KombaiWrapper from './KombaiWrapper'
import ErrorBoundary from '@kombai/react-error-boundary'
import './styles/globals.css'
import './styles/brand.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <KombaiWrapper>
        <Example />
      </KombaiWrapper>
    </ErrorBoundary>
  </StrictMode>,
)