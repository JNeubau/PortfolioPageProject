import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faPalette, faMapMarkerAlt, faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { TEXT, ARTIST_NAME, ARTIST_BIO } from './config/parameters'
import './App.css'

function AboutPage() {
    return (
        <div className="art-layout-container">
            <section className="about-content">
                <div className="author-bio">
                    <h3>{TEXT.ABOUT_PAGE_TITLE}</h3>
                    
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
                    <h3>{ARTIST_BIO.title}</h3>
                    <div className="info-item">
                        <FontAwesomeIcon icon={faPalette} />
                        <span>Specializing in acrylic painting, digital illustration, and mixed media</span>
                    </div>
                    <div className="info-item">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <span>{ARTIST_BIO.location}</span>
                    </div>
                    <div className="info-item">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <span>
                            <a href={`mailto:${ARTIST_BIO.contactEmail}`}>
                                {ARTIST_BIO.contactEmail}
                            </a>
                        </span>
                    </div>
                    <div className="info-item">
                        <FontAwesomeIcon icon={faNewspaper} />
                        <span>
                            {ARTIST_BIO.reviewsText}{' '}
                            <a href={ARTIST_BIO.reviewsPage} target="_blank" rel="noopener noreferrer">
                                {ARTIST_BIO.reviewsPage}
                            </a>
                        </span>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AboutPage