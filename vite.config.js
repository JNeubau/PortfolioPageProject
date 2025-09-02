import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to save artwork data to a file
const saveArtworkPlugin = () => {
  return {
    name: 'save-artwork-plugin',
    configureServer(server) {
      // Create a middleware to save data when API endpoint is called
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/save-artwork' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const filePath = path.resolve(__dirname, 'src/assets/data.json');
              
              // Ensure data.json file exists with proper structure
              let existingData = { artworks: [] };
              if (fs.existsSync(filePath)) {
                try {
                  const fileContent = fs.readFileSync(filePath, 'utf8');
                  existingData = JSON.parse(fileContent);
                } catch (error) {
                  console.warn('Error parsing existing data.json, creating new file:', error);
                }
              }
              
              // Format the data nicely
              const jsonData = JSON.stringify({ artworks: data.artworks }, null, 2);
              
              // Write to the file
              fs.writeFileSync(filePath, jsonData);
              
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Data saved successfully' }));
            } catch (error) {
              console.error('Error saving artwork data:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: 'Error saving data' }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), saveArtworkPlugin()],
  base: "/PortfolioPageProject"
})
