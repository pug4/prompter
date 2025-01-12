import React from 'react';

function Modal({ isOpen, onClose, title, description, sections, onInputChange, onCopy }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-3/4 max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="mt-4 text-gray-600">{description}</p>

        <form className="mt-6 space-y-4">
          {sections.map((section) => (
            <div key={section.key}>
              <label className="block text-sm font-medium text-gray-700">
                {section.label}
              </label>
              {section.size === "large" ? (
                <textarea
                  placeholder={section.placeholder}
                  value={section.input || ""}
                  onChange={(e) => onInputChange(section.key, e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows={5}
                />
              ) : (
                <input
                  type="text"
                  placeholder={section.placeholder}
                  value={section.input || ""}
                  onChange={(e) => onInputChange(section.key, e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              )}
              <p className="mt-1 text-xs text-gray-500">Example: {section.example}</p>
            </div>
          ))}
        </form>

        <div className="flex justify-between mt-6">
          <button
            onClick={onCopy} // Ensure this triggers handleCopyAll
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Copy Prompt
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
