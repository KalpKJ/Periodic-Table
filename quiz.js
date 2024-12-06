// Quiz Questions Bank
const quizQuestions = [
    {
        question: "What is the atomic number of Carbon?",
        options: ["4", "6", "8", "12"],
        correctAnswer: "6"
    },
    {
        question: "Which element is a noble gas?",
        options: ["Sodium", "Helium", "Iron", "Chlorine"],
        correctAnswer: "Helium"
    },
    {
        question: "What is the symbol for Gold?",
        options: ["Ag", "Fe", "Au", "Cu"],
        correctAnswer: "Au"
    },
    {
        question: "Which element is the most electronegative?",
        options: ["Oxygen", "Fluorine", "Chlorine", "Nitrogen"],
        correctAnswer: "Fluorine"
    },
    {
        question: "What is the lightest element?",
        options: ["Helium", "Hydrogen", "Neon", "Lithium"],
        correctAnswer: "Hydrogen"
    },
    {
        question: "Which group are alkali metals in?",
        options: ["Group 1", "Group 2", "Group 17", "Group 18"],
        correctAnswer: "Group 1"
    },
    {
        question: "What is the atomic mass of Sodium?",
        options: ["20", "22.99", "23.99", "19"],
        correctAnswer: "22.99"
    },
    {
        question: "Which element is a metalloid?",
        options: ["Silicon", "Aluminum", "Calcium", "Sulfur"],
        correctAnswer: "Silicon"
    }
];

let currentQuestionIndex = 0;
let score = 0;

// DOM Elements
const startQuizBtn = document.getElementById('start-quiz-btn');
const quizStart = document.getElementById('quiz-start');
const quizQuestionContainer = document.getElementById('quiz-questions');
const currentQuestionElement = document.getElementById('current-question');
const answerOptionsElement = document.getElementById('answer-options');
const nextQuestionBtn = document.getElementById('next-question');
const quizResultsContainer = document.getElementById('quiz-results');
const scoreDisplay = document.getElementById('score-display');
const restartQuizBtn = document.getElementById('restart-quiz');

// Shuffle array function
function shuffleArray(array) {
    for (let i = 0; i < array.length; i++) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Start Quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    quizStart.style.display = 'none';
    quizQuestionContainer.style.display = 'block';
    loadQuestion();
}
const quizQuestions2 = shuffleArray(quizQuestions);

// Load Question
function loadQuestion() {

    const question = quizQuestions2[currentQuestionIndex];
    
    // Reset previous state
    answerOptionsElement.innerHTML = '';
    
    // Display question
    currentQuestionElement.innerHTML = `<h3>${question.question}</h3>`;
    
    // Shuffle options
    const shuffledOptions = shuffleArray([...question.options]);
    
    // Create option buttons
    shuffledOptions.forEach(option => {
        const optionBtn = document.createElement('button');
        optionBtn.textContent = option;
        optionBtn.classList.add('quiz-option-btn');
        optionBtn.addEventListener('click', () => selectAnswer(option));
        answerOptionsElement.appendChild(optionBtn);
    });
}

// Select Answer
function selectAnswer(selectedOption) {
    const currentQuestion = quizQuestions2[currentQuestionIndex];
    
    // Remove previous selections
    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
    });
    
    // Highlight correct/incorrect answers
    const buttons = document.querySelectorAll('.quiz-option-btn');
    buttons.forEach(btn => {
        if (btn.textContent === currentQuestion.correctAnswer) {
            btn.classList.add('correct');
        }
        if (btn.textContent === selectedOption && selectedOption !== currentQuestion.correctAnswer) {
            btn.classList.add('incorrect');
        }
        
        // Disable buttons after selection
        btn.disabled = true;
    });
    
    // Update score
    if (selectedOption === currentQuestion.correctAnswer) {
        score++;
    }
}

// Next Question
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

// End Quiz
function endQuiz() {
    quizQuestionContainer.style.display = 'none';
    quizResultsContainer.style.display = 'block';
    
    // Calculate and display score
    const percentage = Math.round((score / quizQuestions.length) * 100);
    scoreDisplay.textContent = `You scored ${score} out of ${quizQuestions.length} (${percentage}%)`;
}

// Restart Quiz
function restartQuiz() {
    quizResultsContainer.style.display = 'none';
    quizStart.style.display = 'block';
}

// Event Listeners
startQuizBtn.addEventListener('click', startQuiz);
nextQuestionBtn.addEventListener('click', nextQuestion);
restartQuizBtn.addEventListener('click', restartQuiz);