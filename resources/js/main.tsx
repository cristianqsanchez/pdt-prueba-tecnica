import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app'
import { Header } from './components/header'
import { FlightsProvider } from './flights/context'
import { Toaster } from './ui/sonner'
import { ThemeProvider } from './ui/theme-provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <FlightsProvider>
        <Header />
        <App />
        <Toaster />
      </FlightsProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
