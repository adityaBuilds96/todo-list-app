// ================================
// TO-DO LIST - JAVASCRIPT
// Making everything actually work!
// ================================

// Step 1: Grab the elements from HTML
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

// Step 2: Listen for when the button is clicked
addButton.addEventListener('click', function() {

    // Get whatever the user typed
    const taskText = taskInput.value;

    // If input is empty, show a warning
    if (taskText.trim() === '') {
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

    // Create the task text
    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = taskText;

    // Create the buttons container
    const actionButtons = document.createElement('div');
    actionButtons.className = 'task-actions';

    // Create Complete button
    const completeButton = document.createElement('button');
    completeButton.className = 'complete-btn';
    completeButton.textContent = '✅ Complete';

    // Create Delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '🗑️ Delete';

    // What happens when Complete is clicked
    completeButton.addEventListener('click', function() {
        listItem.classList.toggle('completed');
    });

    // What happens when Delete is clicked
    deleteButton.addEventListener('click', function() {
        listItem.remove();
    });

    // Put everything together
    actionButtons.appendChild(completeButton);
    actionButtons.appendChild(deleteButton);
    listItem.appendChild(taskSpan);
    listItem.appendChild(actionButtons);

    // Add the task to the list
    taskList.appendChild(listItem);

    // Clear the input box after adding
    taskInput.value = '';

    // Put cursor back in input box
    taskInput.focus();
});

// Step 3: Allow pressing Enter key to add task
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addButton.click();
    }
});