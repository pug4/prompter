import React from 'react';

function PromptCard({ id, text, description, route, onCopy }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 text-blue-500 rounded-full h-10 w-10 flex items-center justify-center">
          <i className="fas fa-user"></i>
        </div>
        <span className="text-gray-800 font-medium">{text}</span>
      </div>
      <button
        onClick={() => onCopy(id, text, description, route)}
        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
      >
        Copy Prompt
      </button>
    </div>
  );
}

export default PromptCard;
