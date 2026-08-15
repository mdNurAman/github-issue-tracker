const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');


loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (username === 'admin' && password === 'admin123') {
        window.location.href = 'home.html';
    }
    else {
        alert('Invalid username or password');
    }
});