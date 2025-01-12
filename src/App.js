import React, { useState } from 'react';
import Section from './components/Section';
import Modal from './components/Modal';
import logo from './image.png';

function App() {
  const [prompts, setPrompts] = useState({
    teamPrompts: [
      {
        id: "1",
        text: "Prompts for Documentation",
        description: "Detailed information about documentation.",
        prompt: "Create documentation titled [title] with the following details: [details].",
        sections: [
          {
            key: "title",
            label: "Documentation Title",
            placeholder: "Enter the title of the documentation",
            example: "API Integration Guide",
            input: "",
            size: "small",
          },
          {
            key: "details",
            label: "Documentation Body",
            placeholder: "Enter the main content",
            example: "This guide explains how to integrate the payment API...",
            input: "",
            size: "large",
          },
        ],
      },
      {
        id: "2",
        text: "Debugging Guide for problems with our stack",
        description: "Steps and tips for team debugging.",
        prompt: "To debug, describe the bug: [bug_description], steps to reproduce: [reproduction_steps], and proposed solution: [solution].",
        sections: [
          {
            key: "bug_description",
            label: "Bug Description",
            placeholder: "Describe the bug",
            example: "The application crashes when uploading a file.",
            input: "",
            size: "small",
          },
          {
            key: "reproduction_steps",
            label: "Steps to Reproduce",
            placeholder: "List steps to reproduce the bug",
            example: "1. Open the application\n2. Upload a file\n3. Observe crash",
            input: "",
            size: "large",
          },
          {
            key: "solution",
            label: "Proposed Solution",
            placeholder: "Suggest a fix or workaround",
            example: "Check file upload handler for null references.",
            input: "",
            size: "small",
          },
        ],
      },
    ],
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

  // Handle input changes for modal sections
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

    // Update modal content to reflect changes immediately
    setModalContent((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.key === sectionKey ? { ...section, input: value } : section
      ),
    }));
  };

  // Open the modal with the selected prompt data
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
      prompt: promptTemplate, // Use the correct prompt template
      sections: sections || [], // Default to an empty array if undefined
    });
  };

  // Close the modal
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
                selectedPrompt.prompt, // Pass the correct prompt
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
