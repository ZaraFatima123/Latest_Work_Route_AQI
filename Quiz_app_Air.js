const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");
const scoreElement = document.querySelector("#score");
const playBtn = document.querySelector("#play-btn");
const quizContainer = document.querySelector("#quiz-container");
const startScreen = document.querySelector("#start-screen");

let questions = [];
let currentQuestion = 0;
let correctAnswers = 0;

// Fetch questions from a local JSON file
const fetchQuestions = async () => {
    try {
        const response = await fetch("AirpollutionQuest.json"); // Adjusted path for local file
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched data:", data); // Debugging to check the data structure

        questions = data.results.map((item) => {
            // Ensure properties exist and are valid
            const incorrectAnswers = Array.isArray(item.options) ? item.options.filter(opt => opt !== item.correct_answer) : [];
            const correctAnswer = item.correct_answer || "No correct answer provided";

            return {
                question: item.question || "No question text available",
                choices: [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5),
                answer: correctAnswer,
                info: item.info || "No additional info available."
            };
        });

        resetGame();
    } catch (error) {
        console.error("Failed to fetch questions:", error);
        alert("Could not load questions. Please try again later.");
    }
};



const resetGame = () => {
    currentQuestion = 0;
    correctAnswers = 0;
    updateScore();
    displayQuestion();
    msgContainer.classList.add("hide");
    quizContainer.classList.add("hide");
    startScreen.classList.remove("hide");
};

const displayQuestion = () => {
    if (questions.length === 0) {
        alert("No questions available!");
        return;
    }

    const currentQuestionObj = questions[currentQuestion];
    const questionElement = document.querySelector("#question");
    const choicesElement = document.querySelector("#choices");

    // Set the question text
    questionElement.innerHTML = currentQuestionObj.question;
    choicesElement.innerHTML = ""; // Clear previous options

    // Generate a button for each choice
    currentQuestionObj.choices.forEach(choice => {
        const choiceBtn = document.createElement("button");
        choiceBtn.textContent = choice;
        choiceBtn.classList.add("choice-btn"); // Optional: Add a class for styling
        choiceBtn.onclick = () => checkAnswer(choice);
        choicesElement.appendChild(choiceBtn);
    });

    quizContainer.classList.remove("hide");
    startScreen.classList.add("hide");
};

const updateScore = () => {
    scoreElement.textContent = `Score: ${correctAnswers}/${questions.length}`;
};


const checkAnswer = (selectedAnswer) => {
    const currentQuestionObj = questions[currentQuestion];
    if (!currentQuestionObj) {
        alert("Question data is not available!");
        resetGame();
        return;
    }

    const feedbackMsg = document.createElement("div");
    feedbackMsg.classList.add("feedback-msg");

    if (selectedAnswer === currentQuestionObj.answer) {
        correctAnswers++;
        msg.textContent = "Correct!";
        feedbackMsg.textContent = currentQuestionObj.info;
        showConfetti();
    } else {
        msg.textContent = "Incorrect!";
        feedbackMsg.textContent = `The correct answer is: ${currentQuestionObj.answer}. ${currentQuestionObj.info}`;
    }

    msgContainer.classList.remove("hide");
    msgContainer.appendChild(feedbackMsg);
    updateScore();

    currentQuestion++;

    if (currentQuestion < questions.length) {
        setTimeout(() => {
            msgContainer.classList.add("hide");
            feedbackMsg.remove();
            displayQuestion();
        }, 2000);
    } else {
        setTimeout(() => {
            alert(`Game Over! You scored ${correctAnswers}/${questions.length}`);
            resetGame();
        }, 2000);
    }
};

playBtn.addEventListener("click", fetchQuestions);
resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);

const showConfetti = () => {
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
    });
};

