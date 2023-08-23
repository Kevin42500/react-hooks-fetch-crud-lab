import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";
import axios from "axios";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get("http://localhost:4000/questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    fetchQuestions();
  }, []);

  const handleQuestionAdded = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
    setPage("List");
  };

  const handleQuestionDeleted = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/questions/${id}`);
      setQuestions(questions.filter((question) => question.id !== id));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleCorrectAnswerUpdated = async (id, correctIndex) => {
    try {
      await axios.patch(
        `http://localhost:4000/questions/${id}`,
        { correctIndex },
        { headers: { "Content-Type": "application/json" } }
      );

      // Update the questions array with the new correctIndex
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === id ? { ...question, correctIndex } : question
        )
      );
    } catch (error) {
      console.error("Error updating correct answer:", error);
    }
  };

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onQuestionAdded={handleQuestionAdded} />
      ) : (
        <QuestionList
          questions={questions}
          onQuestionDeleted={handleQuestionDeleted}
          onCorrectAnswerUpdated={handleCorrectAnswerUpdated}
        />
      )}
    </main>
  );
}

export default App;
