import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import ArtLayoutPage from './ArtLayoutPage'
import AboutPage from './AboutPage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faPerson } from '@fortawesome/free-solid-svg-icons'
import { LAYOUTS, TEXT, DEFAULTS } from './config/parameters'

function App() {
  const [count, setCount] = useState(0)
  const [layout, setLayout] = useState(DEFAULTS.LAYOUT)

  const changeLayout = (newLayout) => {
    setLayout(newLayout)
  }

  return (
    <div className="full-width-container">
      <header className="art-header">
        <h1>{TEXT.APP_TITLE}</h1>
        <div style={{alignItems: 'left', display: 'flex', gap: '10px'}}>
          <p className="subtitle">{TEXT.APP_SUBTITLE}</p>
          <button 
            onClick={() => changeLayout(LAYOUTS.ART)}
            className={`layout-icon ${layout === LAYOUTS.ART ? 'active' : ''}`}
            title="Art"
          >
            <FontAwesomeIcon icon={faImages} size="lg" />
          </button>
          <button 
            onClick={() => changeLayout(LAYOUTS.ABOUT)}
            className={`layout-icon ${layout === LAYOUTS.ABOUT ? 'active' : ''}`}
            title="About"
          >
            <FontAwesomeIcon icon={faPerson} size="lg" />
          </button>
        </div>
      </header>

      {layout === LAYOUTS.ART && (
        <ArtLayoutPage />
      )}
      {layout === LAYOUTS.ABOUT && (
        <AboutPage />
      )}
      
      <footer className="art-footer">
        <p>{TEXT.FOOTER_COPYRIGHT}</p>
        <div className="navigation">
          <Link to="/addNewArt" className="art-page-link">
            Add New Art
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default App
