// utils/promptUtils.js

export const copyPrompt = async (prompt) => {
  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt");
    }

    await navigator.clipboard.writeText(prompt);

    return { success: true, message: `Prompt copied: "${prompt}"` };
  } catch (error) {
    console.error("Failed to copy prompt:", error);
    return { success: false, message: error.message };
  }
};
