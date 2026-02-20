import React from 'react';
import './BuildSteps.css';

const STEPS = [
  { id: 1, label: 'Frame', description: 'Choose your frame' },
  { id: 2, label: 'Motor', description: 'Choose your motor' },
  { id: 3, label: 'Propeller', description: 'Choose propeller' },
];

function BuildSteps({ currentStep, onStepClick }) {
  return (
    <div className="build-steps">
      {STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isPast = currentStep > step.id;
        const isClickable = step.id <= currentStep || step.id === currentStep + 1;
        return (
          <React.Fragment key={step.id}>
            <div
              className={`build-step ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''} ${!isClickable ? 'disabled' : ''}`}
              onClick={() => isClickable && onStepClick && onStepClick(step.id)}
              role="button"
              tabIndex={isClickable ? 0 : -1}
              onKeyDown={(e) => isClickable && (e.key === 'Enter' || e.key === ' ') && onStepClick(step.id)}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="step-number">{isPast ? '✓' : step.id}</span>
              <span className="step-label">{step.label}</span>
              <span className="step-desc">{step.description}</span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`step-connector ${currentStep > step.id ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default BuildSteps;
