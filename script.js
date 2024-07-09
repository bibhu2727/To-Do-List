document.addEventListener('DOMContentLoaded', () => {
    const toDoForm = document.getElementById('to-do-form');
    const toDoInput = document.getElementById('to-do-input');
    const toDoTarget = document.getElementById('to-do-target');
    const toDoList = document.getElementById('to-do-list');
    const allTasksButton = document.getElementById('all-tasks');
    const completedTasksButton = document.getElementById('completed-tasks');
    const pendingTasksButton = document.getElementById('pending-tasks');

    const completionSound = new Howl({ src: ['completion.mp3'] });
    const reminderSound = new Howl({ src: ['reminder.mp3'] });

    // Load tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTask(task.text, task.timestamp, task.target, task.completed));

    toDoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const timestamp = new Date().toLocaleString();
        const target = new Date(toDoTarget.value).toLocaleString();
        addTask(toDoInput.value, timestamp, target);
        saveTasks();
        toDoInput.value = '';
        toDoTarget.value = '';
    });

    function addTask(task, timestamp, target, completed = false) {
        const li = document.createElement('li');
        const taskDetails = document.createElement('div');
        taskDetails.className = 'task-details';

        const taskText = document.createElement('span');
        taskText.textContent = task;

        const taskTimestamp = document.createElement('small');
        taskTimestamp.textContent = `Created: ${timestamp}`;

        const taskTarget = document.createElement('small');
        taskTarget.textContent = `Target: ${target}`;

        const taskButtons = document.createElement('div');
        taskButtons.className = 'task-buttons';

        const completeButton = document.createElement('button');
        completeButton.textContent = '✔';
        completeButton.className = 'complete';
        completeButton.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
            completionSound.play();
        });

        const editButton = document.createElement('button');
        editButton.textContent = '✎';
        editButton.className = 'edit';
        editButton.addEventListener('click', () => {
            const newText = prompt('Edit task:', taskText.textContent);
            if (newText !== null && newText.trim() !== '') {
                taskText.textContent = newText;
                saveTasks();
            }
        });

        taskButtons.appendChild(editButton);
        taskButtons.appendChild(completeButton);

        taskDetails.appendChild(taskText);
        taskDetails.appendChild(taskButtons);

        li.appendChild(taskDetails);
        li.appendChild(taskTimestamp);
        li.appendChild(taskTarget);

        if (completed) {
            li.classList.add('completed');
        }

        toDoList.appendChild(li);

        setReminder(task, target);
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#to-do-list li').forEach(li => {
            const taskText = li.querySelector('.task-details span').textContent;
            const timestamp = li.querySelector('small').textContent.replace('Created: ', '');
            const target = li.querySelector('small:nth-child(3)').textContent.replace('Target: ', '');
            tasks.push({
                text: taskText,
                timestamp: timestamp,
                target: target,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function filterTasks(filter) {
        const lis = document.querySelectorAll('#to-do-list li');
        lis.forEach(li => {
            switch (filter) {
                case 'all':
                    li.style.display = '';
                    break;
                case 'completed':
                    li.style.display = li.classList.contains('completed') ? '' : 'none';
                    break;
                case 'pending':
                    li.style.display = li.classList.contains('completed') ? 'none' : '';
                    break;
            }
        });
    }

    allTasksButton.addEventListener('click', () => filterTasks('all'));
    completedTasksButton.addEventListener('click', () => filterTasks('completed'));
    pendingTasksButton.addEventListener('click', () => filterTasks('pending'));

    function setReminder(task, target) {
        const targetTime = new Date(target).getTime();
        const currentTime = new Date().getTime();
        const timeout = targetTime - currentTime;

        if (timeout > 0) {
            setTimeout(() => {
                alert(`Reminder: ${task}`);
                reminderSound.play();
            }, timeout);
        }
    }
});
