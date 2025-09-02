import { useState } from 'react';
import './App.css';

function GalleryCard({ title, description, images, imageData }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showFullImage, setShowFullImage] = useState(false);
    
    // Handle both new format (images array) and old format (imageData string)
    const hasMultipleImages = images && Array.isArray(images) && images.length > 0;
    const singleImageData = imageData || (hasMultipleImages ? images[0].imageData : null);
    
    const nextImage = (e) => {
        e.stopPropagation();
        if (hasMultipleImages) {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }
    };
    
    const prevImage = (e) => {
        e.stopPropagation();
        if (hasMultipleImages) {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === 0 ? images.length - 1 : prevIndex - 1
            );
        }
    };
    
    const toggleFullImage = () => {
        setShowFullImage(!showFullImage);
    };
    
    const closeFullImage = (e) => {
        e.stopPropagation();
        setShowFullImage(false);
    };
    
    const currentImageData = hasMultipleImages ? images[currentImageIndex].imageData : singleImageData;
    
    return (
        <>
            <div className="gallery-item horizontal-layout">
                <div className="item-image-container">
                    {currentImageData ? (
                        <div className="item-image" onClick={toggleFullImage}>
                            <img 
                                src={currentImageData} 
                                alt={title} 
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
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
                </div>
                <div className="item-content">
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </div>
            
            {showFullImage && (
                <div className="fullsize-image-overlay" onClick={closeFullImage}>
                    <div className="fullsize-image-container">
                        <img 
                            src={currentImageData} 
                            alt={title} 
                            className="fullsize-image"
                        />
                        <button className="close-fullsize-btn" onClick={closeFullImage}>×</button>
                        
                        {hasMultipleImages && images.length > 1 && (
                            <>
                                <button className="fullsize-nav-btn prev-btn" onClick={prevImage}>
                                    &#10094;
                                </button>
                                <button className="fullsize-nav-btn next-btn" onClick={nextImage}>
                                    &#10095;
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default GalleryCard;