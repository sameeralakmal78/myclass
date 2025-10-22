document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    fetch('/api/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('admin-login').classList.add('hidden');
            document.getElementById('admin-dashboard').classList.remove('hidden');
            loadResults();
        } else {
            document.getElementById('admin-message').textContent = data.message;
            document.getElementById('admin-message').style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('admin-message').textContent = 'Login failed';
        document.getElementById('admin-message').style.color = 'red';
    });
});

function loadResults() {
    document.getElementById('results-body').innerHTML = '<tr><td colspan="5" style="text-align: center;">ලබාගනු...</td></tr>';
    
    fetch('/api/admin/results')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayResults(data.results);
        } else {
            document.getElementById('results-body').innerHTML = '<tr><td colspan="5" style="text-align: center;">දත්ත ලබාගැනීමට අසමත් විය</td></tr>';
        }
    })
    .catch(error => {
        console.error('Error loading results:', error);
        document.getElementById('results-body').innerHTML = '<tr><td colspan="5" style="text-align: center;">දත්ත ලබාගැනීමට අසමත් විය</td></tr>';
    });
}

function displayResults(results) {
    const tbody = document.getElementById('results-body');
    tbody.innerHTML = '';
    
    if (results.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">දත්ත නැත</td></tr>';
        return;
    }
    
    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.student_name}</td>
            <td>${result.score}/${result.total_questions}</td>
            <td>${result.total_questions}</td>
            <td>${result.time_taken}</td>
            <td>${new Date(result.submitted_at).toLocaleString('si-LK')}</td>
        `;
        tbody.appendChild(row);
    });
}

function logout() {
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('admin-login').classList.remove('hidden');
    document.getElementById('adminUsername').value = 'admin';
    document.getElementById('adminPassword').value = 'math123';
    document.getElementById('admin-message').textContent = '';
}