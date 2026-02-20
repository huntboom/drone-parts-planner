/**
 * Debug utilities to verify scene traversal and object discovery
 */

/**
 * Get a comprehensive list of ALL objects in the scene, categorized
 * @param {THREE.Scene} scene - The loaded GLB scene
 * @returns {Object} Detailed breakdown of all objects
 */
export function debugSceneStructure(scene) {
  const breakdown = {
    total: 0,
    withNames: 0,
    withoutNames: 0,
    meshes: [],
    groups: [],
    other: [],
    toggleable: [],
    nonToggleable: []
  };
  
  scene.traverse((child) => {
    breakdown.total++;
    
    const hasName = child.name && child.name.trim().length > 0;
    const isMesh = child.isMesh;
    const isGroup = child.isGroup;
    const isObject3D = child.isObject3D;
    
    if (hasName) {
      breakdown.withNames++;
    } else {
      breakdown.withoutNames++;
    }
    
    if (isMesh) {
      breakdown.meshes.push({
        name: child.name || '(unnamed)',
        type: child.type,
        visible: child.visible
      });
    } else if (isGroup) {
      breakdown.groups.push({
        name: child.name || '(unnamed)',
        children: child.children.length,
        visible: child.visible
      });
    } else if (isObject3D) {
      breakdown.other.push({
        name: child.name || '(unnamed)',
        type: child.type,
        visible: child.visible
      });
    }
    
    // Check if toggleable
    const isToggleable = isMesh || isGroup || isObject3D;
    if (isToggleable && hasName) {
      breakdown.toggleable.push({
        name: child.name,
        type: isMesh ? 'mesh' : isGroup ? 'group' : 'object3d',
        visible: child.visible
      });
    } else if (isToggleable && !hasName) {
      breakdown.nonToggleable.push({
        type: isMesh ? 'mesh' : isGroup ? 'group' : 'object3d',
        visible: child.visible
      });
    }
  });
  
  return breakdown;
}

/**
 * Compare what getMeshNames finds vs what's actually in the scene
 * @param {THREE.Scene} scene - The loaded GLB scene
 * @param {Function} getMeshNames - The getMeshNames function
 * @returns {Object} Comparison results
 */
export function verifyMeshDiscovery(scene, getMeshNames) {
  const found = getMeshNames(scene);
  const debug = debugSceneStructure(scene);
  
  const foundNames = new Set(found.map(f => f.name));
  const toggleableNames = new Set(debug.toggleable.map(t => t.name));
  
  const missing = debug.toggleable.filter(t => !foundNames.has(t.name));
  const extra = found.filter(f => !toggleableNames.has(f.name));
  
  return {
    found: found.length,
    shouldFind: debug.toggleable.length,
    match: found.length === debug.toggleable.length,
    missing: missing.map(m => m.name),
    extra: extra.map(e => e.name),
    breakdown: debug
  };
}

