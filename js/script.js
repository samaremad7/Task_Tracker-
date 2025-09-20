// Translation data
const translations = {
    en: {
        noAccount: "Don't have an account?",
        login: "Login",
        email: "Email",
        password: "Password",
        signIn: "Sign In",
        rememberMe: "Remember Me",
        forgotPassword: "Forgot password?",
        haveAccount: "Have an account?",
        signUp: "Sign Up",
        firstName: "Firstname",
        lastName: "Lastname",
        register: "Register",
        terms: "Terms & conditions",
        todoList: "To-Do List",
        logout: "Logout",
        addTask: "Add a new task",
        add: "Add",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        cancel: "Cancel",
        taskRequired: "Task cannot be empty",
        loginSuccess: "Login successful",
        registerSuccess: "Registration successful, please login",
        userExists: "User already exists",
        invalidCredentials: "Invalid email or password"
    },
    ar: {
        noAccount: "ليس لديك حساب؟",
        login: "تسجيل الدخول",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        signIn: "تسجيل الدخول",
        rememberMe: "تذكرني",
        forgotPassword: "نسيت كلمة المرور؟",
        haveAccount: "لديك حساب؟",
        signUp: "إنشاء حساب",
        firstName: "الاسم الأول",
        lastName: "الاسم الأخير",
        register: "تسجيل",
        terms: "الشروط والأحكام",
        todoList: "قائمة المهام",
        logout: "تسجيل الخروج",
        addTask: "إضافة مهمة جديدة",
        add: "إضافة",
        edit: "تعديل",
        delete: "حذف",
        save: "حفظ",
        cancel: "إلغاء",
        taskRequired: "المهمة لا يمكن أن تكون فارغة",
        loginSuccess: "تم تسجيل الدخول بنجاح",
        registerSuccess: "تم التسجيل بنجاح، يرجى تسجيل الدخول",
        userExists: "المستخدم موجود بالفعل",
        invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
    }
};

// current language
let currentLang = 'en';

// Language switching 
function switchLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.dir = currentLang === 'en' ? 'ltr' : 'rtl';
    document.getElementById('languageSwitcher').textContent = currentLang === 'en' ? 'AR' : 'EN';
    applyTranslations();
}

// Apply Translation 
function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });

    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[currentLang][key]) {
            element.placeholder = translations[currentLang][key];
        }
    });

    const values = document.querySelectorAll('[data-i18n-value]');
    values.forEach(element => {
        const key = element.getAttribute('data-i18n-value');
        if (translations[currentLang][key]) {
            element.value = translations[currentLang][key];
        }
    });
}

// Prepare translation when the page loads
document.addEventListener('DOMContentLoaded', function () {
    applyTranslations();
    document.getElementById('languageSwitcher').addEventListener('click', switchLanguage);

// Check if a user is already registered
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if (rememberMe) {
        const savedEmail = localStorage.getItem('savedEmail');
        const savedPassword = localStorage.getItem('savedPassword');
        if (savedEmail) document.getElementById('loginEmail').value = savedEmail;
        if (savedPassword) document.getElementById('loginPassword').value = savedPassword;
        document.getElementById('login-check').checked = true;
    }
});

// Login and registration functions
function handleRegister() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorElement = document.getElementById('registerError');

    if (!firstName || !lastName || !email || !password) {
        errorElement.textContent = translations[currentLang]['allFieldsRequired'] || 'All fields are required';
        errorElement.style.display = 'block';
        return;
    }

  // Check if the user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        errorElement.textContent = translations[currentLang]['userExists'];
        errorElement.style.display = 'block';
        return;
    }
// Add the new user
    users.push({ firstName, lastName, email, password, tasks: [] });
    localStorage.setItem('users', JSON.stringify(users));

    errorElement.style.display = 'none';
    alert(translations[currentLang]['registerSuccess']);
    login();
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('login-check').checked;
    const errorElement = document.getElementById('loginError');

// Verify user data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        errorElement.textContent = translations[currentLang]['invalidCredentials'];
        errorElement.style.display = 'block';
        return;
    }

 // Save login data if requested
    if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedEmail', email);
        localStorage.setItem('savedPassword', password);
    } else {
        localStorage.setItem('rememberMe', 'false');
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedPassword');
    }

 //User login
    localStorage.setItem('currentUser', JSON.stringify(user));
    errorElement.style.display = 'none';
    showTodoList(user);
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    document.getElementById('loginWrapper').style.display = 'flex';
    document.getElementById('todoContainer').style.display = 'none';
}

function showTodoList(user) {
    document.getElementById('loginWrapper').style.display = 'none';
    document.getElementById('todoContainer').style.display = 'block';

   // Load user tasks
    renderTasks(user.tasks || []);
}

// Task management functions
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (!taskText) {
        alert(translations[currentLang]['taskRequired']);
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');

  // Create the new task
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

  // Add the task to the current user
    currentUser.tasks = currentUser.tasks || [];
    currentUser.tasks.push(newTask);

 // Update user data in localStorage
    const userIndex = users.findIndex(user => user.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

// Redisplay tasks
    renderTasks(currentUser.tasks);
    taskInput.value = '';
}

function toggleTask(id) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');

 // Find the task and change its status
    const task = currentUser.tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;

      // Update data
        const userIndex = users.findIndex(user => user.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }

       // Redisplay tasks
        renderTasks(currentUser.tasks);
    }
}

function editTask(id) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const task = currentUser.tasks.find(task => task.id === id);

    if (task) {
        const newText = prompt(translations[currentLang]['edit'], task.text);
        if (newText !== null && newText.trim() !== '') {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
// Update the task text
            task.text = newText.trim();

            // Update data
            const userIndex = users.findIndex(user => user.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
// Redisplay tasks
            renderTasks(currentUser.tasks);
        }
    }
}

function deleteTask(id) {
    if (!confirm(translations[currentLang]['deleteConfirm'] || 'Are you sure you want to delete this task?')) {
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Delete the task
    currentUser.tasks = currentUser.tasks.filter(task => task.id !== id);

  // Update data
    const userIndex = users.findIndex(user => user.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Redisplay tasks
    renderTasks(currentUser.tasks);
}

function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                    <span class="task-text">${task.text}</span>
                    <div class="task-actions">
                        <button onclick="editTask(${task.id})" title="${translations[currentLang]['edit']}">
                            <i class='bx bx-edit'></i>
                        </button>
                        <button onclick="deleteTask(${task.id})" title="${translations[currentLang]['delete']}">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                `;

        taskList.appendChild(li);
    });
}

// Check if a user is already registered
window.onload = function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        showTodoList(currentUser);
    }
};

// Model switching 
function login() {
    document.getElementById("login").style.left = "4px";
    document.getElementById("register").style.right = "-720px";
    document.getElementById("login").style.opacity = 1;
    document.getElementById("register").style.opacity = 0;
}

function register() {
    document.getElementById("login").style.left = "-710px";
    document.getElementById("register").style.right = "0px";
    document.getElementById("login").style.opacity = 0;
    document.getElementById("register").style.opacity = 1;
}
