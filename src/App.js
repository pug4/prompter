import React, { useState, useEffect } from 'react';
import Section from './components/Section';
import Modal from './components/Modal';
import AddPromptModal from './components/AddPromptModal'; // Modal for adding new prompts
import logo from './image.png';
import axios from 'axios';

function App() {
  const [prompts, setPrompts] = useState({
    teamPrompts: [],
    developerPrompts: [],
    organizationPrompts: [],
    nonTechnicalTasks: [],
  });

  const [modalContent, setModalContent] = useState({
    isOpen: false,
    id: "",
    title: "",
    description: "",
    prompt: "",
    sections: [],
  });

  const [isAddPromptModalOpen, setIsAddPromptModalOpen] = useState(false);

  // Standardize prompt format
  const standardizePromptFormat = (prompt) => ({
    id: prompt.id || `${Date.now()}`,
    text: prompt.text || "",
    description: prompt.description || "",
    prompt: prompt.prompt || "",
    sections: prompt.sections?.map((section) => ({
      key: section.key || "",
      label: section.label || "",
      placeholder: section.placeholder || "",
      example: section.example || "",
      input: section.input || "",
      size: section.size || "small",
    })) || [],
  });

  // Fetch teamPrompts from the backend
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teamPrompts');
        const standardizedPrompts = response.data.map(standardizePromptFormat);
        setPrompts((prev) => ({
          ...prev,
          teamPrompts: standardizedPrompts,
        }));
      } catch (err) {
        console.error('Error fetching prompts:', err);
      }
    };

    fetchPrompts();
  }, []);

  const handleInputChange = (promptId, sectionKey, value) => {
    setPrompts((prev) => {
      const updatedPrompts = { ...prev };
      for (const key in updatedPrompts) {
        updatedPrompts[key] = updatedPrompts[key].map((prompt) => {
          if (prompt.id === promptId) {
            return {
              ...prompt,
              sections: prompt.sections.map((section) =>
                section.key === sectionKey ? { ...section, input: value } : section
              ),
            };
          }
          return prompt;
        });
      }
      return updatedPrompts;
    });

    setModalContent((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.key === sectionKey ? { ...section, input: value } : section
      ),
    }));
  };

  const handleCopyPrompt = (promptId, promptText, description, promptTemplate, sections) => {
    setModalContent({
      isOpen: true,
      id: promptId,
      title: promptText,
      description,
      prompt: promptTemplate,
      sections: sections || [],
    });
  };

  const handleCloseModal = () => {
    setModalContent({
      isOpen: false,
      id: "",
      title: "",
      description: "",
      prompt: "",
      sections: [],
    });
  };

  const handleCopyAll = () => {
    let combinedPrompt = modalContent.prompt;
    modalContent.sections.forEach((section) => {
      const replacement = section.input || section.placeholder;
      combinedPrompt = combinedPrompt.replace(`[${section.key}]`, replacement);
    });

    navigator.clipboard
      .writeText(combinedPrompt)
      .then(() => alert("Prompt copied to clipboard!"))
      .catch((err) => console.error("Error copying prompt:", err));
  };

  const handleAddNewPrompt = async (newPrompt) => {
    try {
      const standardizedPrompt = standardizePromptFormat(newPrompt);
      const response = await axios.post('http://localhost:5000/api/teamPrompts', standardizedPrompt, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Prompt added successfully:', response.data);
      setPrompts((prev) => ({
        ...prev,
        teamPrompts: [...prev.teamPrompts, response.data],
      }));
    } catch (error) {
      console.error('Error adding new prompt:', error.response || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={logo} alt="Prompter Logo" className="h-8" />
            <span className="text-xl font-bold text-gray-800">Prompter</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Section
          title="Top 3 Prompts by Team"
          prompts={prompts.teamPrompts}
          route="/popup"
          onCopy={(id, text, desc, promptTemplate) => {
            const selectedPrompt = prompts.teamPrompts.find((prompt) => prompt.id === id);

            if (selectedPrompt) {
              handleCopyPrompt(
                id,
                text,
                desc,
                selectedPrompt.prompt,
                selectedPrompt.sections
              );
            }
          }}
          onAdd={() => setIsAddPromptModalOpen(true)}
        />
      </main>

      <Modal
        isOpen={modalContent.isOpen}
        onClose={handleCloseModal}
        title={modalContent.title}
        description={modalContent.description}
        sections={modalContent.sections}
        onInputChange={(key, value) => handleInputChange(modalContent.id, key, value)}
        onCopy={handleCopyAll}
      />

      <AddPromptModal
        isOpen={isAddPromptModalOpen}
        onClose={() => setIsAddPromptModalOpen(false)}
        onSave={handleAddNewPrompt}
      />
    </div>
  );
}

export default App;
