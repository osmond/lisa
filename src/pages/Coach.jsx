import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

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
  const [history, setHistory] = useState([]);

  const { answer, loading, error } = usePlantCoach(
    submitted ? question : "",
    plant,
  );

  useEffect(() => {
    if (submitted && answer) {
      setHistory((h) => [...h, { q: question, a: answer }]);
      setSubmitted(false);
    }
  }, [answer, submitted, question]);

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
      <div className="flex flex-col gap-2 mb-2">
        {sampleQuestions.map((q) => (
          <button
            key={q}
            type="button"
            className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded-full whitespace-nowrap"
            onClick={() => {
              setQuestion(q);
              setSubmitted(false);
            }}
          >
            {q}
          </button>
        ))}
      </div>
      <button
        className="px-4 py-1 bg-green-600 text-white rounded"
        onClick={ask}
        disabled={!question}
      >
        Ask
      </button>
      {loading && <p>Loading...</p>}
      {history.map(({ q, a }, i) => (
        <div key={i} className="mt-2">
          <div className="chat-bubble user mb-1">{q}</div>
          <div className="chat-bubble bot whitespace-pre-wrap">{a}</div>
        </div>
      ))}
      {answer && (
        <div className="mt-2 chat-bubble bot whitespace-pre-wrap">{answer}</div>
      )}
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
    </PageContainer>
  );
}
