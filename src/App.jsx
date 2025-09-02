import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import ArtLayoutPage from './ArtLayoutPage'
import AboutPage from './AboutPage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faPerson } from '@fortawesome/free-solid-svg-icons'
import { LAYOUTS, TEXT, DEFAULTS } from './config/parameters'

function App() {
  const [layout, setLayout] = useState(DEFAULTS.LAYOUT)

  const changeLayout = (newLayout) => {
    setLayout(newLayout)
  }

  return (
    <div className="full-width-container">
      <header className="art-header">
        <div className='header-bar'>
          <h1 style={{width: '50%', textAlign: 'right'}}>{TEXT.APP_TITLE}</h1>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', width: '50%'}}>
            <p className="subtitle" style={{marginLeft: '5px'}}>{TEXT.APP_SUBTITLE}</p>
            <div className='buttons' style={{display: 'flex', gap: '8px'}}>
              <button 
                onClick={() => changeLayout(LAYOUTS.ART)}
                className={`layout-icon ${layout === LAYOUTS.ART ? 'active' : ''}`}
                title={LAYOUTS.ART}
                style={{minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              >
                <FontAwesomeIcon icon={faImages} size="lg" />
                <span style={{marginLeft: '6px'}}>{LAYOUTS.ART.toUpperCase()}</span>
              </button>
              <button 
                onClick={() => changeLayout(LAYOUTS.ABOUT)}
                className={`layout-icon ${layout === LAYOUTS.ABOUT ? 'active' : ''}`}
                title={LAYOUTS.ABOUT}
                style={{minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              >
                <FontAwesomeIcon icon={faPerson} size="lg" />
                <span style={{marginLeft: '6px'}}>{LAYOUTS.ABOUT.toUpperCase()}</span>
              </button>
            </div>
          </div>
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
