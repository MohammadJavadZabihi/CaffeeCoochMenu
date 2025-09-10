// --------------------------
// Global variables
// --------------------------
let currentTab = 'login';
let isLoading = false;

// Sample admin users (در پروژه واقعی باید از دیتابیس استفاده شود)
const adminUsers = JSON.parse(localStorage.getItem('adminUsers')) || [
    {
        id: 1,
        fullname: 'مدیر کافه رؤیا',
        username: 'admin',
        email: 'admin@cafe-roya.com',
        password: 'admin123',
        createdAt: new Date().toISOString()
    }
];

// --------------------------
// Tab switching
// --------------------------
function showTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        if ((tabName === 'login' && tab.textContent === 'ورود') ||
            (tabName === 'register' && tab.textContent === 'ثبت نام')) {
            tab.classList.add('active');
        }
    });

    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });

    const activeForm = document.getElementById(`${tabName}-form`);
    if (activeForm) activeForm.classList.add('active');

    currentTab = tabName;
    hideMessage();
    clearForms();
}

// --------------------------
// Show/hide messages
// --------------------------
function showMessage(message, type = 'info') {
    const messageBox = document.getElementById('message-box');
    if (!messageBox) return;
    messageBox.textContent = message;
    messageBox.className = `message ${type}`;
    messageBox.style.display = 'block';
}

function hideMessage() {
    const messageBox = document.getElementById('message-box');
    if (!messageBox) return;
    messageBox.style.display = 'none';
}

// --------------------------
// Clear forms
// --------------------------
function clearForms() {
    document.querySelectorAll('form').forEach(f => f.reset());
}

// --------------------------
// Loading state
// --------------------------
function setLoadingState(state) {
    isLoading = state;
    document.querySelectorAll('button').forEach(btn => btn.disabled = state);
}

// --------------------------
// Toggle password visibility
// --------------------------
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
}

// --------------------------
// Show forgot password form
// --------------------------
function showForgotPassword() {
    hideMessage();
    const loginForm = document.getElementById('login-form');
    const forgotForm = document.getElementById('forgot-form');
    if (loginForm) loginForm.classList.remove('active');
    if (forgotForm) forgotForm.classList.add('active');
}

// --------------------------
// Validate registration
// --------------------------
function validateRegistration(fullname, username, email, password, confirmPassword, agreeTerms) {
    if (!fullname || !username || !email || !password || !confirmPassword) {
        return { valid: false, message: "همه فیلدها الزامی هستند" };
    }
    if (password !== confirmPassword) {
        return { valid: false, message: "رمز عبور و تکرار آن یکسان نیست" };
    }
    if (!agreeTerms) {
        return { valid: false, message: "باید شرایط را بپذیرید" };
    }
    return { valid: true };
}

// --------------------------
// Handle login
// --------------------------
function handleLogin(event) {
    event.preventDefault();
    if (isLoading) return;

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    if (!username || !password) {
        showMessage('لطفاً تمام فیلدها را پر کنید', 'error');
        return;
    }

    setLoadingState(true);

    // Simulate API call
    setTimeout(() => {
        const user = adminUsers.find(u =>
            (u.username === username || u.email === username) && u.password === password
        );

        if (user) {
            const sessionData = {
                id: user.id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                loginTime: new Date().toISOString(),
                rememberMe: rememberMe
            };

            if (rememberMe) {
                localStorage.setItem('adminSession', JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
            }

            showMessage(`خوش آمدید ${user.fullname}!`, 'success');

            setTimeout(() => {
                window.location.href = 'index.html?admin=true';
            }, 2000);

        } else {
            showMessage('نام کاربری یا رمز عبور اشتباه است', 'error');
        }

        setLoadingState(false);
    }, 1500);
}

// --------------------------
// Handle registration
// --------------------------
function handleRegister(event) {
    event.preventDefault();
    if (isLoading) return;

    const fullname = document.getElementById('register-fullname').value.trim();
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const agreeTerms = document.getElementById('agree-terms').checked;

    const validation = validateRegistration(fullname, username, email, password, confirmPassword, agreeTerms);
    if (!validation.valid) {
        showMessage(validation.message, 'error');
        return;
    }

    const newUser = {
        id: adminUsers.length + 1,
        fullname,
        username,
        email,
        password,
        createdAt: new Date().toISOString()
    };

    adminUsers.push(newUser);
    localStorage.setItem('adminUsers', JSON.stringify(adminUsers));

    showMessage('ثبت‌نام با موفقیت انجام شد!', 'success');
    clearForms();
    showTab('login');
}
// --------------------------
// Global variables
// --------------------------
let currentTab = 'login';
let isLoading = false;

// Sample admin users (در پروژه واقعی باید از دیتابیس استفاده شود)
const adminUsers = JSON.parse(localStorage.getItem('adminUsers')) || [
    {
        id: 1,
        fullname: 'مدیر کافه رؤیا',
        username: 'admin',
        email: 'admin@cafe-roya.com',
        password: 'admin123',
        createdAt: new Date().toISOString()
    }
];

// --------------------------
// Tab switching
// --------------------------
function showTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        if ((tabName === 'login' && tab.textContent === 'ورود') ||
            (tabName === 'register' && tab.textContent === 'ثبت نام')) {
            tab.classList.add('active');
        }
    });

    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });

    const activeForm = document.getElementById(`${tabName}-form`);
    if (activeForm) activeForm.classList.add('active');

    currentTab = tabName;
    hideMessage();
    clearForms();
}

