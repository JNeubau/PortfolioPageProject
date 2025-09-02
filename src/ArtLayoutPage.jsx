import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import GalleryCard from './GalleryCard'
// Import the default data as a fallback
import defaultArtworkData from './assets/data.json'

function ArtLayoutPage() {
  const [artworks, setArtworks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Function to load artworks from localStorage, data.json or fallback to default data
  const loadArtworks = async () => {
    setIsLoading(true);
    try {
      // First try to fetch the latest data.json file which would contain GitHub-committed data
      try {
        const response = await fetch('./assets/data.json');
        if (response.ok) {
          const data = await response.json();
          if (data && data.artworks && data.artworks.length > 0) {
            setArtworks(data.artworks);
            // Update localStorage with the latest data
            localStorage.setItem('artworks', JSON.stringify(data.artworks));
            setIsLoading(false);
            return;
          }
        }
      } catch (fetchError) {
        console.warn('Could not fetch data.json, falling back to localStorage:', fetchError);
      }
      
      // If fetch fails or data is empty, try localStorage
      const savedArtworks = localStorage.getItem('artworks');
      if (savedArtworks) {
        // If found in localStorage, use that data
        const parsedArtworks = JSON.parse(savedArtworks);
        setArtworks(parsedArtworks);
      } else if (defaultArtworkData && defaultArtworkData.artworks) {
        // If not in localStorage, use the default imported data
        setArtworks(defaultArtworkData.artworks);
        // Also save the default data to localStorage for future use
        localStorage.setItem('artworks', JSON.stringify(defaultArtworkData.artworks));
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
    
    // Add event listener for artworksUpdated custom event
    const handleArtworksUpdated = (event) => {
      if (event.detail && event.detail.artworks) {
        setArtworks(event.detail.artworks);
      }
    };
    
    window.addEventListener('artworksUpdated', handleArtworksUpdated);
    
    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('artworksUpdated', handleArtworksUpdated);
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
              description={`${artwork.description} (${artwork.year})`}
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
