import { useParams } from "react-router-dom";
import { useState } from "react";
import { usePlants } from "../PlantContext.jsx";
import usePlantCoach from "../hooks/usePlantCoach.js";
import PageContainer from "../components/PageContainer.jsx";
import generateSampleQuestions from "../utils/generateSampleQuestions.js";

export default function Coach() {
  const { id } = useParams();
  const { plants } = usePlants();
  const plant = plants.find((p) => p.id === Number(id));

  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { answer, loading, error } = usePlantCoach(
    submitted ? question : "",
    plant,
  );

  const sampleQuestions = generateSampleQuestions(plant);

  const ask = () => setSubmitted(true);

  return (
    <PageContainer size="md">
      <h1 className="text-xl font-headline mb-4">Ask the Plant Coach</h1>
      <textarea
        className="w-full border rounded p-2 mb-2 dark:bg-gray-600"
        value={question}
        onChange={(e) => {
          setQuestion(e.target.value);
          setSubmitted(false);
        }}
        placeholder="Type your plant question"
      />
      <ul className="text-sm italic text-gray-600 mb-2 space-y-1">
        {sampleQuestions.map((q) => (
          <li key={q}>“{q}”</li>
        ))}
      </ul>
      <button
        className="px-4 py-1 bg-green-600 text-white rounded"
        onClick={ask}
        disabled={!question}
      >
        Ask
      </button>
      {loading && <p>Loading...</p>}
      {answer && <p className="mt-4 whitespace-pre-wrap">{answer}</p>}
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
    </PageContainer>
  );
}
