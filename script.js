// ================================
// TO-DO LIST - ULTRA PEAK EDITION
// With Wallpapers + Floating Quotes!
// ================================

// Elements
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const prioritySelect = document.getElementById('prioritySelect');
const categorySelect = document.getElementById('categorySelect');
const searchInput = document.getElementById('searchInput');
const darkModeToggle = document.getElementById('darkModeToggle');
const themeToggle = document.getElementById('themeToggle');
const themePicker = document.getElementById('themePicker');
const wallpaperToggle = document.getElementById('wallpaperToggle');
const wallpaperPicker = document.getElementById('wallpaperPicker');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const streakCountEl = document.getElementById('streakCount');
const progressBar = document.getElementById('progressBar');
const quoteEl = document.getElementById('motivationalQuote');
const filterButtons = document.querySelectorAll('.filter-btn');
const categoryTabs = document.querySelectorAll('.cat-tab');
const aiInput = document.getElementById('aiInput');
const aiButton = document.getElementById('aiButton');
const aiResponse = document.getElementById('aiResponse');
const aiThinking = document.getElementById('aiThinking');
const aiSuggestions = document.getElementById('aiSuggestions');
const voiceButton = document.getElementById('voiceButton');
const timerStart = document.getElementById('timerStart');
const timerPause = document.getElementById('timerPause');
const timerReset = document.getElementById('timerReset');
const timerMinutes = document.getElementById('timerMinutes');
const timerSeconds = document.getElementById('timerSeconds');

let tasks = [];
let timerInterval = null;
let timeLeft = 25 * 60;
let timerRunning = false;

// ================================
// SOUND EFFECTS
// ================================
function playSound(type) {
    try {
        const audio = new AudioContext();
        const o = audio.createOscillator();
        const g = audio.createGain();
        o.connect(g);
        g.connect(audio.destination);
        g.gain.value = 0.1;

        if (type === 'add') {
            o.frequency.value = 600;
            o.type = 'sine';
        } else if (type === 'complete') {
            o.frequency.value = 800;
            o.type = 'sine';
        } else if (type === 'delete') {
            o.frequency.value = 300;
            o.type = 'sawtooth';
        } else if (type === 'timer') {
            o.frequency.value = 1000;
            o.type = 'square';
        }

        g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.5);
        o.start();
        o.stop(audio.currentTime + 0.5);
    } catch (e) {}
}

// ================================
// PARTICLES
// ================================
function createParticles() {
    const container = document.getElementById('particles-container');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 15 + 10 + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(particle);
    }
}

// ================================
// MOTIVATIONAL QUOTES
// ================================
const quotes = [
    '"The secret of getting ahead is getting started." – Mark Twain',
    '"Focus on being productive, not busy." – Tim Ferriss',
    '"Do what you can, with what you have, where you are." – Theodore Roosevelt',
    '"Small steps every day lead to big results."',
    '"Your future is created by what you do today." – Robert Kiyosaki',
    '"Done is better than perfect." – Sheryl Sandberg',
    '"A year from now you will wish you had started today." – Karen Lamb',
    '"It always seems impossible until it is done." – Nelson Mandela',
    '"Believe you can and you are halfway there." – Theodore Roosevelt',
    '"Start where you are. Use what you have. Do what you can." – Arthur Ashe',
    '"Success is the sum of small efforts repeated day in and day out." – Robert Collier'
];

function showRandomQuote() {
    quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

// ================================
// STREAK COUNTER
// ================================
function updateStreak() {
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem('lastActiveDate');
    let streak = parseInt(localStorage.getItem('streak') || '0');

    if (lastActive !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastActive === yesterday.toDateString()) {
            streak++;
        } else {
            streak = 1;
        }
        localStorage.setItem('lastActiveDate', today);
        localStorage.setItem('streak', streak.toString());
    }

    streakCountEl.textContent = streak;
}

// ================================
// POMODORO TIMER
// ================================
function updateTimerDisplay() {
    timerMinutes.textContent = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    timerSeconds.textContent = (timeLeft % 60).toString().padStart(2, '0');
}

timerStart.addEventListener('click', function() {
    if (!timerRunning) {
        timerRunning = true;
        timerInterval = setInterval(function() {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                playSound('timer');
                alert('Time is up! Take a break!');
                timeLeft = 25 * 60;
                updateTimerDisplay();
            }
        }, 1000);
    }
});

timerPause.addEventListener('click', function() {
    clearInterval(timerInterval);
    timerRunning = false;
});

