import React, { useState } from "react";
import axios from "axios";

function QuestionForm({ onQuestionAdded }) {
  const initialFormData = {
    prompt: "",
    answers: ["", "", "", ""],
    correctIndex: 0,
  };

  const [formData, setFormData] = useState(initialFormData);

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "correctIndex") {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10),
      });
    } else if (name.startsWith("answer")) {
      const index = parseInt(name.charAt(name.length - 1), 10);
      const newAnswers = [...formData.answers];
      newAnswers[index] = value;
      setFormData({
        ...formData,
        answers: newAnswers,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      // Send the new question data to the API
      const response = await axios.post("http://localhost:4000/questions", {
        prompt: formData.prompt,
        answers: formData.answers,
        correctIndex: formData.correctIndex,
      });

      // Clear the form and update the parent component with the new question
      setFormData(initialFormData);
      onQuestionAdded(response.data);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  }

  return (
    <section>
      <h1>New Question</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
          />
        </label>
        {formData.answers.map((answer, index) => (
          <label key={index}>
            Answer {index + 1}:
            <input
              type="text"
              name={`answer${index}`}
              value={answer}
              onChange={handleChange}
            />
          </label>
        ))}
        <label>
          Correct Answer:
          <select
            name="correctIndex"
            value={formData.correctIndex}
            onChange={handleChange}
          >
            {formData.answers.map((answer, index) => (
              <option key={index} value={index}>
                {answer}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Add Question</button>
      </form>
    </section>
  );
}

export default QuestionForm;
