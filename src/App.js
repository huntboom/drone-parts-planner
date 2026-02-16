import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import DroneViewer from './components/DroneViewer';
import FrameSelector from './components/FrameSelector';
import './App.css';

function App() {
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [error, setError] = useState(null);

  // Debug: Log when frame is selected
  useEffect(() => {
    if (selectedFrame) {
      console.log('Selected frame:', selectedFrame);
      setError(null);
    }
  }, [selectedFrame]);

  return (
    <div className="app">
      <div className="app-header">
        <h1>Drone Parts Planner</h1>
        <p>Build your custom drone - Start by choosing a frame</p>
        {error && (
          <div style={{ color: '#ff6b6b', marginTop: '10px' }}>
            Error loading model: {error}
          </div>
        )}
        {selectedFrame && (
          <div style={{ color: '#51cf66', marginTop: '5px', fontSize: '0.85rem' }}>
            Loading: {selectedFrame.name}
          </div>
        )}
      </div>
      
      <div className="app-content">
        <FrameSelector 
          selectedFrame={selectedFrame} 
          onSelectFrame={setSelectedFrame} 
        />
        
        <div className="viewer-container">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            onCreated={(state) => {
              // Debug camera
              console.log('Canvas created, camera:', state.camera.position);
            }}
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} />
            <pointLight position={[0, 10, 0]} intensity={0.5} />
            <Environment preset="sunset" />
            
            {/* Grid helper for reference */}
            <gridHelper args={[10, 10, '#444', '#222']} />
            <axesHelper args={[2]} />
            
            {selectedFrame ? (
              <DroneViewer 
                framePath={selectedFrame.path}
                onError={(err) => setError(err)}
              />
            ) : (
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#444" />
              </mesh>
            )}
            
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={1}
              maxDistance={50}
              target={[0, 0, 0]}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
}

export default App;

