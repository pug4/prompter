import React from 'react';
import PromptCard from './PromptCard';
import AddPromptCard from './AddPromptCard';

function Section({ title, prompts, route, onCopy, onAdd }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            id={prompt.id}
            text={prompt.text}
            description={prompt.description}
            route={route}
            onCopy={onCopy}
          />
        ))}
        <AddPromptCard onAdd={onAdd} />
      </div>
    </section>
  );
}

export default Section;
