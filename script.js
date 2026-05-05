// ================================
// TO-DO LIST - JAVASCRIPT
// Week 5: Mark Tasks as Completed
// ================================

// Grab elements from HTML
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

// ================================
// ADD TASK FUNCTION
// ================================
function addTask() {

    // Get whatever the user typed
    const taskText = taskInput.value.trim();

    // If input is empty, show a warning
    if (taskText === '') {
        alert('Please enter a task first! 😊');
        return;
    }

    // Remove the "No tasks yet" message
    const emptyState = taskList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    // Create a new task item
    const listItem = document.createElement('li');
    listItem.className = 'task-item';

    // ================================
    // CREATE CHECKBOX
    // ================================
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';

    // What happens when checkbox is clicked
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            // Mark as completed
            listItem.classList.add('completed');
            taskSpan.style.textDecoration = 'line-through';
            taskSpan.style.color = '#6c757d';
            completeButton.textContent = '↩️ Undo';
            completeButton.style.background = '#6c757d';
        } else {
            // Mark as not completed
            listItem.classList.remove('completed');
            taskSpan.style.textDecoration = 'none';
            taskSpan.style.color = '#333';
            completeButton.textContent = '✅ Complete';
            completeButton.style.background = '#28a745';
        }
    });

    // Create the task text
    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = taskText;

    // Click on text to mark complete too
    taskSpan.addEventListener('click', function() {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
    });

    // Create the buttons container
    const actionButtons = document.createElement('div');
    actionButtons.className = 'task-actions';

    // ================================
    // COMPLETE BUTTON
    // ================================
    const completeButton = document.createElement('button');
    completeButton.className = 'complete-btn';
    completeButton.textContent = '✅ Complete';

    // What happens when Complete is clicked
    completeButton.addEventListener('click', function() {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
    });

    // ================================
    // DELETE BUTTON
    // ================================
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '🗑️ Delete';

    // What happens when Delete is clicked
    deleteButton.addEventListener('click', function() {
        // Animate out before removing
        listItem.style.animation = 'taskSlideOut 0.3s ease-out';
        listItem.style.opacity = '0';
        listItem.style.transform = 'translateX(20px)';
        setTimeout(function() {
            listItem.remove();
            // Show empty state if no tasks left
            if (taskList.children.length === 0) {
                const emptyState = document.createElement('li');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = '<p>No tasks yet. Add one to get started! 🚀</p>';
                taskList.appendChild(emptyState);
            }
        }, 300);
    });

    // Put everything together
    actionButtons.appendChild(completeButton);
    actionButtons.appendChild(deleteButton);
    listItem.appendChild(checkbox);
    listItem.appendChild(taskSpan);
    listItem.appendChild(actionButtons);

    // Add the task to the list
    taskList.appendChild(listItem);

    // Clear the input box after adding
    taskInput.value = '';

    // Put cursor back in input box
    taskInput.focus();
}

// ================================
// EVENT LISTENERS
// ================================

// Listen for button click
addButton.addEventListener('click', addTask);

// Listen for Enter key
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});