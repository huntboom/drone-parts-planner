import React, { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { 
  getMeshNames, 
  getDronePartsSummary, 
  findMeshByName,
  getMotors,
  getPropellers,
  getFrame
} from '../utils/glbInspector';

/**
 * Component to inspect and display parts from a GLB file
 * Useful for debugging and understanding the structure
 */
function DronePartsInspector({ framePath, onPartsFound }) {
  const [partsInfo, setPartsInfo] = useState(null);
  
  if (!framePath) return null;
  
  const { scene } = useGLTF(framePath);
  
  useEffect(() => {
    if (scene) {
      const meshNames = getMeshNames(scene);
      const summary = getDronePartsSummary(scene);
      const motors = getMotors(scene);
      const propellers = getPropellers(scene);
      const frame = getFrame(scene);
      
      const info = {
        summary,
        meshNames,
        motors: motors.map(m => m.name),
        propellers: propellers.map(p => p.name),
        frame: frame?.name || null,
        allNames: meshNames.map(m => m.name)
      };
      
      setPartsInfo(info);
      
      if (onPartsFound) {
        onPartsFound(info);
      }
      
      console.log('Drone Parts Summary:', summary);
      console.log('All mesh names:', meshNames.map(m => m.name));
      console.log('Motors:', motors.map(m => m.name));
      console.log('Propellers:', propellers.map(p => p.name));
      console.log('Frame:', frame?.name);
    }
  }, [scene, framePath, onPartsFound]);
  
  if (!partsInfo) return null;
  
  return (
    <div style={{ 
      position: 'absolute', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      padding: '15px', 
      borderRadius: '8px',
      color: '#fff',
      fontSize: '12px',
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto',
      zIndex: 1000
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Drone Parts</h3>
      <div>
        <strong>Frame:</strong> {partsInfo.summary.frame}<br/>
        <strong>Motors:</strong> {partsInfo.summary.motors}<br/>
        <strong>Propellers:</strong> {partsInfo.summary.propellers}<br/>
        <strong>Other:</strong> {partsInfo.summary.other}<br/>
        <strong>Total:</strong> {partsInfo.summary.total}
      </div>
      <details style={{ marginTop: '10px' }}>
        <summary style={{ cursor: 'pointer', marginBottom: '5px' }}>All Parts ({partsInfo.allNames.length})</summary>
        <div style={{ maxHeight: '200px', overflow: 'auto', fontSize: '11px' }}>
          {partsInfo.allNames.map((name, i) => (
            <div key={i} style={{ padding: '2px 0' }}>{name}</div>
          ))}
        </div>
      </details>
    </div>
  );
}

export default DronePartsInspector;

