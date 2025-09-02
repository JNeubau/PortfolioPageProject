import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to process the artwork submission
async function processSubmission() {
  try {
    // Read the submission data
    const submissionData = JSON.parse(fs.readFileSync('submission.json', 'utf8'));
    const newArtwork = submissionData.artwork;
    
    // Path to data.json
    const dataFilePath = path.join(process.cwd(), 'src', 'assets', 'data.json');
    
    // Read existing data
    let existingData = { artworks: [] };
    if (fs.existsSync(dataFilePath)) {
      try {
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        existingData = JSON.parse(fileContent);
      } catch (error) {
        console.warn('Error parsing existing data.json, creating new file:', error);
      }
    }
    
    // Add the new artwork to the existing data
    existingData.artworks.push(newArtwork);
    
    // Write the updated data back to data.json
    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));
    
    console.log('Successfully added new artwork to data.json');
  } catch (error) {
    console.error('Error processing submission:', error);
    process.exit(1);
  }
}

// Run the function
processSubmission();
