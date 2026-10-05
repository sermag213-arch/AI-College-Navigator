// ================================
// Navigation
// ================================

const navButtons = document.querySelectorAll(".nav-button");
const actionButtons = document.querySelectorAll(".action-button");
const sections = document.querySelectorAll(".content-section");

function showSection(sectionName) {
    sections.forEach(section => {
        section.classList.remove("active");
    });

    const selectedSection = document.getElementById(sectionName);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    navButtons.forEach(button => {
        button.classList.remove("active");

        if (button.dataset.section === sectionName) {
            button.classList.add("active");
        }
    });
}

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        showSection(button.dataset.section);
    });
});

actionButtons.forEach(button => {
    button.addEventListener("click", () => {
        showSection(button.dataset.section);
    });
});


// ================================
// Profile
// ================================

const profileForm = document.getElementById("profile-form");

function saveProfile() {
    const profile = {
        name: document.getElementById("name").value,
        graduationYear: document.getElementById("graduation-year").value,
        gpa: document.getElementById("gpa").value,
        testScore: document.getElementById("test-score").value,
        major: document.getElementById("major").value,
        college: document.getElementById("college").value
    };

    localStorage.setItem("collegeNavigatorProfile", JSON.stringify(profile));

    updateDashboard(profile);

    alert("Profile saved!");
}

function loadProfile() {
    const savedProfile = localStorage.getItem("collegeNavigatorProfile");

    if (!savedProfile) {
        return;
    }

    const profile = JSON.parse(savedProfile);

    document.getElementById("name").value = profile.name || "";
    document.getElementById("graduation-year").value =
        profile.graduationYear || "";
    document.getElementById("gpa").value = profile.gpa || "";
    document.getElementById("test-score").value =
        profile.testScore || "";
    document.getElementById("major").value = profile.major || "";
    document.getElementById("college").value = profile.college || "";

    updateDashboard(profile);
}

function updateDashboard(profile) {
    const collegeDisplay = document.getElementById("dashboard-college");
    const majorDisplay = document.getElementById("dashboard-major");
    const graduationDisplay = document.getElementById("dashboard-graduation");

    if (collegeDisplay) {
        collegeDisplay.textContent =
            profile.college || "Not selected";
    }

    if (majorDisplay) {
        majorDisplay.textContent =
            profile.major || "Not selected";
    }

    if (graduationDisplay) {
        graduationDisplay.textContent =
            profile.graduationYear || "Not selected";
    }
}

if (profileForm) {
    profileForm.addEventListener("submit", event => {
        event.preventDefault();
        saveProfile();
    });
}


// ================================
// College Plan Progress
// ================================

const taskCheckboxes = document.querySelectorAll(
    '.plan-task input[type="checkbox"]'
);

function updateProgress() {
    const totalTasks = taskCheckboxes.length;

    if (totalTasks === 0) {
        return;
    }

    const completedTasks = document.querySelectorAll(
        '.plan-task input[type="checkbox"]:checked'
    ).length;

    const percentage = Math.round(
        (completedTasks / totalTasks) * 100
    );

    const progressBar = document.getElementById("plan-progress");
    const progressText = document.getElementById("progress-text");

    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }

    if (progressText) {
        progressText.textContent = `${percentage}% Complete`;
    }

    localStorage.setItem(
        "collegeNavigatorProgress",
        JSON.stringify(
            Array.from(taskCheckboxes).map(task => task.checked)
        )
    );
}

function loadTaskProgress() {
    const savedProgress = localStorage.getItem(
        "collegeNavigatorProgress"
    );

    if (!savedProgress) {
        return;
    }

    const progress = JSON.parse(savedProgress);

    taskCheckboxes.forEach((checkbox, index) => {
        checkbox.checked = progress[index] || false;
    });
}

taskCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", updateProgress);
});


// ================================
// AI Assistant
// ================================

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

function addChatMessage(message, sender) {
    const messageElement = document.createElement("div");

    messageElement.classList.add("chat-message", sender);

    const messageText = document.createElement("div");
    messageText.classList.add("message-text");

    if (sender === "assistant") {
    messageText.innerHTML = marked.parse(message);
} else {
    messageText.textContent = message;
}

    messageElement.appendChild(messageText);

    chatMessages.appendChild(messageElement);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function askAI(message) {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        return data.response;

    } catch (error) {
        console.error("AI connection error:", error);

        return "Sorry, I couldn't connect to the AI server. Make sure your Flask backend is running.";
    }
}

if (chatForm) {
    chatForm.addEventListener("submit", async event => {
        event.preventDefault();

        const message = chatInput.value.trim();

        if (!message) {
            return;
        }

        // Show student's message
        addChatMessage(message, "user");

        // Clear input
        chatInput.value = "";

        // Temporary loading message
        addChatMessage("Thinking...", "assistant");

        const response = await askAI(message);

        // Remove "Thinking..."
        const messages = chatMessages.querySelectorAll(
            ".chat-message"
        );

        const lastMessage = messages[messages.length - 1];

        if (lastMessage && lastMessage.textContent === "Thinking...") {
            lastMessage.remove();
        }

        // Show AI response
        addChatMessage(response, "assistant");
    });
}


// ================================
// Start Application
// ================================

loadProfile();
loadTaskProgress();
updateProgress();