import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import GalleryCard from './GalleryCard'

function ArtLayoutPage() {
  return (
    <div className="art-layout-container">
      <main className="gallery-grid">
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
      <GalleryCard title={"Sample Art"} description={"This is a sample description."} imagePath={null} category={"digital"} />
    </div>
  )
}

export default ArtLayoutPage