timerReset.addEventListener('click', function() {
    clearInterval(timerInterval);
    timerRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

// ================================
// VOICE INPUT
// ================================
voiceButton.addEventListener('click', function() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        voiceButton.classList.add('listening');
        voiceButton.textContent = '🔴';
        recognition.start();

        recognition.onresult = function(event) {
            taskInput.value = event.results[0][0].transcript;
            voiceButton.classList.remove('listening');
            voiceButton.textContent = '🎤';
        };

        recognition.onerror = function() {
            voiceButton.classList.remove('listening');
            voiceButton.textContent = '🎤';
        };

        recognition.onend = function() {
            voiceButton.classList.remove('listening');
            voiceButton.textContent = '🎤';
        };
    } else {
        alert('Voice input not supported in this browser.');
    }
});

// ================================
// WALLPAPER PICKER
// ================================
wallpaperToggle.addEventListener('click', function() {
    wallpaperPicker.classList.toggle('hidden');
    themePicker.classList.add('hidden');
});

document.querySelectorAll('.wallpaper-option').forEach(function(btn) {
    btn.addEventListener('click', function() {
        const wallpaper = btn.getAttribute('data-wallpaper');

        // Remove all wallpaper classes
        document.body.classList.remove(
            'wallpaper-mountain', 'wallpaper-ocean', 'wallpaper-forest',
            'wallpaper-city', 'wallpaper-galaxy', 'wallpaper-sunset'
        );

        if (wallpaper !== 'none') {
            document.body.classList.add('wallpaper-' + wallpaper);
        }

        localStorage.setItem('wallpaper', wallpaper);
        wallpaperPicker.classList.add('hidden');
    });
});

function loadWallpaper() {
    const savedWallpaper = localStorage.getItem('wallpaper');
    if (savedWallpaper && savedWallpaper !== 'none') {
        document.body.classList.add('wallpaper-' + savedWallpaper);
    }
}

// ================================
// THEMES
// ================================
themeToggle.addEventListener('click', function() {
    themePicker.classList.toggle('hidden');
    wallpaperPicker.classList.add('hidden');
});

document.querySelectorAll('.theme-option').forEach(function(btn) {
    btn.addEventListener('click', function() {
        const theme = btn.getAttribute('data-theme');
        document.body.classList.remove('theme-ocean', 'theme-sunset', 'theme-forest', 'theme-galaxy', 'theme-rose');

        if (theme !== 'purple') {
            document.body.classList.add('theme-' + theme);
        }

        localStorage.setItem('theme', theme);
        themePicker.classList.add('hidden');
    });
});

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== 'purple') {
        document.body.classList.add('theme-' + savedTheme);
    }
}

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
// LOCAL STORAGE
// ================================
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        tasks = JSON.parse(saved);
        tasks.forEach(function(task) { createTaskElement(task); });
        updateStats();
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ================================
// UPDATE STATS
// ================================
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(function(t) { return t.completed; }).length;
    const pending = total - completed;
    const percent = total > 0 ? (completed / total) * 100 : 0;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
    progressBar.style.width = percent + '%';

    if (total > 0 && completed === total) {
        launchConfetti();
        playSound('complete');
    }
}

