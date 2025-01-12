import React from 'react';

function AddPromptCard({ onAdd }) {
  return (
    <div
      onClick={onAdd}
      className="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md rounded-lg p-4 flex flex-col items-center justify-center text-white cursor-pointer hover:opacity-90"
    >
      <button className="text-4xl font-bold bg-white text-blue-500 rounded-full h-16 w-16 flex items-center justify-center">
        +
      </button>
      <span className="mt-2 font-semibold">Add New Prompts</span>
    </div>
  );
}

export default AddPromptCard;
