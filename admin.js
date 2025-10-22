// Admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "math123";

document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        loadResults();
    } else {
        document.getElementById('admin-message').textContent = 'වලංගු නොවන අක්තපත්‍ර';
        document.getElementById('admin-message').style.color = 'red';
    }
});

function loadResults() {
    document.getElementById('results-body').innerHTML = '<tr><td colspan="5" style="text-align: center;">ලබාගනු...</td></tr>';
    
    setTimeout(() => {
        displayAdminResults();
    }, 500);
}

function displayAdminResults() {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    const tbody = document.getElementById('results-body');
    
    if (results.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">දත්ත නැත</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.studentName}</td>
            <td>${result.score}/${result.totalQuestions}</td>
            <td>${result.totalQuestions}</td>
            <td>${result.timeTaken}</td>
            <td>${result.date}</td>
        `;
        tbody.appendChild(row);
    });
}

function clearAllResults() {
    if (confirm('ඔබට සියලු ලකුණු මැකීමට අවශ්‍යද?')) {
        localStorage.removeItem('quizResults');
        loadResults();
        alert('සියලු ලකුණු මකා දමන ලදී');
    }
}

function logout() {
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('admin-login').classList.remove('hidden');
    document.getElementById('adminUsername').value = 'admin';
    document.getElementById('adminPassword').value = 'math123';
    document.getElementById('admin-message').textContent = '';
}