// ================================
// CREATE TASK ELEMENT
// ================================
function createTaskElement(task) {
    const emptyState = taskList.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    const listItem = document.createElement('li');
    listItem.className = 'task-item priority-' + task.priority;
    listItem.setAttribute('data-id', task.id);
    listItem.setAttribute('data-category', task.category || 'personal');
    listItem.draggable = true;

    listItem.addEventListener('dragstart', function() { listItem.classList.add('dragging'); });
    listItem.addEventListener('dragend', function() {
        listItem.classList.remove('dragging');
        document.querySelectorAll('.task-item').forEach(function(item) { item.classList.remove('drag-over'); });
    });
    listItem.addEventListener('dragover', function(e) { e.preventDefault(); listItem.classList.add('drag-over'); });
    listItem.addEventListener('dragleave', function() { listItem.classList.remove('drag-over'); });
    listItem.addEventListener('drop', function(e) {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        if (dragging && dragging !== listItem) taskList.insertBefore(dragging, listItem);
        listItem.classList.remove('drag-over');
    });

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';

    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = task.text;

    const taskMeta = document.createElement('div');
    taskMeta.className = 'task-meta';

    const taskDate = document.createElement('span');
    taskDate.className = 'task-date';
    taskDate.textContent = task.date;

    const priorityTag = document.createElement('span');
    priorityTag.className = 'task-priority priority-' + task.priority + '-tag';
    if (task.priority === 'high') priorityTag.textContent = '🔴 High';
    if (task.priority === 'medium') priorityTag.textContent = '🟡 Medium';
    if (task.priority === 'low') priorityTag.textContent = '🟢 Low';

    const categoryTag = document.createElement('span');
    categoryTag.className = 'task-category category-' + (task.category || 'personal');
    const catLabels = { personal: '👤 Personal', work: '💼 Work', shopping: '🛒 Shopping', health: '💪 Health' };
    categoryTag.textContent = catLabels[task.category] || '👤 Personal';

    const actionButtons = document.createElement('div');
    actionButtons.className = 'task-actions';

    const completeButton = document.createElement('button');
    completeButton.className = 'complete-btn';
    completeButton.textContent = task.completed ? '↩️' : '✅';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '🗑️';

    if (task.completed) listItem.classList.add('completed');

    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            playSound('complete');
            listItem.classList.add('completing');
            setTimeout(function() { listItem.classList.remove('completing'); listItem.classList.add('completed'); }, 400);
            completeButton.textContent = '↩️';
            task.completed = true;
        } else {
            listItem.classList.add('undoing');
            setTimeout(function() { listItem.classList.remove('undoing'); listItem.classList.remove('completed'); }, 400);
            completeButton.textContent = '✅';
            task.completed = false;
        }
        saveTasks();
        updateStats();
    });

    taskSpan.addEventListener('click', function() {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
    });

    completeButton.addEventListener('click', function() {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
    });

    deleteButton.addEventListener('click', function() {
        playSound('delete');
        listItem.classList.add('deleting');
        setTimeout(function() {
            listItem.remove();
            tasks = tasks.filter(function(t) { return t.id !== task.id; });
            saveTasks();
            updateStats();
            if (taskList.children.length === 0) {
                const empty = document.createElement('li');
                empty.className = 'empty-state';
                empty.innerHTML = '<p>No tasks yet. Add one to get started! 🚀</p>';
                taskList.appendChild(empty);
            }
        }, 400);
    });

    taskMeta.appendChild(taskDate);
    taskMeta.appendChild(priorityTag);
    taskMeta.appendChild(categoryTag);
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
// ADD TASK (FIXED!)
// ================================
function addTask(text, priority, category) {
    if (text && typeof text !== 'string') text = null;
    if (priority && typeof priority !== 'string') priority = null;
    if (category && typeof category !== 'string') category = null;

    const taskText = text || taskInput.value.trim();
    if (taskText === '') { alert('Please enter a task first! 😊'); return; }

    playSound('add');

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const task = {
        id: Date.now(),
        text: taskText,
        priority: priority || prioritySelect.value,
        category: category || categorySelect.value,
        completed: false,
        date: dateStr
    };

    tasks.push(task);
    saveTasks();
    createTaskElement(task);
    updateStats();

    if (!text) { taskInput.value = ''; taskInput.focus(); }
}

// ================================
// SEARCH
// ================================
searchInput.addEventListener('input', function() {
    const searchText = searchInput.value.toLowerCase();
    taskList.querySelectorAll('.task-item').forEach(function(item) {
        const text = item.querySelector('.task-text').textContent.toLowerCase();
        item.style.display = text.includes(searchText) ? 'flex' : 'none';
    });
});

// ================================
// FILTER
// ================================
filterButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
        filterButtons.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        taskList.querySelectorAll('.task-item').forEach(function(item) {
            if (filter === 'all') item.style.display = 'flex';
            else if (filter === 'completed') item.style.display = item.classList.contains('completed') ? 'flex' : 'none';
            else item.style.display = item.classList.contains('completed') ? 'none' : 'flex';
        });
    });
});

// ================================
// CATEGORY TABS
// ================================
categoryTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
        categoryTabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        const category = tab.getAttribute('data-category');
        taskList.querySelectorAll('.task-item').forEach(function(item) {
            if (category === 'all') item.style.display = 'flex';
            else item.style.display = item.getAttribute('data-category') === category ? 'flex' : 'none';
        });
    });
});

