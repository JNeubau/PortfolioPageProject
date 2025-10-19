import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import GalleryCard from './GalleryCard'
// Import the default data as a fallback
import defaultArtworkData from './assets/data.json'

function ArtLayoutPage() {
  const [artworks, setArtworks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Function to load artworks from data.json or fallback to default data
  const loadArtworks = async () => {
    setIsLoading(true);
    try {
      // Try to fetch the latest data.json file which would contain GitHub-committed data
      try {
        const response = await fetch('./assets/data.json');
        if (response.ok) {
          const data = await response.json();
          if (data && data.artworks && data.artworks.length > 0) {
            setArtworks(data.artworks);
            setIsLoading(false);
            return;
          }
        }
      } catch (fetchError) {
        console.warn('Could not fetch data.json, falling back to default data:', fetchError);
      }
      
      // If fetch fails or data is empty, use the default imported data
      if (defaultArtworkData && defaultArtworkData.artworks) {
        setArtworks(defaultArtworkData.artworks);
      }
    } catch (error) {
      console.error('Error loading artworks:', error);
      // Fallback to default data if there's an error
      if (defaultArtworkData && defaultArtworkData.artworks) {
        setArtworks(defaultArtworkData.artworks);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Load artworks when component mounts
    loadArtworks();
    
    // Add event listener for artworkSubmitted custom event
    const handleArtworkSubmitted = (event) => {
      if (event.detail && event.detail.artwork) {
        // Add the new artwork to the existing artworks
        setArtworks(prevArtworks => [...prevArtworks, event.detail.artwork]);
      }
    };
    
    window.addEventListener('artworkSubmitted', handleArtworkSubmitted);
    
    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('artworkSubmitted', handleArtworkSubmitted);
    };
  }, []);

  return (
    <div className="art-layout-container">      
      <main className="gallery-grid">
        {isLoading ? (
          <div className="loading-message">
            <p>Loading artwork...</p>
          </div>
        ) : artworks.length > 0 ? (
          artworks.map((artwork) => (
            <GalleryCard
              key={artwork.id}
              title={artwork.title}
              link={artwork.link}
              year={artwork.year}
              description={artwork.description}
              images={artwork.images}
              imageData={artwork.imageData}
            />
          ))
        ) : (
          <div className="empty-gallery-message">
            <p>Sorry. No artworks found.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default ArtLayoutPage
