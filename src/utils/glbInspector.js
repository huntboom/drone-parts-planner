/**
 * Utility functions to inspect and access sub-parts from GLB files
 */

/**
 * Get all mesh names from a GLB scene
 * @param {THREE.Scene} scene - The loaded GLB scene
 * @returns {Array} Array of object names
 */
export function getMeshNames(scene) {
  const names = [];
  scene.traverse((child) => {
    if (child.isMesh || child.isGroup) {
      names.push({
        name: child.name,
        type: child.isMesh ? 'mesh' : 'group',
        children: child.children?.length || 0
      });
    }
  });
  return names;
}

/**
 * Find a specific mesh by name (supports partial matching)
 * @param {THREE.Scene} scene - The loaded GLB scene
 * @param {string} searchName - Name or partial name to search for
 * @returns {Array} Array of matching objects
 */
export function findMeshByName(scene, searchName) {
  const matches = [];
  const searchLower = searchName.toLowerCase();
  
  scene.traverse((child) => {
    if (child.name && child.name.toLowerCase().includes(searchLower)) {
      matches.push(child);
    }
  });
  
  return matches;
}

/**
 * Get all motors from a drone scene
 * @param {THREE.Scene} scene - The loaded GLB scene
 * @returns {Array} Array of motor objects
 */
export function getMotors(scene) {
  return findMeshByName(scene, 'motor');
}

/**
 * Get all propellers from a drone scene
 * @param {THREE.Scene} scene - The loaded GLB scene
 * @returns {Array} Array of propeller objects
 */
export function getPropellers(scene) {
  const props = [];
  scene.traverse((child) => {
    if (child.name && (
      child.name.toLowerCase().includes('prop') ||
      child.name.toLowerCase().includes('propeller')
    )) {
      props.push(child);
    }
  });
  return props;
}

/**
 * Get the frame from a drone scene
 * @param {THREE.Scene} scene - The loaded GLB scene
 * @returns {THREE.Object3D|null} Frame object or null
 */
export function getFrame(scene) {
  const frames = findMeshByName(scene, 'frame');
  return frames.length > 0 ? frames[0] : null;
}

/**
 * Show/hide specific parts of the drone
 * @param {THREE.Scene} scene - The loaded GLB scene
 * @param {string} partName - Name pattern to match
 * @param {boolean} visible - Whether to show or hide
 */
export function setPartVisibility(scene, partName, visible) {
  const parts = findMeshByName(scene, partName);
  parts.forEach(part => {
    part.visible = visible;
  });
}

/**
 * Get a summary of all parts in the drone
 * @param {THREE.Scene} scene - The loaded GLB scene
 * @returns {Object} Summary object with part counts
 */
export function getDronePartsSummary(scene) {
  const summary = {
    frame: 0,
    motors: 0,
    propellers: 0,
    other: 0,
    total: 0,
    allNames: []
  };
  
  scene.traverse((child) => {
    if (child.isMesh || child.isGroup) {
      summary.total++;
      const name = child.name.toLowerCase();
      
      if (name.includes('frame')) {
        summary.frame++;
      } else if (name.includes('motor')) {
        summary.motors++;
      } else if (name.includes('prop')) {
        summary.propellers++;
      } else {
        summary.other++;
      }
      
      if (child.name) {
        summary.allNames.push(child.name);
      }
    }
  });
  
  return summary;
}

