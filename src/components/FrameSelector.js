import React, { useState, useMemo } from 'react';
import { FRAME_CATALOG } from '../data/frameCatalog';
import './FrameSelector.css';

function FrameSelector({ selectedFrame, onSelectFrame }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFrames = useMemo(() => {
    if (!searchTerm) return FRAME_CATALOG;
    const term = searchTerm.toLowerCase();
    return FRAME_CATALOG.filter(frame => 
      frame.name.toLowerCase().includes(term) ||
      frame.path.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleFrameSelect = (frame) => {
    onSelectFrame(frame);
  };

  return (
    <div className="frame-selector">
      <h2>Choose a Frame</h2>
      <input
        type="text"
        className="frame-search"
        placeholder="Search frames..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="frame-list">
        {filteredFrames.length > 0 ? (
          filteredFrames.map((frame, index) => (
            <div
              key={index}
              className={`frame-item ${selectedFrame?.path === frame.path ? 'selected' : ''}`}
              onClick={() => handleFrameSelect(frame)}
            >
              <div className="frame-item-name">{frame.name}</div>
              <div className="frame-item-path">{frame.path}</div>
            </div>
          ))
        ) : (
          <div className="no-frames">No frames found matching "{searchTerm}"</div>
        )}
      </div>
    </div>
  );
}

export default FrameSelector;

