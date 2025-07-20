const defaultSamples = [
  "How often should I water my plant?",
  "What fertilizer should I use for succulents?",
  "Why are my orchid’s leaves turning yellow?",
];

export default function generateSampleQuestions(plant) {
  if (!plant) return defaultSamples;

  const questions = [`How often should I water my ${plant.name}?`];

  if (plant.nextFertilize) {
    questions.push(`When should I fertilize my ${plant.name} next?`);
  } else {
    questions.push(`What fertilizer should I use for ${plant.name}?`);
  }

  if (plant.light) {
    questions.push(
      `Does ${plant.name} need ${plant.light.toLowerCase()} light?`,
    );
  }

  if (plant.humidity) {
    questions.push(
      `How do I maintain ${plant.humidity.toLowerCase()} humidity for my ${plant.name}?`,
    );
  }

  if (plant.room) {
    questions.push(
      `Is my ${plant.name} happy in the ${plant.room.toLowerCase()}?`,
    );
  }

  questions.push(`Why are my ${plant.name}'s leaves turning yellow?`);

  const unique = [...new Set(questions.filter(Boolean))];
  return unique.slice(0, 3);
}
