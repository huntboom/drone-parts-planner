import React, { useState, useEffect } from 'react';
import { getMeshNames, getDronePartsSummary, findMeshByName } from '../utils/glbInspector';
import './PartsVisibilityPanel.css';

function PartsVisibilityPanel({ scene, onVisibilityChange }) {
  const [parts, setParts] = useState([]);
  const [visibility, setVisibility] = useState({});
  const [groupedParts, setGroupedParts] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    if (scene) {
      const meshNames = getMeshNames(scene);
      const summary = getDronePartsSummary(scene);
      
      // Group parts by type
      const grouped = {
        frame: [],
        motors: [],
        propellers: [],
        other: []
      };
      
      const initialVisibility = {};
      
      meshNames.forEach(({ name }) => {
        const nameLower = name.toLowerCase();
        initialVisibility[name] = true; // All visible by default
        
        if (nameLower.includes('frame')) {
          grouped.frame.push(name);
        } else if (nameLower.includes('motor')) {
          grouped.motors.push(name);
        } else if (nameLower.includes('prop')) {
          grouped.propellers.push(name);
        } else {
          grouped.other.push(name);
        }
      });
      
      setParts(meshNames);
      setGroupedParts(grouped);
      setVisibility(initialVisibility);
      
      // Expand all groups by default
      setExpandedGroups({
        frame: true,
        motors: true,
        propellers: true,
        other: true
      });
    }
  }, [scene]);

  const togglePart = (partName) => {
    if (!scene) return;
    
    const newVisibilityState = !visibility[partName];
    const newVisibility = { ...visibility, [partName]: newVisibilityState };
    
    // Find and update the part in the scene - use exact name match first
    let partObjects = [];
    scene.traverse((child) => {
      if (child.name === partName) {
        partObjects.push(child);
      }
    });
    
    // If no exact match, try partial match
    if (partObjects.length === 0) {
      partObjects = findMeshByName(scene, partName);
    }
    
    console.log(`Toggling ${partName}: found ${partObjects.length} objects, setting visible=${newVisibilityState}`);
    
    partObjects.forEach(obj => {
      obj.visible = newVisibilityState;
      // Force update
      if (obj.material) {
        obj.material.needsUpdate = true;
      }
    });
    
    setVisibility(newVisibility);
    
    if (onVisibilityChange) {
      onVisibilityChange(partName, newVisibilityState);
    }
  };

  const toggleGroup = (groupName) => {
    if (!scene) return;
    
    const groupParts = groupedParts[groupName] || [];
    const allVisible = groupParts.every(name => visibility[name]);
    const newVisibility = { ...visibility };
    const newVisibleState = !allVisible;
    
    groupParts.forEach(partName => {
      newVisibility[partName] = newVisibleState;
      
      // Find exact match first
      let partObjects = [];
      scene.traverse((child) => {
        if (child.name === partName) {
          partObjects.push(child);
        }
      });
      
      // If no exact match, try partial
      if (partObjects.length === 0) {
        partObjects = findMeshByName(scene, partName);
      }
      
      partObjects.forEach(obj => {
        obj.visible = newVisibleState;
        if (obj.material) {
          obj.material.needsUpdate = true;
        }
      });
    });
    
    setVisibility(newVisibility);
  };

  const toggleAll = (visible) => {
    if (!scene) return;
    
    const newVisibility = {};
    parts.forEach(({ name }) => {
      newVisibility[name] = visible;
      
      // Find exact match first
      let partObjects = [];
      scene.traverse((child) => {
        if (child.name === name) {
          partObjects.push(child);
        }
      });
      
      // If no exact match, try partial
      if (partObjects.length === 0) {
        partObjects = findMeshByName(scene, name);
      }
      
      partObjects.forEach(obj => {
        obj.visible = visible;
        if (obj.material) {
          obj.material.needsUpdate = true;
        }
      });
    });
    
    setVisibility(newVisibility);
  };

  const toggleGroupExpanded = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  if (!scene || parts.length === 0) {
    return (
      <div className="parts-panel">
        <div className="parts-panel-header">
          <h3>Parts Visibility</h3>
        </div>
        <div className="parts-panel-empty">
          No parts available. Select a frame to view parts.
        </div>
      </div>
    );
  }

  const summary = getDronePartsSummary(scene);
  const allVisible = parts.every(({ name }) => visibility[name]);
  const allHidden = parts.every(({ name }) => !visibility[name]);

  return (
    <div className="parts-panel">
      <div className="parts-panel-header">
        <h3>Parts Visibility</h3>
        <div className="parts-panel-actions">
          <button 
            className="btn-toggle-all"
            onClick={() => toggleAll(true)}
            disabled={allVisible}
            title="Show all parts"
          >
            Show All
          </button>
          <button 
            className="btn-toggle-all"
            onClick={() => toggleAll(false)}
            disabled={allHidden}
            title="Hide all parts"
          >
            Hide All
          </button>
        </div>
      </div>
      
      <div className="parts-panel-summary">
        <div className="summary-item">
          <span className="summary-label">Frame:</span>
          <span className="summary-value">{summary.frame}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Motors:</span>
          <span className="summary-value">{summary.motors}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Props:</span>
          <span className="summary-value">{summary.propellers}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Other:</span>
          <span className="summary-value">{summary.other}</span>
        </div>
      </div>

      <div className="parts-panel-content">
        {/* Frame Group */}
        {groupedParts.frame.length > 0 && (
          <div className="parts-group">
            <div 
              className="parts-group-header"
              onClick={() => toggleGroupExpanded('frame')}
            >
              <span className="group-icon">{expandedGroups.frame ? '▼' : '▶'}</span>
              <span className="group-name">Frame ({groupedParts.frame.length})</span>
              <button
                className="btn-toggle-group"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroup('frame');
                }}
              >
                {groupedParts.frame.every(name => visibility[name]) ? 'Hide' : 'Show'}
              </button>
            </div>
            {expandedGroups.frame && (
              <div className="parts-list">
                {groupedParts.frame.map(name => (
                  <label key={name} className="part-item">
                    <input
                      type="checkbox"
                      checked={visibility[name] ?? true}
                      onChange={(e) => {
                        e.stopPropagation();
                        togglePart(name);
                      }}
                    />
                    <span className="part-name">{name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Motors Group */}
        {groupedParts.motors.length > 0 && (
          <div className="parts-group">
            <div 
              className="parts-group-header"
              onClick={() => toggleGroupExpanded('motors')}
            >
              <span className="group-icon">{expandedGroups.motors ? '▼' : '▶'}</span>
              <span className="group-name">Motors ({groupedParts.motors.length})</span>
              <button
                className="btn-toggle-group"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroup('motors');
                }}
              >
                {groupedParts.motors.every(name => visibility[name]) ? 'Hide' : 'Show'}
              </button>
            </div>
            {expandedGroups.motors && (
              <div className="parts-list">
                {groupedParts.motors.map(name => (
                  <label key={name} className="part-item">
                    <input
                      type="checkbox"
                      checked={visibility[name] ?? true}
                      onChange={(e) => {
                        e.stopPropagation();
                        togglePart(name);
                      }}
                    />
                    <span className="part-name">{name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Propellers Group */}
        {groupedParts.propellers.length > 0 && (
          <div className="parts-group">
            <div 
              className="parts-group-header"
              onClick={() => toggleGroupExpanded('propellers')}
            >
              <span className="group-icon">{expandedGroups.propellers ? '▼' : '▶'}</span>
              <span className="group-name">Propellers ({groupedParts.propellers.length})</span>
              <button
                className="btn-toggle-group"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroup('propellers');
                }}
              >
                {groupedParts.propellers.every(name => visibility[name]) ? 'Hide' : 'Show'}
              </button>
            </div>
            {expandedGroups.propellers && (
              <div className="parts-list">
                {groupedParts.propellers.map(name => (
                  <label key={name} className="part-item">
                    <input
                      type="checkbox"
                      checked={visibility[name] ?? true}
                      onChange={(e) => {
                        e.stopPropagation();
                        togglePart(name);
                      }}
                    />
                    <span className="part-name">{name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Other Parts Group */}
        {groupedParts.other.length > 0 && (
          <div className="parts-group">
            <div 
              className="parts-group-header"
              onClick={() => toggleGroupExpanded('other')}
            >
              <span className="group-icon">{expandedGroups.other ? '▼' : '▶'}</span>
              <span className="group-name">Other ({groupedParts.other.length})</span>
              <button
                className="btn-toggle-group"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroup('other');
                }}
              >
                {groupedParts.other.every(name => visibility[name]) ? 'Hide' : 'Show'}
              </button>
            </div>
            {expandedGroups.other && (
              <div className="parts-list">
                {groupedParts.other.map(name => (
                  <label key={name} className="part-item">
                    <input
                      type="checkbox"
                      checked={visibility[name] ?? true}
                      onChange={(e) => {
                        e.stopPropagation();
                        togglePart(name);
                      }}
                    />
                    <span className="part-name">{name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PartsVisibilityPanel;

