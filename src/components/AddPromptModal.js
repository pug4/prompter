import React, { useState } from 'react';

function AddPromptModal({ isOpen, onClose, onSave }) {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [sections, setSections] = useState([]);

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        key: '',
        label: '',
        placeholder: '',
        example: '',
        size: 'small',
      },
    ]);
  };

  const handleSectionChange = (index, field, value) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSave = () => {
    const newPrompt = {
      id: `${Date.now()}`, // Generate a unique ID
      text,
      description,
      prompt: promptTemplate,
      sections: sections.map((section) => ({
        ...section,
        input: '', // Initialize inputs as empty
      })),
    };

    onSave(newPrompt);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-3/4 max-w-lg p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800">Add New Prompt</h2>
        <form className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prompt Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter prompt title"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter prompt description"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prompt Template</label>
            <textarea
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              placeholder="Enter prompt template (use [key] for placeholders)"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Sections</h3>
            {sections.map((section, index) => (
              <div key={index} className="mt-4 space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Key</label>
                  <input
                    type="text"
                    value={section.key}
                    onChange={(e) => handleSectionChange(index, 'key', e.target.value)}
                    placeholder="Enter unique key"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Label</label>
                  <input
                    type="text"
                    value={section.label}
                    onChange={(e) => handleSectionChange(index, 'label', e.target.value)}
                    placeholder="Enter label"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Placeholder</label>
                  <input
                    type="text"
                    value={section.placeholder}
                    onChange={(e) => handleSectionChange(index, 'placeholder', e.target.value)}
                    placeholder="Enter placeholder text"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Example</label>
                  <input
                    type="text"
                    value={section.example}
                    onChange={(e) => handleSectionChange(index, 'example', e.target.value)}
                    placeholder="Enter example text"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Size</label>
                  <select
                    value={section.size}
                    onChange={(e) => handleSectionChange(index, 'size', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="small">Small</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addSection}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Add Section
            </button>
          </div>
        </form>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPromptModal;
