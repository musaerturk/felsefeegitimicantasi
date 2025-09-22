import React, { useState, useEffect } from 'react';

// Assuming these types are defined elsewhere in your project
interface Option {
  value: string;
  label: string;
}

interface MultiSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  title: string;
}

const MultiSelectModal: React.FC<MultiSelectModalProps> = ({
  isOpen,
  onClose,
  options,
  selectedValues,
  onChange,
  title,
}) => {
  const [currentSelection, setCurrentSelection] = useState<string[]>(selectedValues);

  useEffect(() => {
    setCurrentSelection(selectedValues);
  }, [selectedValues, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleToggle = (value: string) => {
    setCurrentSelection((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleConfirm = () => {
    onChange(currentSelection);
    onClose();
  };
  
  const handleCancel = () => {
    onClose();
  };

  // The error was likely on the line below.
  // A common mistake is a missing comma between properties in an object,
  // for example: { propA: 'valueA' propB: 'valueB' }
  // I am assuming a hypothetical object creation here for demonstration,
  // as I don't have your original code.
  // The FIX is ensuring correct object syntax. For example, adding a comma.
  const modalStyles = { zIndex: 1000, position: 'fixed', top: 0, left: 0 };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={modalStyles}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={currentSelection.includes(option.value)}
                onChange={() => handleToggle(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiSelectModal;