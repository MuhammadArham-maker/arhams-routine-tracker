document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("theme-toggle");
    const body = document.body;

    function applySavedTheme() {
        if (localStorage.getItem("theme") === "light") {
            body.classList.add("light-mode");
        }
    }

    themeToggleBtn.addEventListener("click", () => {
        body.classList.toggle("light-mode");
        localStorage.setItem("theme", body.classList.contains("light-mode") ? "light" : "dark");
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service Worker registered on aims page.', reg))
                .catch(err => console.error('Service Worker registration failed:', err));
        });
    }
    applySavedTheme();

    let aimsData = JSON.parse(localStorage.getItem("aimsData")) || {
        daily: [], weekly: [], monthly: []
    };

    function saveData() {
        localStorage.setItem("aimsData", JSON.stringify(aimsData));
    }

    function renderAll() {
        ["daily", "weekly", "monthly"].forEach(type => {
            const container = document.getElementById(type + "Container");
            container.replaceChildren();

            aimsData[type].forEach((cat, catIndex) => {
                const div = document.createElement("div");
                div.className = "category";

                const heading = document.createElement("h3");
                heading.textContent = `${catIndex + 1}. ${cat.name}`;
                div.appendChild(heading);

                const deleteCategoryButton = document.createElement("button");
                deleteCategoryButton.className = "delete-btn delete-category-btn";
                deleteCategoryButton.textContent = "x";
                deleteCategoryButton.addEventListener("click", () => {
                    window.deleteCategory(type, catIndex);
                });
                div.appendChild(deleteCategoryButton);

                const subgoalsContainer = document.createElement("div");
                subgoalsContainer.className = "subgoals";

                cat.subgoals.forEach((subgoal, subIndex) => {
                    const subgoalRow = document.createElement("div");
                    subgoalRow.className = "subgoal";

                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.checked = Boolean(subgoal.done);
                    checkbox.addEventListener("change", () => {
                        window.toggleSubgoal(type, catIndex, subIndex);
                    });
                    subgoalRow.appendChild(checkbox);

                    const subgoalText = document.createElement("span");
                    subgoalText.className = subgoal.done ? "completed" : "";
                    subgoalText.textContent = subgoal.text;
                    subgoalRow.appendChild(subgoalText);

                    const deleteSubgoalButton = document.createElement("button");
                    deleteSubgoalButton.className = "delete-btn delete-subgoal-btn";
                    deleteSubgoalButton.textContent = "×";
                    deleteSubgoalButton.addEventListener("click", () => {
                        window.deleteSubgoal(type, catIndex, subIndex);
                    });
                    subgoalRow.appendChild(deleteSubgoalButton);

                    subgoalsContainer.appendChild(subgoalRow);
                });

                div.appendChild(subgoalsContainer);

                const subgoalInput = document.createElement("input");
                subgoalInput.type = "text";
                subgoalInput.placeholder = "Add subgoal...";
                subgoalInput.addEventListener("keydown", event => {
                    if (event.key === "Enter") {
                        window.addSubgoal(type, catIndex, subgoalInput);
                    }
                });
                div.appendChild(subgoalInput);

                container.appendChild(div);
            });
        });
    }

    window.showAddCategoryInput = function(type) {
        const container = document.getElementById(type + "Container");
        if (container.querySelector('.new-category-input')) return;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'new-category-input';
        input.placeholder = `Enter new ${type} category...`;
        input.style.marginTop = '10px';
        input.onkeydown = (event) => {
            if (event.key === 'Enter' && input.value.trim()) {
                addCategory(type, input.value);
                input.remove();
            } else if (event.key === 'Escape') {
                input.remove();
            }
        };
        container.appendChild(input);
        input.focus();
    }

    window.addCategory = function(type, name) {
        if (name && name.trim() !== "") {
            aimsData[type].push({ name: name.trim(), subgoals: [] });
            saveData();
            renderAll();
        }
    }

    window.deleteCategory = function(type, catIndex) {
        if (confirm('Are you sure you want to delete this entire category?')) {
            aimsData[type].splice(catIndex, 1);
            saveData();
            renderAll();
        }
    }

    window.addSubgoal = function(type, catIndex, input) {
        const text = input.value.trim();
        if (text) {
            aimsData[type][catIndex].subgoals.push({ text, done: false });
            input.value = "";
            saveData();
            renderAll();
        }
    }

    window.deleteSubgoal = function(type, catIndex, subIndex) {
         aimsData[type][catIndex].subgoals.splice(subIndex, 1);
         saveData();
         renderAll();
    }

    window.toggleSubgoal = function(type, catIndex, subIndex) {
        const goal = aimsData[type][catIndex].subgoals[subIndex];
        goal.done = !goal.done;
        saveData();
        renderAll();
    }
    
    renderAll();
});
