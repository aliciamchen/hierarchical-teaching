import React, { useState } from "react";
import { Button } from "../components/Button";

const questions = [
  {
    question: "How should the learner distribute their chips on each bet?",
    choices: [
      "(A) They should put all of their chips on the prettiest option.",
      "(B) They should distribute the chips across all four options, putting more chips on options that are more likely to be right.",
      "(C) If an option is definitely wrong, they should bet 0 chips on that option; if an option is definitely correct, they should go “all in” and bet 100 chips on that option.",
      "A & B",
      "B & C",
    ],
    correctAnswer: "B & C",
  },
  {
    question: "Which of these statements correctly describes how your bonus is calculated?",
    choices: ["(A) My bonus will be calculated based on the bets the learner placed on 15 random trials.",
        "(B) I can increase my bonus if the learner bets more chips on the options that are more likely to be right.",
        "(C) If the learner bets on the right answer, this increases both the teacher's and the learner's bonus.",
        "(D) All of the above"],
    correctAnswer: "(D) All of the above",
  },
  {
    question: "What information can I see from my partner?",
    choices: ["If I am the teacher, I can see my partner's bets. If I am the learner, I can see my partner's hints."],
    correctAnswer: "If I am the teacher, I can see my partner's bets. If I am the learner, I can see my partner's hints.",
  },
];

// const Button = ({ handleClick, children }) => {
//   return <button onClick={handleClick}>{children}</button>;
// };

export default function Quiz({ next }) {
  const [answers, setAnswers] = useState({});

  const handleChoiceChange = (questionIndex, event) => {
    setAnswers({
      ...answers,
      [questionIndex]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const allCorrect = questions.every(
      (q, index) => answers[index] === q.correctAnswer
    );

    if (allCorrect) {
      alert("Congratulations, you answered all questions correctly!");
      next();
    } else {
      alert("Some answers are incorrect. Please try again.");
    }
  };

  const radioStyle = {
    display: "block",
    margin: "8px 0",
  };

  const inputStyle = {
    marginRight: "10px",
  };

  return (
    <div>
      <h1>Comprehension quiz</h1>
      <form>
        {questions.map((q, questionIndex) => (
          <div key={questionIndex}>
            <h2>{q.question}</h2>
            {q.choices.map((choice, index) => (
              <label key={index} style={radioStyle}>
                <input
                  type="radio"
                  style={inputStyle}
                  name={`question-${questionIndex}`}
                  value={choice}
                  checked={answers[questionIndex] === choice}
                  onChange={(e) => handleChoiceChange(questionIndex, e)}
                />
                {choice}
              </label>
            ))}
          </div>
        ))}
        <br></br>
        <Button handleClick={handleSubmit}>Submit</Button>
      </form>
    </div>
  );
}

// Example usage of App with next prop
const nextFunction = () => {
  alert("Congratulations, you answered all questions correctly!");
};

function Wrapper() {
  return <App next={nextFunction} />;
}
