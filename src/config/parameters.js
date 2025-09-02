/**
 * Application Parameters
 * 
 * This file contains centralized configuration parameters used throughout the application.
 * Keeping these values in one place makes it easier to maintain consistency and update
 * values across the entire application.
 */

// Layout settings
export const LAYOUTS = {
  ART: 'art',
  ABOUT: 'about'
};

// Color palette (matches CSS variables but accessible in JS)
export const COLORS = {
  // Primary colors
  PRIMARY: '#4A86E8',         // --art-accent-color
  SECONDARY: '#4CAF50',       // Submit button color
  SUCCESS: '#45a049',         // Submit hover color
  ERROR: '#e74c3c',
  WARNING: '#f39c12',
  INFO: '#3498db',
  
  // Background colors
  BG_LIGHT: '#ebd7c6ff',        // --art-bg-color (light theme)
  // BG_LIGHT: '#f8f9fa',        // --art-bg-color (light theme)
  BG_DARK: '#222831',         // --art-bg-color (dark theme)
  
  // Text colors
  TEXT_LIGHT: '#333333',      // --art-text-color (light theme)
  TEXT_DARK: '#f0f0f0',       // --art-text-color (dark theme)
  
  // Border colors
  BORDER_LIGHT: '#e0e0e0',    // --art-border-color (light theme)
  BORDER_DARK: '#444444'      // --art-border-color (dark theme)
};

// Breakpoints for responsive design (in pixels)
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE: 1440
};

// Form validation rules
export const VALIDATION = {
  MIN_TITLE_LENGTH: 3,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_YEAR: 2000,
  MAX_YEAR: new Date().getFullYear(),
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_IMAGE_SIZE: 5 * 1024 * 1024  // 5MB in bytes
};

// Artist information
export const ARTIST_NAME = 'Zuzanna Stępska';

export const ARTIST_BIO = {
  name: ARTIST_NAME,
  title: 'Contemporary Artist',
  location: 'Based in Poznań, Poland',
  contactEmail: 'some.email@something.com',
  reviewsPage: 'some_reviewsPage.com',
  reviewsText: 'Read my reviews at'
}

// Application text content
export const TEXT = {
  APP_TITLE: `${ARTIST_NAME} Portfolio`,
  APP_SUBTITLE: 'A collection of art works',
  FOOTER_COPYRIGHT: `© ${new Date().getFullYear()} ${ARTIST_NAME} Portfolio. All rights reserved.`,
  
  // Page titles
  ADD_ART_TITLE: 'Add New Artwork',
  ADD_ART_SUBTITLE: 'Use the form below to add a new piece to your portfolio.',
  ABOUT_PAGE_TITLE: 'About',
  
  // Button labels
  SUBMIT_BUTTON: 'Submit Artwork',
  BACK_BUTTON: 'Back to Main Page',
  
  // Form labels
  FORM_LABELS: {
    TITLE: 'Artwork Title',
    DESCRIPTION: 'Description',
    YEAR: 'Year Created',
    IMAGES: 'Upload Images'
  },

  // Form placeholders
  FORM_PLACEHOLDERS: {
    TITLE: 'Enter the title of your artwork',
    DESCRIPTION: 'Describe your artwork, techniques used, inspiration, etc.',
    FILE_UPLOAD: 'Choose files or drop them here'
  },
  
  // Success/error messages
  MESSAGES: {
    SUBMISSION_SUCCESS: (title) => `Art "${title}" submitted successfully!`,
    TITLE_REQUIRED: 'Please enter a title for your artwork',
    IMAGE_REQUIRED: 'Please upload at least one image of your artwork',
    INVALID_IMAGE_TYPE: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)',
    IMAGE_TOO_LARGE: 'Image size exceeds the maximum allowed (5MB)'
  }
};

// Default values
export const DEFAULTS = {
  LAYOUT: LAYOUTS.ART,
  YEAR: new Date().getFullYear()
};
