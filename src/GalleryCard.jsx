import { useState, useRef, useEffect } from 'react';
import './App.css';

function GalleryCard({ id, title, description, year, link, images, imageData }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showFullImage, setShowFullImage] = useState(false);
    const imageContainerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(null);
    
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

    useEffect(() => {
        let mounted = true;
        const computeHeights = async () => {
            if (!hasMultipleImages || !imageContainerRef.current || !images || images.length === 0) {
                if (mounted) setContainerHeight(null);
                return;
            }

            const containerWidth = imageContainerRef.current.clientWidth || imageContainerRef.current.offsetWidth || 0;
            if (containerWidth === 0) return;

            const loadPromises = images.map(img => new Promise((resolve) => {
                const src = img.imageData || img;
                const tmp = new Image();
                tmp.onload = () => resolve({ w: tmp.naturalWidth, h: tmp.naturalHeight, src });
                tmp.onerror = () => resolve({ w: 0, h: 0, src });
                tmp.src = src;
            }));

            try {
                const results = await Promise.all(loadPromises);
                let maxDisplayH = 0;
                for (const r of results) {
                    if (!r.w || !r.h) continue;
                    const displayH = r.h * (containerWidth / r.w);
                    if (displayH > maxDisplayH) maxDisplayH = displayH;
                }

                const maxViewport = window.innerHeight * 0.8;
                if (maxDisplayH > maxViewport) maxDisplayH = maxViewport;

                if (mounted) setContainerHeight(Math.round(maxDisplayH) || null);
            } catch (e) {
                if (mounted) setContainerHeight(null);
            }
        };

        computeHeights();

        const handleResize = () => {
            computeHeights();
        };

        window.addEventListener('resize', handleResize);
        return () => { mounted = false; window.removeEventListener('resize', handleResize); };
    }, [images, hasMultipleImages]);
    
    return (
        <>
            <div className="gallery-item horizontal-layout">
                <div className="item-image-container" ref={imageContainerRef} style={hasMultipleImages && containerHeight ? { height: `${containerHeight}px` } : undefined}>
                    {currentImageData ? (
                        <div className="item-image" onClick={toggleFullImage}>
                            <img
                                src={currentImageData}
                                alt={title}
                                className="card-image"
                                style={hasMultipleImages ? { height: '100%', width: 'auto' } : undefined}
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
                    {/* <h3>{title}</h3> */}
                    <p>{description}</p>
                    {link && (
                        <footer style={{fontWeight: 'bold'}}>
                            <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)', margin: '12px 0' }} />
                            <span>Full work available at <br/>
                                <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                            </span>
                        </footer>
                    )}
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