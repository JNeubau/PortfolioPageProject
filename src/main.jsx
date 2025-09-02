import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ArtLayoutPage from './ArtLayoutPage.jsx'
import AddArtPage from './AddArtPage.jsx'
import AboutPage from './AboutPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/PortfolioPageProject">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/addNewArt" element={<AddArtPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
