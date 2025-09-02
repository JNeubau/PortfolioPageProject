import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faArrowLeft, faImage } from '@fortawesome/free-solid-svg-icons'
import { 
    VALIDATION, 
    TEXT, 
    DEFAULTS 
} from './config/parameters'
import './App.css'

function AddArtPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        year: DEFAULTS.YEAR,
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    
    // Function to save data to the file system through our custom API endpoint
    const saveToFile = async (artworks) => {
        try {
            const response = await fetch('/api/save-artwork', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ artworks }),
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('Data saved to file successfully');
            } else {
                console.error('Error saving data:', result.message);
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                image: file
            }));
            
            // Create image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setFormData(prevData => ({
                ...prevData,
                image: file
            }));
            
            // Create image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            
            // Update the file input element
            if (fileInputRef.current) {
                // Create a new FileList with the dropped file
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInputRef.current.files = dataTransfer.files;
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate form using validation rules from parameters
        if (!formData.title.trim() || formData.title.length < VALIDATION.MIN_TITLE_LENGTH) {
            alert(TEXT.MESSAGES.TITLE_REQUIRED);
            return;
        }
        
        if (!formData.image) {
            alert(TEXT.MESSAGES.IMAGE_REQUIRED);
            return;
        }
        
        // Validate image type
        if (!VALIDATION.ALLOWED_IMAGE_TYPES.includes(formData.image.type)) {
            alert(TEXT.MESSAGES.INVALID_IMAGE_TYPE);
            return;
        }
        
        // Validate image size
        if (formData.image.size > VALIDATION.MAX_IMAGE_SIZE) {
            alert(TEXT.MESSAGES.IMAGE_TOO_LARGE);
            return;
        }
        
        // Convert image to base64 for storing in JSON
        const reader = new FileReader();
        reader.onloadend = () => {
            // Create a new artwork object with the form data
            const newArtwork = {
                id: Date.now().toString(), // Generate a unique ID using timestamp
                title: formData.title,
                description: formData.description,
                year: formData.year,
                imageData: reader.result, // Include the base64 image data
                fileName: formData.image.name,
                dateCreated: new Date().toISOString()
            };
            
            // Get existing artworks from localStorage or initialize empty array
            let existingArtworks = [];
            try {
                const savedData = localStorage.getItem('artworks');
                if (savedData) {
                    existingArtworks = JSON.parse(savedData);
                }
            } catch (error) {
                console.error('Error reading from localStorage:', error);
            }
            
            // Add the new artwork
            existingArtworks.push(newArtwork);
            
            // Save to localStorage for persistence between sessions
            localStorage.setItem('artworks', JSON.stringify(existingArtworks));
            
            // Save to file using our custom API endpoint
            saveToFile(existingArtworks);
            
            // Show success message
            alert(TEXT.MESSAGES.SUBMISSION_SUCCESS(formData.title));
            
            // Navigate back to home page
            navigate('/');
        };
        
        // Start the reading process
        reader.readAsDataURL(formData.image);
    }

    const handleBackToHome = () => {
        navigate('/');
    }

    return (
        <div className="add-art-container">
            <h2>{TEXT.ADD_ART_TITLE}</h2>
            <p>{TEXT.ADD_ART_SUBTITLE}</p>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">{TEXT.FORM_LABELS.TITLE}</label>
                    <input 
                        type="text" 
                        id="title" 
                        name="title" 
                        value={formData.title}
                        onChange={handleChange}
                        required
                        minLength={VALIDATION.MIN_TITLE_LENGTH}
                        maxLength={VALIDATION.MAX_TITLE_LENGTH}
                        placeholder={TEXT.FORM_PLACEHOLDERS.TITLE}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="description">{TEXT.FORM_LABELS.DESCRIPTION}</label>
                    <textarea 
                        id="description" 
                        name="description" 
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        maxLength={VALIDATION.MAX_DESCRIPTION_LENGTH}
                        placeholder={TEXT.FORM_PLACEHOLDERS.DESCRIPTION}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="year">{TEXT.FORM_LABELS.YEAR}</label>
                    <input 
                        type="number" 
                        id="year" 
                        name="year" 
                        value={formData.year}
                        onChange={handleChange}
                        min={VALIDATION.MIN_YEAR}
                        max={VALIDATION.MAX_YEAR}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="image">{TEXT.FORM_LABELS.IMAGE}</label>
                    <div 
                        className={`file-input-container ${isDragging ? 'dragging' : ''} ${imagePreview ? 'has-preview' : ''}`}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input 
                            type="file" 
                            id="image" 
                            name="image" 
                            accept={VALIDATION.ALLOWED_IMAGE_TYPES.join(',')}
                            onChange={handleImageChange}
                            ref={fileInputRef}
                        />
                        {imagePreview ? (
                            <div className="file-preview">
                                <img src={imagePreview} alt="Preview" />
                            </div>
                        ) : (
                            <div className="file-input-placeholder">
                                <FontAwesomeIcon icon={faImage} size="2x" />
                                <span>{TEXT.FORM_PLACEHOLDERS.FILE_UPLOAD}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button">
                        <FontAwesomeIcon icon={faUpload} className="button-icon" />
                        {TEXT.SUBMIT_BUTTON}
                    </button>
                    <button type="button" className="back-button" onClick={handleBackToHome}>
                        <FontAwesomeIcon icon={faArrowLeft} className="button-icon" />
                        {TEXT.BACK_BUTTON}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddArtPage