import { useState } from 'react';
import './App.css';

function GalleryCard({ title, description, images, imageData }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Handle both new format (images array) and old format (imageData string)
    const hasMultipleImages = images && Array.isArray(images) && images.length > 0;
    const singleImageData = imageData || (hasMultipleImages ? images[0].imageData : null);
    
    const nextImage = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }
    };
    
    const prevImage = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === 0 ? images.length - 1 : prevIndex - 1
            );
        }
    };
    
    const currentImageData = hasMultipleImages ? images[currentImageIndex].imageData : singleImageData;
    
    return (
        <div className="gallery-item">
            {currentImageData ? (
                <div className="item-image">
                    <img 
                        src={currentImageData} 
                        alt={title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    
                    {hasMultipleImages && images.length > 1 && (
                        <div className="image-navigation">
                            <button className="nav-btn prev-btn" onClick={prevImage}>
                                &#10094;
                            </button>
                            <div className="image-indicator">
                                {currentImageIndex + 1} / {images.length}
                            </div>
                            <button className="nav-btn next-btn" onClick={nextImage}>
                                &#10095;
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="item-image placeholder"></div>
            )}
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

export default GalleryCard;