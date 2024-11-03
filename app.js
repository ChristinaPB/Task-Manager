import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "task-manager-f9adf.firebaseapp.com",
  projectId: "task-manager-f9adf",
  storageBucket: "task-manager-f9adf.appspot.com",
  messagingSenderId: "618928478919",
  appId: "1:618928478919:web:e56c5fa32820971af2fce2",
  measurementId: "G-0WR9S5SKQT"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle Registration
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Firebase registration logic
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Registration successful:', userCredential.user);
            // Redirect to login page
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Registration error:', error.message);
            if (error.code === 'auth/email-already-in-use') {
                alert('This email is already in use. Please log in or use a different email to register.');
            } else {
                alert(error.message); // Show the generic error message
            }
        }
    });
}

// Handle Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Firebase login logic
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successful:', userCredential.user);
            // Redirect to tasks page
            window.location.href = 'tasks.html';
        } catch (error) {
            console.error('Login error:', error.message);
            alert(error.message); // Show error message to the user
        }
    });
}

// Handle password reset
const resetPasswordLink = document.getElementById('resetPassword');
if (resetPasswordLink) {
    resetPasswordLink.addEventListener('click', async function () {
        const email = prompt('Please enter your email address:');
        if (email) {
            try {
                await sendPasswordResetEmail(auth, email);
                alert('Password reset email sent! Check your inbox.');
            } catch (error) {
                console.error('Password reset error:', error.message);
                alert(error.message); // Show error message
            }
        } else {
            alert('Email is required to reset the password.');
        }
    });
}
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

// Function to render tasks
const renderTasks = (tasks) => {
    taskList.innerHTML = ''; // Clear the current task list
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.newTask} - Deadline: ${task.deadline} - Risk: ${task.riskType}`;
        taskList.appendChild(li);
    });
};

// Add task event listener
taskForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const newTask = document.getElementById('newTask').value;
    const deadline = document.getElementById('deadline').value;
    const riskType = document.getElementById('riskType').value;

    try {
        // Add new task to Firestore
        await addDoc(collection(db, 'tasks'), {
            newTask,
            deadline,
            riskType
        });
        taskForm.reset(); // Clear the form
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Error adding task. Please try again.');
    }
});

// Listen for tasks in Firestore
onSnapshot(collection(db, 'tasks'), (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderTasks(tasks);
});
