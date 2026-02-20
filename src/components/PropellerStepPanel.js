import React from 'react';
import { getPropellers } from '../utils/glbInspector';
import './StepPanel.css';

function PropellerStepPanel({ scene, onComplete }) {
  const propellers = scene ? getPropellers(scene) : [];
  const propNames = [...new Set(propellers.map((p) => p.name))];

  return (
    <div className="step-panel">
      <div className="step-panel-header">
        <h3>Step 3: Choose your propeller</h3>
        <p className="step-panel-desc">Select the propeller to go with your motor.</p>
      </div>
      <div className="step-panel-content">
        {propNames.length > 0 ? (
          <>
            <ul className="step-part-list">
              {propNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <button type="button" className="step-next-btn" onClick={onComplete}>
              Add propellers & finish build
            </button>
          </>
        ) : (
          <p className="step-panel-empty">No propeller parts found in this model.</p>
        )}
      </div>
    </div>
  );
}

export default PropellerStepPanel;
