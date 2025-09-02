import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import GalleryCard from './GalleryCard'
import artworkData from './assets/data.json'

function ArtLayoutPage() {
  const [artworks, setArtworks] = useState([])
  
  useEffect(() => {
    // Load artworks from data.json
    if (artworkData && artworkData.artworks) {
      setArtworks(artworkData.artworks)
    }
  }, [])

  return (
    <div className="art-layout-container">
      {/* <main className="gallery-grid"> */}
        {artworks.map((artwork) => (
          <GalleryCard
            key={artwork.id}
            title={artwork.title}
            description={`${artwork.description} (${artwork.year})`}
            imageData={artwork.imageData}
          />
        ))}
      {/* </main> */}
      <Link to="/" className="back-link">Back to Main Page</Link>
    </div>
  )
}

export default ArtLayoutPage
