import React, { useEffect, useReducer } from "react";
import questions from "./Data/questions.json";

const defaultState = {
  questions: questions,
  currentQuestion: 0,
  timeLeft: 600,
  status: "not-started",
  userAnswers: {},
  lastSavedAt: null
};

// Load saved assessment from localStorage
const getInitialState = () => {
  const savedState = localStorage.getItem("assessmentState");

  if (!savedState) {
    return defaultState;
  }

  try {
    const parsedState = JSON.parse(savedState);

    // If assessment was in progress, calculate time passed
    if (
      parsedState.status === "in-progress" &&
      parsedState.lastSavedAt
    ) {
      const timePassed = Math.floor(
        (Date.now() - parsedState.lastSavedAt) / 1000
      );

      const newTimeLeft = Math.max(
        0,
        parsedState.timeLeft - timePassed
      );

      // Time has expired
      if (newTimeLeft === 0) {
        return {
          ...defaultState,
          ...parsedState,
          questions: questions,
          timeLeft: 0,
          status: "submitted",
          lastSavedAt: null
        };
      }

      return {
        ...defaultState,
        ...parsedState,
        questions: questions,
        timeLeft: newTimeLeft,
        lastSavedAt: Date.now()
      };
    }

    return {
      ...defaultState,
      ...parsedState,
      questions: questions
    };
  } catch (error) {
    console.error("Failed to load saved assessment:", error);

    return defaultState;
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "START":
      return {
        ...state,
        status: "in-progress",
        lastSavedAt: Date.now()
      };

    case "SELECT_ANSWER":
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [state.currentQuestion]: action.payload
        },
        lastSavedAt: Date.now()
      };

    case "NEXT":
      return {
        ...state,
        currentQuestion: Math.min(
          state.currentQuestion + 1,
          state.questions.length - 1
        ),
        lastSavedAt: Date.now()
      };

    case "PREVIOUS":
      return {
        ...state,
        currentQuestion: Math.max(
          state.currentQuestion - 1,
          0
        ),
        lastSavedAt: Date.now()
      };

    case "SUBMIT":
      return {
        ...state,
        status: "submitted",
        lastSavedAt: null
      };

    case "TICK":
      if (state.timeLeft <= 1) {
        return {
          ...state,
          timeLeft: 0,
          status: "submitted",
          lastSavedAt: null
        };
      }

      return {
        ...state,
        timeLeft: state.timeLeft - 1,
        lastSavedAt: Date.now()
      };

    case "RESET":
      localStorage.removeItem("assessmentState");

      return defaultState;

    default:
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    getInitialState
  );

  // Save state to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(
      "assessmentState",
      JSON.stringify(state)
    );
  }, [state]);

  // Countdown timer
  useEffect(() => {
    if (state.status !== "in-progress") {
      return;
    }

    const timer = setInterval(() => {
      dispatch({
        type: "TICK"
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [state.status]);

  const currentQuestion =
    state.questions[state.currentQuestion];

  // Calculate score
  const score = state.questions.reduce(
    (total, question, index) => {
      if (
        state.userAnswers[index] ===
        question.correctAnswer
      ) {
        return total + 1;
      }

      return total;
    },
    0
  );

  const percentage = Math.round(
    (score / state.questions.length) * 100
  );

  const resetAssessment = () => {
    dispatch({
      type: "RESET"
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">

        {/* Header */}
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Assessment
        </h1>

        <p className="mt-4 text-gray-600">
          {state.questions.length} Questions
        </p>

        <p className="mb-6 mt-4 text-gray-600">
          Time Limit: 10 Minutes
        </p>

        {/* NOT STARTED */}
        {state.status === "not-started" && (
          <button
            onClick={() =>
              dispatch({
                type: "START"
              })
            }
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Start Assessment
          </button>
        )}

        {/* IN PROGRESS */}
        {state.status === "in-progress" && (
          <>
            {/* Progress */}
            <div className="mb-6">
              <p>
                Question{" "}
                {state.currentQuestion + 1} of{" "}
                {state.questions.length}
              </p>

              <p className="mt-2 font-medium">
                Time left:{" "}
                {Math.floor(
                  state.timeLeft / 60
                )}
                :
                {String(
                  state.timeLeft % 60
                ).padStart(2, "0")}
              </p>
            </div>

            {/* Question */}
            <div>
              <h2 className="mb-5 text-xl font-semibold text-gray-900">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              {currentQuestion.options.map(
                (option) => (
                  <button
                    key={option}
                    onClick={() =>
                      dispatch({
                        type: "SELECT_ANSWER",
                        payload: option
                      })
                    }
                    className={`mb-3 block w-full rounded-lg border p-4 text-left transition ${
                      state.userAnswers[
                        state.currentQuestion
                      ] === option
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                )
              )}
            </div>

            {/* Navigation */}
            <div className="mt-6 flex justify-between gap-3">

              <button
                onClick={() =>
                  dispatch({
                    type: "PREVIOUS"
                  })
                }
                disabled={
                  state.currentQuestion === 0
                }
                className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                onClick={() =>
                  dispatch({
                    type: "NEXT"
                  })
                }
                disabled={
                  state.currentQuestion ===
                  state.questions.length - 1
                }
                className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>

            {/* Submit */}
            <button
              onClick={() =>
                dispatch({
                  type: "SUBMIT"
                })
              }
              className="mt-6 rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
            >
              Submit
            </button>
          </>
        )}

        {/* SUBMITTED */}
        {state.status === "submitted" && (
          <div className="mt-6">

            <h2 className="text-2xl font-bold text-gray-900">
              Assessment Completed
            </h2>

            <p className="mt-3 text-gray-600">
              Score: {score} /{" "}
              {state.questions.length}
            </p>

            <p className="mt-3 text-gray-600">
              Percentage: {percentage}%
            </p>

            <button
              onClick={resetAssessment}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              Restart Assessment
            </button>

          </div>
        )}

        {/* Status */}
        <p className="mt-6 text-gray-600">
          Status: {state.status}
        </p>

      </div>
    </div>
  );
};

export default App;
