import { useState } from 'react';
import './App.css';

function GalleryCard({ title, description, imagePath, category }) {
    return (
        <div className={`gallery-item ${category || 'digital'}`}>
            {imagePath ? (
                <div className="item-image">
                    <img 
                        src={imagePath} 
                        alt={title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                </div>
            ) : (
                <div className="item-image placeholder"></div>
            )}
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    )
}

export default GalleryCard;