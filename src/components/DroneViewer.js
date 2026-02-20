import React, { Suspense, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import { getDronePartsSummary } from '../utils/glbInspector';

function DroneModel({ url, onError, onSceneReady }) {
  const groupRef = useRef();
  const sceneRef = useRef(null);
  const { scene } = useGLTF(url);
  
  // Auto-scale and center the model - only run when scene or url changes
  useEffect(() => {
    if (scene && groupRef.current && sceneRef.current !== scene) {
      try {
        // Clone the scene to avoid mutating the original
        const clonedScene = scene.clone();
        sceneRef.current = clonedScene;
        
        // Calculate bounding box
        const box = new Box3().setFromObject(clonedScene);
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());
        
        console.log('Model bounds:', { center, size, url });
        
        // Calculate scale to fit in a reasonable size (max dimension = 3 units)
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = maxDimension > 0 ? 3 / maxDimension : 1;
        
        console.log('Calculated scale:', scale);
        
        // Center the model
        clonedScene.position.x = -center.x;
        clonedScene.position.y = -center.y;
        clonedScene.position.z = -center.z;
        
        // Apply scale
        clonedScene.scale.set(scale, scale, scale);
        
        // Traverse and ensure materials are visible
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              // Ensure material is visible
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  mat.needsUpdate = true;
                  if (mat.transparent && mat.opacity === 0) {
                    mat.opacity = 1;
                  }
                });
              } else {
                child.material.needsUpdate = true;
                if (child.material.transparent && child.material.opacity === 0) {
                  child.material.opacity = 1;
                }
              }
            }
          }
        });
        
        // Log parts summary
        const partsSummary = getDronePartsSummary(clonedScene);
        console.log('Drone parts available:', partsSummary);
        
        // Clear and add cloned scene
        while (groupRef.current.children.length > 0) {
          groupRef.current.remove(groupRef.current.children[0]);
        }
        groupRef.current.add(clonedScene);
        
        // Notify parent that scene is ready (with cloned scene for manipulation)
        if (onSceneReady) {
          onSceneReady(clonedScene);
        }
      } catch (err) {
        console.error('Error processing model:', err);
        if (onError) onError(err.message);
      }
    }
  }, [scene, url]); // Removed onError and onSceneReady from dependencies

  return <group ref={groupRef} />;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#666" wireframe />
    </mesh>
  );
}

function DroneViewer({ framePath, onError, onSceneReady }) {
  if (!framePath) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <DroneModel url={framePath} onError={onError} onSceneReady={onSceneReady} />
    </Suspense>
  );
}

// Preload function for better performance
export function preloadModel(path) {
  useGLTF.preload(path);
}

export default DroneViewer;

