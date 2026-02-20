/**
 * Utility functions to inspect and access sub-parts from GLB files
 */

/**
 * Get all mesh names from a GLB scene
 * Only includes objects that have names and can be toggled
 * @param {THREE.Scene} scene - The loaded GLB scene
 * @returns {Array} Array of object names with metadata
 */
export function getMeshNames(scene) {
  const names = [];
  const seenNames = new Set(); // Track to avoid duplicates
  
  scene.traverse((child) => {
    // Include various object types that can be toggled
    const isToggleable = child.isMesh || 
                        child.isGroup || 
                        child.isObject3D;
    
    // Only include objects with names (empty strings don't count)
    const hasName = child.name && child.name.trim().length > 0;
    
    if (isToggleable && hasName) {
      // Avoid duplicates (in case same object appears multiple times)
      if (!seenNames.has(child.name)) {
        seenNames.add(child.name);
        names.push({
          name: child.name,
          type: child.isMesh ? 'mesh' : 
                child.isGroup ? 'group' : 
                'object3d',
          children: child.children?.length || 0,
          object: child // Store reference for direct access
        });
      }
    }
  });
  
  return names;
}

/**
 * Find a specific mesh by name (supports exact and partial matching)
 * @param {THREE.Scene} scene - The loaded GLB scene
 * @param {string} searchName - Name or partial name to search for
 * @param {boolean} exactOnly - If true, only exact matches
 * @returns {Array} Array of matching objects
 */
export function findMeshByName(scene, searchName, exactOnly = false) {
  const matches = [];
  
  if (!searchName || searchName.trim().length === 0) {
    return matches;
  }
  
  const searchLower = searchName.toLowerCase();
  
  scene.traverse((child) => {
    if (child.name && child.name.trim().length > 0) {
      const childNameLower = child.name.toLowerCase();
      
      if (exactOnly) {
        if (childNameLower === searchLower) {
          matches.push(child);
        }
      } else {
        // Try exact match first, then partial
        if (childNameLower === searchLower || childNameLower.includes(searchLower)) {
          matches.push(child);
        }
      }
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
 * Apply visibility based on build step: 1 = frame only, 2 = frame + motors, 3 = frame + motors + props
 * We only hide motors (step 1) and props (step 1 & 2); everything else stays visible so the frame and
 * any unnamed parent groups are never accidentally hidden.
 * @param {THREE.Scene} scene - The loaded GLB scene
 * @param {number} step - Build step (1, 2, or 3)
 */
export function applyBuildStepVisibility(scene, step) {
  if (!scene) return;
  const s = Math.max(1, Math.min(3, step));
  scene.traverse((child) => {
    const name = (child.name && child.name.trim()) ? child.name.toLowerCase() : '';
    const isMotor = name.includes('motor');
    const isProp = name.includes('prop');
    // Only hide motors and props by step; leave everything else visible (frame, unnamed groups, etc.)
    if (isMotor) {
      child.visible = s >= 2;
    } else if (isProp) {
      child.visible = s >= 3;
    } else {
      // Frame, unnamed objects, and any other parts: always visible
      child.visible = true;
    }
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
    // Only count objects with names
    const hasName = child.name && child.name.trim().length > 0;
    const isToggleable = child.isMesh || child.isGroup || child.isObject3D;
    
    if (isToggleable && hasName) {
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
      
      summary.allNames.push(child.name);
    }
  });
  
  return summary;
}

