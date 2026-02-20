import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { applyBuildStepVisibility } from './utils/glbInspector';
import DroneViewer from './components/DroneViewer';
import FrameSelector from './components/FrameSelector';
import BuildSteps from './components/BuildSteps';
import MotorStepPanel from './components/MotorStepPanel';
import PropellerStepPanel from './components/PropellerStepPanel';
import './App.css';

function App() {
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [error, setError] = useState(null);
  const [droneScene, setDroneScene] = useState(null);
  const [buildStep, setBuildStep] = useState(1);

  useEffect(() => {
    if (selectedFrame) {
      setError(null);
      setDroneScene(null);
      setBuildStep(1);
    }
  }, [selectedFrame]);

  const handleSceneReady = useCallback((scene) => {
    setDroneScene(scene);
  }, []);

  // Apply visibility based on build step whenever scene or step changes
  useEffect(() => {
    if (droneScene) {
      applyBuildStepVisibility(droneScene, buildStep);
    }
  }, [droneScene, buildStep]);

  const handleStepClick = (step) => {
    if (!selectedFrame) return;
    if (step === 1 || (step === 2 && buildStep >= 1) || (step === 3 && buildStep >= 2)) {
      setBuildStep(step);
    }
  };

  const stepSubtitle = {
    1: 'Choose your frame — motors and propellers hidden',
    2: 'Choose your motor',
    3: 'Choose your propeller',
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>Drone Parts Planner</h1>
        <p className="app-subtitle">{stepSubtitle[buildStep]}</p>
        {selectedFrame && (
          <BuildSteps currentStep={buildStep} onStepClick={handleStepClick} />
        )}
        {error && (
          <div className="app-error">
            Error loading model: {error}
          </div>
        )}
        {selectedFrame && !droneScene && (
          <div className="app-loading">Loading: {selectedFrame.name}</div>
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
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} />
            <pointLight position={[0, 10, 0]} intensity={0.5} />
            <Environment preset="sunset" />

            <gridHelper args={[10, 10, '#444', '#222']} />
            <axesHelper args={[2]} />

            {selectedFrame ? (
              <DroneViewer
                framePath={selectedFrame.path}
                onError={setError}
                onSceneReady={handleSceneReady}
              />
            ) : (
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#444" />
              </mesh>
            )}

            <OrbitControls
              enablePan
              enableZoom
              enableRotate
              minDistance={1}
              maxDistance={50}
              target={[0, 0, 0]}
            />
          </Canvas>
        </div>

        {selectedFrame && buildStep === 1 && (
          <div className="step-panel step-panel-prompt">
            <div className="step-panel-header">
              <h3>Frame selected</h3>
              <p className="step-panel-desc">
                You're viewing the frame only. Continue to add motors, then propellers.
              </p>
            </div>
            <button
              type="button"
              className="step-next-btn"
              onClick={() => setBuildStep(2)}
            >
              Continue to motor
            </button>
          </div>
        )}

        {selectedFrame && buildStep === 2 && (
          <MotorStepPanel scene={droneScene} onNext={() => setBuildStep(3)} />
        )}

        {selectedFrame && buildStep === 3 && (
          <PropellerStepPanel scene={droneScene} onComplete={() => {}} />
        )}
      </div>
    </div>
  );
}

export default App;