// ================================
// AI SUGGESTIONS
// ================================
const aiDatabase = {
    fitness: ['Go for a 30 minute run', 'Do 20 push ups', 'Drink 8 glasses of water', 'Prepare healthy meal', 'Stretch for 10 minutes'],
    study: ['Review class notes', 'Complete homework', 'Read 2 chapters', 'Watch lecture videos', 'Make flashcards'],
    work: ['Reply to all emails', 'Prepare for meeting', 'Complete project report', 'Update task board', 'Send weekly summary'],
    shopping: ['Buy weekly groceries', 'Order supplies online', 'Pick up dry cleaning', 'Buy birthday gift', 'Restock essentials'],
    health: ['Schedule doctor appointment', 'Take daily vitamins', 'Drink herbal tea', 'Do breathing exercises', 'Meditate 10 minutes'],
    coding: ['Complete JS project', 'Learn new CSS trick', 'Fix project bugs', 'Push code to GitHub', 'Read documentation'],
    cleaning: ['Clean bedroom', 'Do laundry', 'Wash dishes', 'Vacuum floors', 'Clean bathroom'],
    finance: ['Track expenses', 'Pay pending bills', 'Set weekly budget', 'Review bank statements', 'Cancel unused subscriptions'],
    morning: ['Wake up at 6am', 'Make bed immediately', 'Morning workout 10 min', 'Eat healthy breakfast', 'Plan day ahead'],
    social: ['Call parents today', 'Reply to messages', 'Plan weekend outing', 'Send thank you note', 'Check on a friend'],
    default: ['Plan your day', 'Do most important task first', 'Take regular breaks', 'Stay hydrated', 'Review weekly goals']
};

function askAI() {
    const userMessage = aiInput.value.trim();
    if (userMessage === '') { alert('Please type something! 😊'); return; }

    aiResponse.classList.remove('hidden');
    aiThinking.classList.remove('hidden');
    aiSuggestions.innerHTML = '';
    aiButton.disabled = true;
    aiButton.textContent = '⏳ Thinking...';

    setTimeout(function() {
        aiThinking.classList.add('hidden');
        const input = userMessage.toLowerCase();
        let category = 'default';

        if (input.match(/fit|gym|workout|exercise|run|walk|yoga/)) category = 'fitness';
        else if (input.match(/study|exam|learn|school|homework|read/)) category = 'study';
        else if (input.match(/work|job|office|meeting|email|project/)) category = 'work';
        else if (input.match(/shop|buy|purchase|grocery|store/)) category = 'shopping';
        else if (input.match(/health|doctor|medicine|sleep|meditat/)) category = 'health';
        else if (input.match(/code|program|develop|javascript|css/)) category = 'coding';
        else if (input.match(/clean|organiz|tidy|wash|laundry/)) category = 'cleaning';
        else if (input.match(/money|finance|budget|save|invest/)) category = 'finance';
        else if (input.match(/morning|routine|wake|habit/)) category = 'morning';
        else if (input.match(/friend|family|social|call|meet/)) category = 'social';

        const suggestions = aiDatabase[category].sort(function() { return Math.random() - 0.5; }).slice(0, 5);

        suggestions.forEach(function(suggestion) {
            const item = document.createElement('div');
            item.className = 'ai-suggestion-item';
            const text = document.createElement('span');
            text.className = 'ai-suggestion-text';
            text.textContent = '💡 ' + suggestion;
            const addBtn = document.createElement('button');
            addBtn.className = 'ai-add-btn';
            addBtn.textContent = '+ Add';
            addBtn.addEventListener('click', function() {
                addTask(suggestion, 'medium', 'personal');
                addBtn.textContent = '✅';
                addBtn.style.background = '#28a745';
                addBtn.disabled = true;
            });
            item.appendChild(text);
            item.appendChild(addBtn);
            aiSuggestions.appendChild(item);
        });

        aiButton.disabled = false;
        aiButton.textContent = '✨ Ask AI';
        aiInput.value = '';
    }, 1500);
}

// ================================
// CONFETTI
// ================================
function launchConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#667eea', '#764ba2', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#ff6b6b', '#6dd5ed'];
    for (let i = 0; i < 100; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        piece.style.width = Math.random() * 12 + 5 + 'px';
        piece.style.height = Math.random() * 12 + 5 + 'px';
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.animationDuration = Math.random() * 2 + 2 + 's';
        container.appendChild(piece);
    }
    setTimeout(function() { container.innerHTML = ''; }, 5000);
}

// ================================
// EVENT LISTENERS (FIXED!)
// ================================
addButton.addEventListener('click', function() { addTask(null, null, null); });
taskInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') addTask(null, null, null); });
aiButton.addEventListener('click', askAI);
aiInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') askAI(); });

// ================================
// INITIALIZE
// ================================
loadDarkMode();
loadTheme();
loadWallpaper();
loadTasks();
createParticles();
showRandomQuote();
updateStreak();
updateTimerDisplay();