import React, { createContext, useState, useEffect } from 'react';
import { qwertyKeys, scales } from '../KeyboardPlay';

export const ScaleContext = createContext();

export const ScaleProvider = ({ children }) => {
  const [selectedScale, setSelectedScale] = useState('C');
  const [keyMapping, setKeyMapping] = useState({});

  // Update the key-to-note mapping whenever the selected scale changes
  useEffect(() => {
    if (selectedScale && scales[selectedScale]) {
      const scaleNotes = scales[selectedScale];
      const mapping = {};
      qwertyKeys.forEach((key, idx) => {
        mapping[key] = scaleNotes[idx];
      });
      setKeyMapping(mapping);

      // Log the notes and their corresponding keys
      console.log('Selected Scale:', selectedScale);
      console.log('Key Mapping:', mapping);
    }
  }, [selectedScale]);

  return (
    <ScaleContext.Provider value={{ selectedScale, setSelectedScale, keyMapping }}>
      {children}
    </ScaleContext.Provider>
  );
};

<div
  className="modal-container"
  aria-hidden={!isModalOpen} // Ensure aria-hidden is false when the modal is active
  inert={!isModalOpen ? '' : undefined} // Use inert when the modal is inactive
>
  {/* Modal content */}
</div>