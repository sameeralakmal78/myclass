let currentStudentName = '';

function startQuiz() {
    const studentName = document.getElementById('studentName').value.trim();
    if (!studentName) {
        alert('කරුණාකර ඔබගේ නම ඇතුලත් කරන්න');
        return;
    }
    
    currentStudentName = studentName;
    document.getElementById('name-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    document.getElementById('student-info').textContent = `සිසුවා: ${studentName}`;
    
    startQuizLogic();
}

// ප්‍රශ්නෝත්තරය අවසන් කිරීමේ function එක යාවත්කාලීන කරන්න
// finishQuiz function එක තුළ මෙම කේතය එකතු කරන්න:
function saveResults(studentName, score, totalQuestions, timeTaken) {
    fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            studentName: studentName,
            score: score,
            totalQuestions: totalQuestions,
            timeTaken: timeTaken
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Results saved successfully');
        }
    })
    .catch(error => {
        console.error('Error saving results:', error);
    });
}

function restartQuiz() {
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('name-screen').classList.remove('hidden');
    currentStudentName = '';
    document.getElementById('studentName').value = '';
}// පරිශීලක නාමය සහ රහස් පදය
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "math123";

// ප්‍රශ්න ලැයිස්තුව (රුප සහිතව)
const questions = [
    {
        question: "15 + 8 = ? අගය සොයන්න",
        image: null,
        answers: ["21", "22", "23", "24"],
        correct: 2
    },
    {
        question: "පහත් රුපයේ x හී අගය සොයන්න",
        image: "images/triangle.png",
        answers: ["1/4", "5/4", "5/8", "6/4"],
        correct: 1
    },
    {
        question: "x හි අගය සොයන්න: 2x + 3 = 7",
        image: "images/algebra.png",
        answers: ["1", "2", "3", "4"],
        correct: 1
    },
    {
        question: "සරල කරන්න: (x² + 2x + 1)",
        image: "images/Capture.PNG",
        answers: ["(x+1)²", "(x-1)²", "x(x+2)", "x²+1"],
        correct: 0
    },
    {
        question: "පහත රුපයේ දැක්වෙන ත්‍රිකෝණයේ කෝණය සොයන්න",
        image: "images/triangle.png",
        answers: ["45°", "60°", "90°", "120°"],
        correct: 1
    },
    {
        question: "12 × 7 = ?",
        image: null,
        answers: ["82", "84", "86", "88"],
        correct: 1
    },
    {
        question: "පහත රුපයේ දැක්වෙන වටයේ වර්ගඵලය සොයන්න",
        image: "images/circle.png",
        answers: ["25π", "36π", "49π", "64π"],
        correct: 2
    },
    {
        question: "45 ÷ 9 = ?",
        image: null,
        answers: ["4", "5", "6", "7"],
        correct: 1
    },
    {
        question: "පහත රුපයේ දැක්වෙන ප්‍රස්ථාරයේ බෑවුම සොයන්න",
        image: "images/graph.png",
        answers: ["2", "3", "4", "5"],
        correct: 0
    },
    {
        question: "3.5 + 2.25 = ?",
        image: null,
        answers: ["5.25", "5.50", "5.75", "6.00"],
        correct: 2
    }
];

// විචල්යයන්
let currentQuestion = 0;
let userAnswers = new Array(questions.length).fill(null);
let score = 0;
let quizStartTime;
let totalTime = 75 * 60; // 75 minutes in seconds
let questionTime = 3 * 60; // 3 minutes per question in seconds
let questionStartTime;
let totalTimerInterval;
let questionTimerInterval;

// DOM අංග
const loginScreen = document.getElementById('login-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('login-message');
const questionText = document.getElementById('question-text');
const questionNumber = document.getElementById('question-number');
const questionImage = document.getElementById('question-image');
const answerSection = document.getElementById('answer-section');
const nextBtn = document.getElementById('next-btn');
const totalTimerDisplay = document.getElementById('total-timer');
const questionTimerDisplay = document.getElementById('question-timer');
const progressDisplay = document.getElementById('progress');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const restartBtn = document.getElementById('restart-btn');

// ඇතුල් වීමේ පෝරමය
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        loginScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        startQuiz();
    } else {
        loginMessage.textContent = '❌ වලංගු නොවන පරිශීලක නාමය හෝ රහස් පදය!';
        loginMessage.style.color = '#e53e3e';
    }
});

// ප්‍රශ්නෝත්තරය ආරම්භ කිරීම
function startQuiz() {
    currentQuestion = 0;
    userAnswers = new Array(questions.length).fill(null);
    score = 0;
    quizStartTime = Date.now();
    questionStartTime = Date.now();
    showQuestion();
    startTotalTimer();
    startQuestionTimer();
}

