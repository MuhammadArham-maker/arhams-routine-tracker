function goToAims() {
  window.location.href = "aims.html";
}

document.addEventListener('DOMContentLoaded', () => {
    // Service Worker Registration
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("./sw.js")
            .then(registration =>{
                console.log("Service registration successfull with scope: ", registration);
            })
            .catch(err => {
                console.log("Service registration failed: ", err);
            });
        });
    }

    const mainContainer = document.getElementById("main-container");
    const addTimeBtn = document.getElementById("add-time-btn");
    const themeToggleBtn = document.getElementById("theme-toggle");
    const body = document.body;

    // --- Theme Section --- 
    function applySavedTheme() {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            body.classList.add("light-mode")
        }
    }

    themeToggleBtn.addEventListener("click", () => {
        body.classList.toggle("light-mode");
        if (body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "light");
        } else {
            localStorage.setItem("theme", "dark");
        }
    });

    // --- 1. Notification Setup ---
    const notificationsSupported = "Notification" in window;
    let notificationPermissionGranted = notificationsSupported && Notification.permission === "granted";
    let lastNotifiedTime = '';

    function requestNotificationPermission() {
        if (notificationsSupported) {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    notificationPermissionGranted = true;
                    console.log("Notification permission granted.");
                } else {
                    console.log("Notification permission denied")
                }
            });
        }
    }

    // --- 2. Notification Checker ---
    function checkAndSendNotification() {
        if (!notificationPermissionGranted) return;

        const now = new Date();
        // Formatting as HH:MM 
        const currentTime = now.toTimeString().substring(0, 5);

        // Check one notification per minute
        if (currentTime === lastNotifiedTime) return;

        const allTaskTimeInputs = document.querySelectorAll(".task-item:not(.completed) input[type='time']");

        allTaskTimeInputs.forEach(timeInput => {
            if (timeInput.value === currentTime) {
                const taskItem = timeInput.closest(".task-item");
                const taskName = taskItem.querySelector(".task-label").textContent;

                // Send Notification
                new Notification("Task Reminder !", {
                    body: `It's time for: ${taskName}`,
                    icon: 'https://placehold.co/192x192/cyan/white?text=🔔'
                })
            }
        });
        // Update the last notified time
        lastNotifiedTime = currentTime;
    }

    //  --- Data Storage Functions ---
    function saveData() {
        const boxesData = [];
        const mainBoxes = document.querySelectorAll(".main-box");

        mainBoxes.forEach(box => { 
            const boxData = {
                titleText: box.querySelector(".title-container input[type='text']").value,
                titleTime: box.querySelector(".title-container input[type='time']").value,
                dailyTasks: [],
                mainTasks: []
            };

            box.querySelectorAll(".daily-tasks .task-item").forEach(taskItem => {
                boxData.dailyTasks.push({
                    name: taskItem.querySelector(".task-label").textContent,
                    time: taskItem.querySelector("input[type='time']").value,
                    isComplete: taskItem.classList.contains("completed")
                });
            });

            box.querySelectorAll(".main-tasks .task-item").forEach(taskItem => {
                boxData.mainTasks.push ({
                    name: taskItem.querySelector(".task-label").textContent,
                    time: taskItem.querySelector("input[type='time']").value,
                    isComplete: taskItem.classList.contains("completed")
                });
            });
            boxesData.push(boxData);
        });

        localStorage.setItem("routineAppData", JSON.stringify(boxesData));
    }

    function loadData() {
        const data = JSON.parse(localStorage.getItem("routineAppData"));
        if (data) {
            data.forEach(boxData => {
                const newBox = createTimeReferenceBox(boxData);
                mainContainer.appendChild(newBox);
            });
        }
    }
    

    // ---- UI Element Creations ----
    function createTaskElement(taskData) {
        const taskContainer = document.createElement("div");
        taskContainer.className = "task-item";

        // Add's the 'completed' class if the loaded data says so
        if (taskData.isComplete) {
            taskContainer.classList.add("completed");
        }

        // else create New checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = taskData.isComplete || false;
        checkbox.onchange = () => {
            taskContainer.classList.toggle("completed");
            saveData();
        };
        taskContainer.appendChild(checkbox);

        // Wrapper for time and label
        const detailsWrapper = document.createElement("div");
        detailsWrapper.className = "task-details";

        const taskTime = document.createElement("input");
        taskTime.type = "time";
        taskTime.value = taskData.time || "";
        taskTime.onchange = saveData;
        detailsWrapper.appendChild(taskTime);

        const taskLabel = document.createElement("div");
        taskLabel.className = "task-label";
        taskLabel.textContent = taskData.name;
        detailsWrapper.appendChild(taskLabel);

        taskContainer.appendChild(detailsWrapper);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-task-btn";
        deleteBtn.textContent = "X";
        deleteBtn.onclick = () => {
            taskContainer.remove();
            saveData();
        };
        taskContainer.appendChild(deleteBtn);

        return taskContainer;
    }

    function showTaskInput(container) {
        if (container.querySelector('.new-task-input')) return;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "new-task-input";
        input.placeholder = "Enter task name...";
        
        input.addEventListener('keydown', (e) => {
            if (e.key === "Enter" && input.value.trim() !== "") {
                const taskElement = createTaskElement({ name: input.value.trim(), time: "", isComplete: false });
                container.appendChild(taskElement);
                input.remove();
                saveData();
            } else if (e.key === "Escape") {
                input.remove();
            }
        });
        container.appendChild(input);
        input.focus();
    }

    function createTimeReferenceBox(data = null) {
        // Main Box
        const mainBox = document.createElement("div");
        mainBox.className = "main-box";

        // Top Row (Personbox + Maintasks)
        const topRow = document.createElement("div");
        topRow.className = "top-row";
        
        // Person Box (Time reference + Daily Tasks)
        const personBox = document.createElement("div");
        personBox.className = "person-box";

        // Container for Time Reference (Name + Time)
        const titleContainer = document.createElement("div");
        titleContainer.className = "title-container";
        // Name 
        const titleText = document.createElement("input");
        titleText.type = "text";
        titleText.placeholder = "Eg: Morning";
        titleText.value = data ? data.titleText : "";
        titleText.onchange = saveData;
        // Time
        const titleTime = document.createElement("input");
        titleTime.type = "time";
        titleTime.value = data ? data.titleTime : "";
        titleTime.onchange = saveData;

        titleContainer.appendChild(titleText);
        titleContainer.appendChild(titleTime);
        personBox.appendChild(titleContainer);

        // Daily Tasks
        const dailyTasks = document.createElement("div");
        dailyTasks.className = "daily-tasks";
        personBox.appendChild(dailyTasks);
        // Add Daily Tasks Button
        const addDailyBtn = document.createElement("button");
        addDailyBtn.textContent = "+ Daily Task";
        addDailyBtn.className = "add-task-btn";
        addDailyBtn.onclick = () => showTaskInput(dailyTasks);
        personBox.appendChild(addDailyBtn);

        // Main Tasks Container
        const mainTasksContainer = document.createElement("div");
        mainTasksContainer.className = "main-tasks-container";
        // Main Tasks
        const mainTasks = document.createElement("div");
        mainTasks.className = "main-tasks";
        // Add Main Tasks Button
        const addMainBtn = document.createElement("button");
        addMainBtn.textContent = "+ Main Task";
        addMainBtn.className = "add-task-btn";
        addMainBtn.onclick = () => showTaskInput(mainTasks);

        mainTasksContainer.appendChild(mainTasks);
        mainTasksContainer.appendChild(addMainBtn);

        // Remove Button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove Section"
        removeBtn.className = "rmv-btn";
        removeBtn.onclick = () => {
            mainBox.remove();
            saveData();
        };

        topRow.appendChild(personBox);
        topRow.appendChild(mainTasksContainer);
        mainBox.appendChild(topRow);
        mainBox.appendChild(removeBtn);

        // If loading data, populate tasks
        if (data) {
            data.dailyTasks.forEach(taskData => {
                dailyTasks.appendChild(createTaskElement(taskData));
            });
            data.mainTasks.forEach(taskData => {
                mainTasks.appendChild(createTaskElement(taskData));
            });
        }

        return mainBox;
    }

    // ----Initialization---
    addTimeBtn.addEventListener("click", () => {
        if (!notificationPermissionGranted) {
            requestNotificationPermission();
        }
        const newBox = createTimeReferenceBox();
        mainContainer.appendChild(newBox);
        saveData();
    });

    // Apply Saved Theme
    applySavedTheme();
    // Load Existing Data when the page opens
    loadData();

    // 3. Start the Notification Timer
    // Checks every 30 sec
    setInterval(checkAndSendNotification, 30000);
});
