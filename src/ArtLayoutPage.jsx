import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ART_CATEGORIES } from './config/parameters'
import './App.css'

function ArtLayoutPage() {
  const [activeGallery, setActiveGallery] = useState('all')

  // Handle gallery filter change
  const handleGalleryChange = (gallery) => {
    setActiveGallery(gallery)
  }

  // Filter categories - add 'All Works' at the beginning
  const galleryFilters = [
    { id: 'all', label: 'All Works' },
    ...ART_CATEGORIES
  ]

  return (
    <div className="art-layout-container">
      <nav className="gallery-filter">
        {galleryFilters.map(filter => (
          <button 
            key={filter.id}
            className={`filter-btn ${activeGallery === filter.id ? 'active' : ''}`}
            onClick={() => handleGalleryChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </nav>

      <main className="gallery-grid">
        {/* Sample gallery items - to be replaced with actual content */}
        <div className="gallery-item digital">
          <div className="item-image placeholder"></div>
          <h3>Digital Artwork 1</h3>
          <p>Created with Procreate, 2025</p>
        </div>
        <div className="gallery-item traditional">
          <div className="item-image placeholder"></div>
          <h3>Watercolor Painting</h3>
          <p>Watercolor on paper, 2024</p>
        </div>
        <div className="gallery-item digital">
          <div className="item-image placeholder"></div>
          <h3>Digital Illustration</h3>
          <p>Adobe Illustrator, 2025</p>
        </div>
        <div className="gallery-item traditional">
          <div className="item-image placeholder"></div>
          <h3>Acrylic Painting</h3>
          <p>Acrylic on canvas, 2024</p>
        </div>
      </main>
      
        <Link to="/" className="back-link">Back to Main Page</Link>
    </div>
  )
}

export default ArtLayoutPage