// ප්‍රශ්නය පෙන්වීම
function showQuestion() {
    const question = questions[currentQuestion];
    
    questionNumber.textContent = `ප්‍රශ්නය ${currentQuestion + 1}/${questions.length}`;
    questionText.textContent = question.question;
    
    // රුපය පෙන්වීම හෝ සැකසීම
    displayQuestionImage(question.image);
    
    // ප්‍රගතිය යාවත්කාලීන කිරීම
    const progress = Math.round(((currentQuestion) / questions.length) * 100);
    progressDisplay.textContent = `ප්‍රගතිය: ${progress}%`;
    
    // පිළිතුරු විකල්ප සකස් කිරීම
    answerSection.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const answerOption = document.createElement('div');
        answerOption.className = 'answer-option';
        if (userAnswers[currentQuestion] === index) {
            answerOption.classList.add('selected');
        }
        answerOption.textContent = answer;
        answerOption.addEventListener('click', () => selectAnswer(index));
        answerSection.appendChild(answerOption);
    });
    
    // ඊළඟ බොත්තම සකස් කිරීම
    nextBtn.disabled = userAnswers[currentQuestion] === null;
    if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = 'අවසන් කරන්න';
    } else {
        nextBtn.textContent = 'මීළඟ ප්‍රශ්නය';
    }
    
    // ප්‍රශ්නයේ කාලය යළි ආරම්භ කිරීම
    resetQuestionTimer();
}

// රුපය පෙන්වීම
function displayQuestionImage(imagePath) {
    questionImage.innerHTML = '';
    
    if (imagePath) {
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'ප්‍රශ්න රුපය';
        img.onload = function() {
            // රුපය සාර්ථකව load වුනා
            console.log('රුපය loaded:', imagePath);
        };
        img.onerror = function() {
            // රුපය load නොවුනොත් placeholder එක පෙන්වන්න
            showImagePlaceholder();
        };
        questionImage.appendChild(img);
    } else {
        // රුපය නැත්නම් හිස්ව තබන්න
        questionImage.innerHTML = '';
    }
}

// රුපය load නොවුනොත් පෙන්වන placeholder
function showImagePlaceholder() {
    questionImage.innerHTML = '<div class="image-placeholder">රුපය පෙන්විය නොහැක<br><small>රුපය බාගත කිරීමට අසමත් විය</small></div>';
}

// පිළිතුර තේරීම
function selectAnswer(index) {
    userAnswers[currentQuestion] = index;
    
    // සියලුම පිළිතුරු විකල්ප නැවත සකස් කිරීම
    const answerOptions = document.querySelectorAll('.answer-option');
    answerOptions.forEach((option, i) => {
        if (i === index) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    nextBtn.disabled = false;
}

// මුළු කාලය ගණනය කිරීම
function startTotalTimer() {
    clearInterval(totalTimerInterval);
    totalTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - quizStartTime) / 1000);
        const remaining = totalTime - elapsed;
        
        if (remaining <= 0) {
            clearInterval(totalTimerInterval);
            totalTimerDisplay.textContent = 'මුළු කාලය අවසන්!';
            finishQuiz();
        } else {
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            totalTimerDisplay.textContent = `මුළු කාලය: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// ප්‍රශ්නයේ කාලය ගණනය කිරීම
function startQuestionTimer() {
    clearInterval(questionTimerInterval);
    questionTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
        const remaining = questionTime - elapsed;
        
        if (remaining <= 0) {
            // ප්‍රශ්නයේ කාලය අවසන් - ස්වයංක්‍රීයව ඊළඟ ප්‍රශ්නයට
            autoNextQuestion();
        } else {
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            questionTimerDisplay.textContent = `ප්‍රශ්නය: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // කාලය අඩු වන විට වර්ණය වෙනස් කිරීම
            updateQuestionTimerStyle(remaining);
        }
    }, 1000);
}

// ප්‍රශ්නයේ කාලයේ වර්ණය යාවත්කාලීන කිරීම
function updateQuestionTimerStyle(remaining) {
    questionTimerDisplay.classList.remove('warning', 'critical');
    
    if (remaining <= 30) { // 30 තත්පර යට
        questionTimerDisplay.classList.add('critical');
    } else if (remaining <= 60) { // 1 විනාඩිය යට
        questionTimerDisplay.classList.add('warning');
    }
}

// ප්‍රශ්නයේ කාලය යළි ආරම්භ කිරීම
function resetQuestionTimer() {
    questionStartTime = Date.now();
    questionTimerDisplay.classList.remove('warning', 'critical');
    questionTimerDisplay.textContent = 'ප්‍රශ්නය: 03:00';
}

// ස්වයංක්‍රීයව ඊළඟ ප්‍රශ්නයට යාම
function autoNextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        finishQuiz();
    }
}

// ඊළඟ ප්‍රශ්නය
nextBtn.addEventListener('click', function() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        finishQuiz();
    }
});

// ප්‍රශ්නෝත්තරය අවසන් කිරීම
function finishQuiz() {
    // ටයිමර් නතර කිරීම
    clearInterval(totalTimerInterval);
    clearInterval(questionTimerInterval);
    
    // ලකුණු ගණනය කිරීම
    score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].correct) {
            score++;
        }
    });
    
    // කාලය ගණනය කිරීම
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    
    // ප්‍රතිඵල පෙන්වීම
    scoreDisplay.textContent = score;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
}

// නැවත ආරම්භ කිරීම
restartBtn.addEventListener('click', function() {
    // ටයිමර් නතර කිරීම
    clearInterval(totalTimerInterval);
    clearInterval(questionTimerInterval);
    
    resultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    startQuiz();
});

// පිටුව load වන විට input fields focus කිරීම
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('username').focus();
});

// Browser refresh වලින් ආරක්ෂා වීම
window.addEventListener('beforeunload', function (e) {
    if (quizScreen && !quizScreen.classList.contains('hidden')) {
        e.preventDefault();
        e.returnValue = 'ඔබ ප්‍රශ්නෝත්තරයෙන් පිටවෙමින් පවතී. ඔබගේ ප්‍රගතිය අහිමි වනු ඇත!';
    }
});