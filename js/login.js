document.addEventListener("DOMContentLoaded", function () {
    updateNavbar();
});

function login() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (username && password) {
        let storedPassword = localStorage.getItem(username);

        if (storedPassword) {
            if (storedPassword === password) {
                localStorage.setItem("user", username);
                alert("Login successful!");
                updateNavbar();
                window.location.href = "./index.html"; // Redirect to home
            } else {
                alert("Incorrect password.");
            }
        } else {
            if (confirm("No account found. Do you want to sign up?")) {
                localStorage.setItem(username, password);
                localStorage.setItem("user", username);
                alert("Account created successfully!");
                updateNavbar();
                window.location.href = "./index.html"; // Redirect to home
            }
        }
    } else {
        alert("Please enter both username and password.");
    }
}

function logout() {
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    updateNavbar();
    window.location.href = "./index.html"; // Redirect to home
}

function updateNavbar() {
    let user = localStorage.getItem("user");
    let usernameDisplay = document.getElementById("username-display");
    let logoutBtn = document.getElementById("logout-btn");
    let loginBtn = document.getElementById("login-btn");

    if (user) {
        usernameDisplay.textContent = user;
        usernameDisplay.style.display = "inline-block"; // Ensure it is visible
        logoutBtn.classList.remove("hidden");
        loginBtn.classList.add("hidden");
    } else {
        usernameDisplay.style.display = "none";
        logoutBtn.classList.add("hidden");
        loginBtn.classList.remove("hidden");
    }
}
