// ================================
// TO-DO LIST - JAVASCRIPT
// EXTRAORDINARY EDITION
// ================================

// Grab elements from HTML
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const prioritySelect = document.getElementById('prioritySelect');
const searchInput = document.getElementById('searchInput');
const darkModeToggle = document.getElementById('darkModeToggle');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const filterButtons = document.querySelectorAll('.filter-btn');

// Tasks array for local storage
let tasks = [];

// ================================
// LOAD TASKS FROM LOCAL STORAGE
// ================================
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        tasks = JSON.parse(saved);
        tasks.forEach(function(task) {
            createTaskElement(task);
        });
        updateStats();
    }
}

// ================================
// SAVE TASKS TO LOCAL STORAGE
// ================================
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ================================
// UPDATE TASK STATS
// ================================
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;

    // Check if ALL tasks are completed for confetti
    if (total > 0 && completed === total) {
        launchConfetti();
    }
}

// ================================
// CREATE TASK ELEMENT
// ================================
function createTaskElement(task) {
    // Remove empty state
    const emptyState = taskList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    // Create task item
    const listItem = document.createElement('li');
    listItem.className = 'task-item priority-' + task.priority;
    listItem.setAttribute('data-id', task.id);

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;

    // Task content container
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    // Task info container
    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';

    // Task text
    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = task.text;

    // Task meta (date + priority tag)
    const taskMeta = document.createElement('div');
    taskMeta.className = 'task-meta';

    // Date
    const taskDate = document.createElement('span');
    taskDate.className = 'task-date';
    taskDate.textContent = task.date;

    // Priority tag
    const priorityTag = document.createElement('span');
    priorityTag.className = 'task-priority priority-' + task.priority + '-tag';
    if (task.priority === 'high') priorityTag.textContent = '🔴 High';
    if (task.priority === 'medium') priorityTag.textContent = '🟡 Medium';
    if (task.priority === 'low') priorityTag.textContent = '🟢 Low';

    // Buttons container
    const actionButtons = document.createElement('div');
    actionButtons.className = 'task-actions';

    // Complete button
    const completeButton = document.createElement('button');
    completeButton.className = 'complete-btn';
    completeButton.textContent = task.completed ? '↩️ Undo' : '✅ Done';

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '🗑️';

    // If already completed, add class
    if (task.completed) {
        listItem.classList.add('completed');
    }

    // ================================
    // CHECKBOX EVENT
    // ================================
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            listItem.classList.add('completing');
            setTimeout(function() {
                listItem.classList.remove('completing');
                listItem.classList.add('completed');
            }, 400);
            completeButton.textContent = '↩️ Undo';
            task.completed = true;
        } else {
            listItem.classList.add('undoing');
            setTimeout(function() {
                listItem.classList.remove('undoing');
                listItem.classList.remove('completed');
            }, 400);
            completeButton.textContent = '✅ Done';
            task.completed = false;
        }
        saveTasks();
        updateStats();
    });

    // Click text to complete
    taskSpan.addEventListener('click', function() {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
    });

    // Complete button click
    completeButton.addEventListener('click', function() {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
    });

    // Delete button click
    deleteButton.addEventListener('click', function() {
        listItem.classList.add('deleting');
        setTimeout(function() {
            listItem.remove();
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            updateStats();
            if (taskList.children.length === 0) {
                const emptyState = document.createElement('li');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = '<p>No tasks yet. Add one to get started! 🚀</p>';
                taskList.appendChild(emptyState);
            }
        }, 400);
    });

    // Put together
    taskMeta.appendChild(taskDate);
    taskMeta.appendChild(priorityTag);
    taskInfo.appendChild(taskSpan);
    taskInfo.appendChild(taskMeta);
    taskContent.appendChild(checkbox);
    taskContent.appendChild(taskInfo);
    actionButtons.appendChild(completeButton);
    actionButtons.appendChild(deleteButton);
    listItem.appendChild(taskContent);
    listItem.appendChild(actionButtons);
    taskList.appendChild(listItem);
}

// ================================
// ADD TASK FUNCTION
// ================================
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task first! 😊');
        return;
    }

    // Get current date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Create task object
    const task = {
        id: Date.now(),
        text: taskText,
        priority: prioritySelect.value,
        completed: false,
        date: dateStr
    };

    // Add to tasks array
    tasks.push(task);
    saveTasks();

    // Create element
    createTaskElement(task);
    updateStats();

    // Clear input
    taskInput.value = '';
    taskInput.focus();
}

// ================================
// SEARCH TASKS
// ================================
searchInput.addEventListener('input', function() {
    const searchText = searchInput.value.toLowerCase();
    const taskItems = taskList.querySelectorAll('.task-item');

    taskItems.forEach(function(item) {
        const text = item.querySelector('.task-text').textContent.toLowerCase();
        if (text.includes(searchText)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});

// ================================
// FILTER TASKS
// ================================
filterButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const taskItems = taskList.querySelectorAll('.task-item');

        taskItems.forEach(function(item) {
            if (filter === 'all') {
                item.style.display = 'flex';
            } else if (filter === 'completed') {
                item.style.display = item.classList.contains('completed') ? 'flex' : 'none';
            } else if (filter === 'pending') {
                item.style.display = item.classList.contains('completed') ? 'none' : 'flex';
            }
        });
    });
});

// ================================
// DARK MODE
// ================================
function loadDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }
}

darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark);
});

// ================================
// CONFETTI
// ================================
function launchConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#667eea', '#764ba2', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#ff6b6b'];

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        piece.style.width = Math.random() * 10 + 5 + 'px';
        piece.style.height = Math.random() * 10 + 5 + 'px';
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.animationDuration = Math.random() * 2 + 2 + 's';
        container.appendChild(piece);
    }

    setTimeout(function() {
        container.innerHTML = '';
    }, 5000);
}

// ================================
// EVENT LISTENERS
// ================================
addButton.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// ================================
// INITIALIZE APP
// ================================
loadDarkMode();
loadTasks();