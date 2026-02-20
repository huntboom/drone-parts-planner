import React from 'react';
import { getMotors } from '../utils/glbInspector';
import './StepPanel.css';

function MotorStepPanel({ scene, onNext }) {
  const motors = scene ? getMotors(scene) : [];
  const motorNames = [...new Set(motors.map((m) => m.name))];

  return (
    <div className="step-panel">
      <div className="step-panel-header">
        <h3>Step 2: Choose your motor</h3>
        <p className="step-panel-desc">Your frame includes the following motors. Add them to your build.</p>
      </div>
      <div className="step-panel-content">
        {motorNames.length > 0 ? (
          <>
            <ul className="step-part-list">
              {motorNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <button type="button" className="step-next-btn" onClick={onNext}>
              Add motors & continue to propeller
            </button>
          </>
        ) : (
          <p className="step-panel-empty">No motor parts found in this model.</p>
        )}
      </div>
    </div>
  );
}

export default MotorStepPanel;
