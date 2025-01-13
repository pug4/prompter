import React, { useState, useEffect } from 'react';
import Section from './components/Section';
import Modal from './components/Modal';
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

  // Fetch teamPrompts from the backend
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teamPrompts');
        setPrompts((prev) => ({
          ...prev,
          teamPrompts: response.data,
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
    console.log("Opening modal with the following data:");
    console.log("Prompt ID:", promptId);
    console.log("Prompt Text:", promptText);
    console.log("Description:", description);
    console.log("Template:", promptTemplate);
    console.log("Sections:", sections);

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

  // Combine inputs and copy all to clipboard
  const handleCopyAll = () => {
    let combinedPrompt = modalContent.prompt;

    // Log the modal content and sections for debugging
    console.log("Modal Content:", modalContent);
    console.log("Sections to combine:", modalContent.sections);

    // Replace placeholders in the prompt template with inputs
    modalContent.sections.forEach((section) => {
      const replacement = section.input || section.placeholder;
      combinedPrompt = combinedPrompt.replace(`[${section.key}]`, replacement);
      console.log(`Replacing [${section.key}] with:`, replacement);
    });

    // Log the final combined prompt
    console.log("Final Combined Prompt:", combinedPrompt);

    // Copy the final combined prompt to the clipboard
    navigator.clipboard
      .writeText(combinedPrompt)
      .then(() => {
        alert("Prompt copied to clipboard:\n\n" + combinedPrompt);
      })
      .catch((err) => {
        console.error("Error copying prompt:", err);
      });
  };

  const handleAddNewPrompt = (section) => {
    const newPromptText = prompt("Enter a new prompt:");
    if (newPromptText) {
      const newPrompt = {
        id: `${Date.now() + Math.floor(Math.random() * 101)}`,
        text: newPromptText,
        description: "Default description for the new prompt.",
        prompt: "New prompt template [key].",
        sections: [
          {
            key: "key",
            label: "Input Field",
            placeholder: "Enter input",
            example: "Example input",
            input: "",
          },
        ],
      };

      setPrompts((prev) => ({
        ...prev,
        [section]: [...prev[section], newPrompt],
      }));
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
          <div className="flex-1 max-w-lg mx-4">
            <input
              type="text"
              placeholder="Search for a prompt"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
            />
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
            console.log("Selected prompt for modal:", selectedPrompt);

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
          onAdd={() => handleAddNewPrompt("teamPrompts")}
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
    </div>
  );
}

export default App;
