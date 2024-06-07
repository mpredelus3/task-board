// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (nextId === null || nextId === undefined) {
      nextId = 1;
    } else {
      nextId++;
    }
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
  }
  
// Todo: create a function to create a task card
function createTaskCard(task) {
    return $(`
      <div class="card mb-3 task-card" data-id="${task.id}">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <p class="card-text"><small class="text-muted">Due: ${dayjs(task.dueDate).format('MM/DD/YYYY')}</small></p>
          <button class="btn btn-danger btn-sm delete-task">Delete</button>
        </div>
      </div>
    `);
  }
  
// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const lanes = {
      'to-do': $('#todo-cards'),
      'in-progress': $('#in-progress-cards'),
      'done': $('#done-cards')
    };
  
    for (const lane in lanes) {
      lanes[lane].empty();
    }
  
    if (taskList && taskList.length > 0) {
      taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        lanes[task.status].append(taskCard);
        taskCard.draggable({
          revert: "invalid",
          helper: "clone"
        });
      });
    }
  }
  

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const taskTitle = $('#task-title').val();
  const taskDescription = $('#task-description').val();
  const taskDueDate = $('#task-due-date').val();

  if (taskTitle && taskDueDate) {
    const newTask = {
      id: generateTaskId(),
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate,
      status: 'to-do'
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    $('#formModal').modal('hide');
    $('#task-form')[0].reset();
  }
}

// Todo: create a function to handle deleting a task
function handleAddTask(event) {
  event.preventDefault();

  const taskTitle = $('#task-title').val();
  const taskDescription = $('#task-description').val();
  const taskDueDate = $('#task-due-date').val();

  if (taskTitle && taskDueDate) {
    const newTask = {
      id: generateTaskId(),
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate,
      status: 'to-do'
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    $('#formModal').modal('hide');
    $('#task-form')[0].reset();
  }
}


// Todo: create a function to handle dropping a task into a new status lane
function handleDeleteTask(event) {
  const taskId = $(event.target).closest('.task-card').data('id');
  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
function handleDrop(event, ui) {
  const taskCard = ui.draggable;
  const newStatus = $(this).attr('id');

  const taskId = taskCard.data('id');
  const task = taskList.find(task => task.id === taskId);
  task.status = newStatus;

  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

$(document).ready(function () {
  if (!taskList) {
    taskList = [];
  }
  renderTaskList();

  $('#add-task-btn').click(handleAddTask);
  $(document).on('click', '.delete-task', handleDeleteTask);

  $('.lane').droppable({
    accept: '.task-card',
    drop: handleDrop
  });

  $('#task-due-date').datepicker({
    dateFormat: 'mm/dd/yy'
  });
});