// --------------------------
// Show/hide messages
// --------------------------
function showMessage(message, type = 'info') {
    const messageBox = document.getElementById('message-box');
    if (!messageBox) return;
    messageBox.textContent = message;
    messageBox.className = `message ${type}`;
    messageBox.style.display = 'block';
}

function hideMessage() {
    const messageBox = document.getElementById('message-box');
    if (!messageBox) return;
    messageBox.style.display = 'none';
}

// --------------------------
// Clear forms
// --------------------------
function clearForms() {
    document.querySelectorAll('form').forEach(f => f.reset());
}

// --------------------------
// Loading state
// --------------------------
function setLoadingState(state) {
    isLoading = state;
    document.querySelectorAll('button').forEach(btn => btn.disabled = state);
}

// --------------------------
// Toggle password visibility
// --------------------------
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
}

// --------------------------
// Show forgot password form
// --------------------------
function showForgotPassword() {
    hideMessage();
    const loginForm = document.getElementById('login-form');
    const forgotForm = document.getElementById('forgot-form');
    if (loginForm) loginForm.classList.remove('active');
    if (forgotForm) forgotForm.classList.add('active');
}

// --------------------------
// Validate registration
// --------------------------
function validateRegistration(fullname, username, email, password, confirmPassword, agreeTerms) {
    if (!fullname || !username || !email || !password || !confirmPassword) {
        return { valid: false, message: "همه فیلدها الزامی هستند" };
    }
    if (password !== confirmPassword) {
        return { valid: false, message: "رمز عبور و تکرار آن یکسان نیست" };
    }
    if (!agreeTerms) {
        return { valid: false, message: "باید شرایط را بپذیرید" };
    }
    return { valid: true };
}

// --------------------------
// Handle login
// --------------------------
function handleLogin(event) {
    event.preventDefault();
    if (isLoading) return;

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    if (!username || !password) {
        showMessage('لطفاً تمام فیلدها را پر کنید', 'error');
        return;
    }

    setLoadingState(true);

    // Simulate API call
    setTimeout(() => {
        const user = adminUsers.find(u =>
            (u.username === username || u.email === username) && u.password === password
        );

        if (user) {
            const sessionData = {
                id: user.id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                loginTime: new Date().toISOString(),
                rememberMe: rememberMe
            };

            if (rememberMe) {
                localStorage.setItem('adminSession', JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
            }

            showMessage(`خوش آمدید ${user.fullname}!`, 'success');

            setTimeout(() => {
                window.location.href = 'index.html?admin=true';
            }, 2000);

        } else {
            showMessage('نام کاربری یا رمز عبور اشتباه است', 'error');
        }

        setLoadingState(false);
    }, 1500);
}

// --------------------------
// Handle registration
// --------------------------
function handleRegister(event) {
    event.preventDefault();
    if (isLoading) return;

    const fullname = document.getElementById('register-fullname').value.trim();
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const agreeTerms = document.getElementById('agree-terms').checked;

    const validation = validateRegistration(fullname, username, email, password, confirmPassword, agreeTerms);
    if (!validation.valid) {
        showMessage(validation.message, 'error');
        return;
    }

    const newUser = {
        id: adminUsers.length + 1,
        fullname,
        username,
        email,
        password,
        createdAt: new Date().toISOString()
    };

    adminUsers.push(newUser);
    localStorage.setItem('adminUsers', JSON.stringify(adminUsers));

    showMessage('ثبت‌نام با موفقیت انجام شد!', 'success');
    clearForms();
    showTab('login');
}
