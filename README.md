# 📝 Assessment App

A simple and interactive **Quiz / Assessment Application** built with **React.js**.
Users can start an assessment, select answers, navigate between questions, track their remaining time, and submit the assessment to see their score and percentage.

## 🚀 Features

* Start the assessment
* Multiple-choice questions
* Select and highlight answers
* Previous and Next question navigation
* 10-minute countdown timer
* Automatic submission when the timer reaches zero
* Score calculation
* Percentage calculation
* Assessment completion status
* Questions stored separately in a JSON file
* Responsive UI using Tailwind CSS

## 🛠️ Technologies Used

* **React.js**
* **JavaScript**
* **React `useReducer`**
* **React `useEffect`**
* **JSON**
* **Tailwind CSS**
* **Vite**

## 📁 Project Structure

```text
assessment-app/
│
├── src/
│   ├── App.jsx
│   │
│   └── Data/
│       └── questions.json
│
├── public/
│
├── package.json
├── index.html
└── README.md
```

## 📦 Installation

Clone the project:

```bash
git clone <your-repository-url>
```

Go into the project directory:

```bash
cd assessment-app
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will then be available at the local URL shown in your terminal.

## 📚 Questions JSON Format

Questions are stored in:

```text
src/Data/questions.json
```

Each question follows this structure:

```json
[
  {
    "id": 1,
    "question": "What is the capital of India?",
    "options": [
      "Mumbai",
      "New Delhi",
      "Kolkata",
      "Chennai"
    ],
    "correctAnswer": "New Delhi"
  }
]
```

### Properties

| Property        | Description              |
| --------------- | ------------------------ |
| `id`            | Unique question ID       |
| `question`      | The question text        |
| `options`       | Available answer choices |
| `correctAnswer` | Correct answer           |

## ⚙️ How It Works

The application uses React's `useReducer` to manage the assessment state.

### Initial State

The application keeps track of:

```js
{
  questions: [],
  currentQuestion: 0,
  timeLeft: 600,
  status: "not-started",
  userAnswers: {}
}
```

### Assessment States

The application has three main states:

```text
not-started
      ↓
in-progress
      ↓
submitted
```

### Answer Selection

When a user selects an option, the selected answer is stored using the question index:

```js
userAnswers: {
  0: "New Delhi",
  1: "Mars",
  2: "HTML"
}
```

This allows the application to remember answers when the user moves between questions.

### Score Calculation

The application compares each user's selected answer with the correct answer:

```js
const score = state.questions.reduce((total, question, index) => {
  if (state.userAnswers[index] === question.correctAnswer) {
    return total + 1;
  }

  return total;
}, 0);
```

The percentage is then calculated using:

```js
const percentage = Math.round(
  (score / state.questions.length) * 100
);
```

## ⏱️ Timer

The assessment has a **10-minute time limit**, represented by:

```js
timeLeft: 600
```

The timer decreases every second using `useEffect` and `setInterval`.

When the timer reaches zero, the assessment is automatically submitted.

## 🎯 Reducer Actions

The application uses the following reducer actions:

| Action          | Purpose                        |
| --------------- | ------------------------------ |
| `START`         | Starts the assessment          |
| `SELECT_ANSWER` | Saves the selected answer      |
| `NEXT`          | Moves to the next question     |
| `PREVIOUS`      | Moves to the previous question |
| `SUBMIT`        | Submits the assessment         |
| `TICK`          | Decreases the remaining time   |

## 🖥️ User Flow

```text
Open Application
       ↓
Start Assessment
       ↓
Answer Question
       ↓
Next / Previous
       ↓
Answer All Questions
       ↓
Submit
       ↓
View Score & Percentage
```

If the timer reaches `00:00`:

```text
Timer Expires
      ↓
Automatic Submission
      ↓
View Score & Percentage
```

## 🔮 Future Improvements

Some possible improvements for the project:

* Add a question progress bar
* Add a restart assessment button
* Prevent submission until all questions are answered
* Add confirmation before submitting
* Show correct and incorrect answers after submission
* Add a results review page
* Randomize questions
* Randomize answer options
* Store results using Local Storage
* Add different assessment categories
* Add a dark mode
* Add animations and transitions
* Connect the application to a backend/API

## 👨‍💻 Author

**Piyush Thakur**

---

⭐ If you find this project useful, consider giving it a star on GitHub.
