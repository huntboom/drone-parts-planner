#!/usr/bin/env node
/**
 * Script to generate frame catalog from available GLB files
 * Run: node generate-frame-catalog.js
 */

const fs = require('fs');
const path = require('path');

const DRONE_MODELS_PATH = path.join(__dirname, '../DroneModels/exportedDroneModels');
const OUTPUT_FILE = path.join(__dirname, 'src/data/frameCatalog.js');

function getFrameName(folderName) {
  // Remove "Table" prefix and clean up the name
  let name = folderName.replace(/^Table/, '');
  
  // Handle special cases
  name = name.replace(/\s*\(1\)$/, ''); // Remove (1) suffix
  name = name.replace(/\s*\(2\)$/, ''); // Remove (2) suffix
  
  // Add spaces before capital letters (camelCase to Title Case)
  name = name.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // Handle numbers
  name = name.replace(/([A-Za-z])(\d)/g, '$1 $2');
  name = name.replace(/(\d)([A-Za-z])/g, '$1 $2');
  
  return name.trim();
}

function findGLBFiles(dir) {
  const frames = [];
  
  if (!fs.existsSync(dir)) {
    console.error(`Error: Directory not found: ${dir}`);
    return frames;
  }
  
  const folders = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const folder of folders) {
    if (folder.isDirectory()) {
      const folderPath = path.join(dir, folder.name);
      const glbFile = path.join(folderPath, `${folder.name}.glb`);
      
      if (fs.existsSync(glbFile)) {
        const relativePath = `/DroneModels/exportedDroneModels/${folder.name}/${folder.name}.glb`;
        frames.push({
          name: getFrameName(folder.name),
          path: relativePath,
          folder: folder.name
        });
      }
    }
  }
  
  // Sort alphabetically by name
  frames.sort((a, b) => a.name.localeCompare(b.name));
  
  return frames;
}

function generateCatalog() {
  console.log('Scanning for GLB files...');
  const frames = findGLBFiles(DRONE_MODELS_PATH);
  
  console.log(`Found ${frames.length} frames`);
  
  // Create data directory if it doesn't exist
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Generate the catalog file
  const catalogContent = `// Auto-generated frame catalog
// Run: node generate-frame-catalog.js to regenerate

export const FRAME_CATALOG = ${JSON.stringify(frames, null, 2)};

export const getFrameByPath = (path) => {
  return FRAME_CATALOG.find(frame => frame.path === path);
};

export const getFrameByName = (name) => {
  return FRAME_CATALOG.find(frame => frame.name.toLowerCase() === name.toLowerCase());
};
`;
  
  fs.writeFileSync(OUTPUT_FILE, catalogContent, 'utf8');
  console.log(`\nCatalog generated: ${OUTPUT_FILE}`);
  console.log(`Total frames: ${frames.length}`);
}

// Run if called directly
if (require.main === module) {
  generateCatalog();
}

module.exports = { generateCatalog, findGLBFiles };

