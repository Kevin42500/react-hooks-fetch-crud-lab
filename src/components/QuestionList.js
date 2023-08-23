import React from 'react';
import axios from 'axios';

function QuestionList({ questions, onDelete, onUpdateCorrectAnswer }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/questions/${id}`);
      onDelete(id);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleUpdateCorrectAnswer = async (id, correctIndex) => {
    try {
      await axios.patch(
        `http://localhost:4000/questions/${id}`,
        { correctIndex },
        { headers: { 'Content-Type': 'application/json' } }
      );
      onUpdateCorrectAnswer(id, correctIndex);
    } catch (error) {
      console.error('Error updating correct answer:', error);
    }
  };

  return (
    <ul>
      {questions.map((question) => (
        <li key={question.id}>
          {question.prompt}
          <select
            value={question.correctIndex}
            onChange={(e) => handleUpdateCorrectAnswer(question.id, e.target.value)}
          >
            {question.answers.map((answer, index) => (
              <option key={index} value={index}>
                {answer}
              </option>
            ))}
          </select>
          <button onClick={() => handleDelete(question.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default QuestionList;
