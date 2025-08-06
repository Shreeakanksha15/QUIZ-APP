import React, { useState, useRef, useEffect } from 'react';
import './Quiz.css';
import { data } from '../../Assets/data';

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // ✅ Timer state

  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);

  const option_array = [Option1, Option2, Option3, Option4];
  const question = data[index];

  // ✅ TIMER LOGIC
  useEffect(() => {
    if (lock || result) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          clearInterval(timer);
          setLock(true);
          option_array[question.ans - 1].current.classList.add("correct");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); 
  }, [index, lock, result]);

  const checkAns = (e, ans) => {
    if (!lock) {
      if (question.ans === ans) {
        e.target.classList.add("correct");
        setLock(true);
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add("wrong");
        setLock(true);
        option_array[question.ans - 1].current.classList.add("correct");
      }
    }
  };

  const next = () => {
    if (lock) {
      if (index === data.length - 1) {
        setResult(true);
        return;
      }
      setIndex(prev => prev + 1);
      setLock(false);
      setTimeLeft(15); // ✅ Reset timer
      option_array.forEach(option => {
        option.current.classList.remove("wrong");
        option.current.classList.remove("correct");
      });
    }
  };

  const reset = () => {
    setIndex(0);
    setLock(false);
    setResult(false);
    setScore(0);
    setTimeLeft(15); // ✅ Reset timer
  };

  return (
    <div className="container">
      <h1>Quiz App</h1>
      <hr />
      {!result ? (
        <>
          <h2>{index + 1}. {question.question}</h2>
          <div className="timer">⏱️ Time Left: {timeLeft}s</div> {/* ✅ Timer Display */}
          <ul>
            <li ref={Option1} onClick={(e) => !lock && checkAns(e, 1)}>{question.option1}</li>
            <li ref={Option2} onClick={(e) => !lock && checkAns(e, 2)}>{question.option2}</li>
            <li ref={Option3} onClick={(e) => !lock && checkAns(e, 3)}>{question.option3}</li>
            <li ref={Option4} onClick={(e) => !lock && checkAns(e, 4)}>{question.option4}</li>
          </ul>
          <button onClick={next}>Next</button>
          <div className="index">{index + 1} of {data.length} questions</div>
        </>
      ) : (
        <>
          <h2>You Scored {score} out of {data.length}</h2>
          <button onClick={reset}>Reset</button>
        </>
      )}
    </div>
  );
};

export default Quiz;
