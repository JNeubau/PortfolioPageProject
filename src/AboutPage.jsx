import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faPalette, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { TEXT } from './config/parameters'
import './App.css'

function AboutPage() {
    return (
        <div className="art-layout-container">
            <header className="about-header">
                <h1>{TEXT.ABOUT_PAGE_TITLE}</h1>
                <div className="author-image-container">
                    {/* Placeholder for author image */}
                    <div className="author-image-placeholder">
                        <FontAwesomeIcon icon={faUser} size="4x" />
                    </div>
                </div>
            </header>

            <section className="about-content">
                <div className="author-bio">
                    <h2>Julia Neubauer</h2>
                    <p className="author-title">Contemporary Visual Artist</p>
                    
                    <p className="bio-text">
                        Welcome to my artistic journey. I am a passionate visual artist based in Vienna, exploring the boundaries between traditional techniques and digital innovation. My work seeks to capture the ephemeral moments of beauty in everyday life and transform them into lasting impressions.
                    </p>
                    
                    <p className="bio-text">
                        After graduating from the Vienna Academy of Fine Arts in 2022, I've dedicated myself to creating pieces that reflect both inner emotions and outer experiences. I draw inspiration from urban landscapes, natural phenomena, and human connections.
                    </p>
                    
                    <p className="bio-text">
                        My artistic philosophy centers on the belief that art should evoke feelings, spark conversations, and sometimes challenge perspectives. Each piece in my portfolio represents a chapter in my ongoing exploration of color, form, and meaning.
                    </p>
                </div>

                <div className="author-info">
                    <div className="info-item">
                        <FontAwesomeIcon icon={faPalette} />
                        <span>Specializing in acrylic painting, digital illustration, and mixed media</span>
                    </div>
                    <div className="info-item">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <span>Based in Vienna, Austria</span>
                    </div>
                    <div className="info-item">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <span>contact@julianeubauer.art</span>
                    </div>
                </div>
            </section>

            <footer className="about-footer">
                <Link to="/" className="back-link">Back to Main Page</Link>
            </footer>
        </div>
    )
}

export default AboutPage