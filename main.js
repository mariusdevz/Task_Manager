const taskForm = document.querySelector("#task-form");
const category = document.querySelector("#category");
const taskTitle = document.querySelector("#task-title");
const date = document.querySelector("#date");
const todoList = document.querySelector("#todoList");
const empty = document.querySelector("#empty");

//filters
const all = document.querySelector('#all')
const completed = document.querySelector('#completed')
const active = document.querySelector('#active')



function loadTasks() {
    try {
        const saved = JSON.parse(localStorage.getItem('tasks'))

        if (!Array.isArray(saved)) return [];

        const isValid = saved.every(task => {
            return task !== null &&
                typeof task === 'object' &&
                typeof task.text === 'string' &&
                typeof task.text === 'string' &&
                task.text.trim() !== '' &&
                typeof task.id === 'string' &&
                task.id.trim() !== '' &&
                typeof task.category === 'string' &&
                task.category.trim() !== "" &&
                typeof task.dueDate === 'string' &&
                task.dueDate.trim() !== '' &&
                task.dueDate.match(/^\d{4}-\d{2}-\d{2}$/) &&
                !Number.isNaN(new Date(task.dueDate).getTime()) &&
                typeof task.completed === 'boolean'
        })
        return isValid ? saved : []
    } catch (error) {
        console.error("Could not load tasks:", error);
        localStorage.removeItem('tasks');
        return []
    }
}

let tasks = loadTasks();



let currentFilter = "all";

function updateFilterButtons() {
    all.setAttribute('aria-pressed', currentFilter === 'all' ? "true" : "false")
    completed.setAttribute('aria-pressed', currentFilter === 'completed' ? "true" : "false")
    active.setAttribute('aria-pressed', currentFilter === 'active' ? "true" : "false")
}

all.addEventListener("click", () => {
    currentFilter = "all";
    renderTasks()
})
completed.addEventListener("click", () => {
    currentFilter = "completed";
    renderTasks()
})
active.addEventListener("click", () => {
    currentFilter = "active";
    renderTasks()
})


function renderTasks() {
    todoList.innerHTML = "";
    updateFilterButtons()
    let filteredTasks = tasks;

    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed)
    } else if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed)
    }

    if (tasks.length === 0) {
        empty.textContent = "No tasks yet. Add your first task."
    } else if (filteredTasks.length === 0 && currentFilter === 'active') {
        empty.textContent = "No active tasks."
    } else if (filteredTasks.length === 0 && currentFilter === 'completed') {
        empty.textContent = "No completed tasks."

    }

    empty.hidden = filteredTasks.length !== 0;
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.className = "task-title"
        const spanDate = document.createElement('span')
        const spanCategory = document.createElement('span')
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete')
        const checkBox = document.createElement('input');
        checkBox.type = "checkbox";

        checkBox.checked = task.completed
        checkBox.addEventListener("change", () => {
            toggleTasks(task.id)
        })
        checkBox.setAttribute("aria-label", `Mark ${task.text} as Complete`)

        spanDate.textContent = task.dueDate;
        spanDate.className = "task-date"
        spanCategory.textContent = task.category;
        spanCategory.className = "task-category"

        span.style.textDecoration = task.completed
            ? "line-through" : "none"
        span.textContent = task.text;

        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id)
        })

        li.appendChild(span);
        li.appendChild(spanDate);
        li.appendChild(spanCategory);
        li.appendChild(checkBox)
        li.appendChild(deleteBtn)
        todoList.appendChild(li)
    })


}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
})

function toggleTasks(id) {
    tasks = tasks.map(task =>
        (task.id === id ? { ...task, completed: !task.completed } : task)
    )

    renderTasks()
    saveTasks()
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks()
    saveTasks()
}

function addTask() {
    const inputTitle = taskTitle.value.trim();
    const categoryInput = category.value.trim();
    const dateInput = date.value.trim();
    if (inputTitle === '' || categoryInput === '' || dateInput === '') return;

    taskTitle.addEventListener('input', () => {
        taskTitle.focus()
    })

    const newTask = {
        id: crypto.randomUUID(),
        text: inputTitle,
        category: categoryInput,
        dueDate: dateInput,
        completed: false
    }

    tasks.push(newTask);
    taskTitle.value = "";
    category.value = "";
    date.value = "";
    renderTasks();
    saveTasks();
}

renderTasks();