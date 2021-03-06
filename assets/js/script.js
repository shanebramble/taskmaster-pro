var tasks = {};

var createTask = function (taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);

  // Check due date 
  auditTask(taskLi);

  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function () {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function (list, arr) {

    // then loop over sub-array
    arr.forEach(function (task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};



// JavaScript can recognize chained methods whether or not they 're on the same line. 
// The following examples both work:

// var text = $(this).text().trim();

// var text = $(this)
//   .text()
//   .trim();

// However, putting methods on a new line can improve readability.

// With the $ character, however, we can convert this into a jQuery object.
$(".list-group").on("click", "p", function () {
  var text = $(this)
    .text()
    .trim();

  var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);

  $(this).replaceWith(textInput);
  textInput.trigger("focus");
});

// The blur event is sent to an element when it loses focus.
// An element can lose focus via keyboard commands, such as the Tab key, or by mouse 
// clicks elsewhere on the page.
$(".list-group").on("blur", "textarea", function () {
  // get the textarea's current value/text
  var text = $(this)
    .val()
    .trim();

  // get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  // get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();

  tasks[status][index].text = text;
  saveTasks();

  tasks[status][index].text = text;
  saveTasks();

  // recreate p element
  var taskP = $("<p>")
    .addClass("m-1")
    .text(text);

  // replace textarea with new content
  $(this).replaceWith(taskP);

});

// Make the dates editable
$(".list-group").on("click", "span", function () {
  // Get current text for date.
  var date = $(this).text().trim();

  // create new input element
  var dateInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);

  // swap out elements
  $(this).replaceWith(dateInput);

  // enable jquery ui datepicker
  dateInput.datepicker({
    minDate: 1,
    onClose: function () {
      $(this).trigger("change");
    }
  });

  // automatically focus on new element
  dateInput.trigger("focus");

});

// value of due date was changed
$(".list-group").on("change", "input[type='text']", function () {
  // get current text
  var date = $(this)
    .val()
    .trim();

  // get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  // get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // update task in array and re-save to localstorage
  tasks[status][index].date = date;
  saveTasks();

  // recreate span element with bootstrap classes
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);

  // replace input with span element
  $(this).replaceWith(taskSpan);
  // Pass task's <li> element into auditTask() to check new due date
  auditTask($(taskSpan).closest(".list-group-item"));
});

var auditTask = function (taskEl) {
  // To ensure element is getting to the function.
  var date = $(taskEl).find("span").text().trim();

  // Convert to moment object at 5:00pm.
  var time = moment(date, "L").set("hour", 17);

  // Remove any old classes from element
  $(taskEl).removeClass("list-group-item-warning list-group-item-danger");

  // Apply new class if task is near/over due date.
  if (moment().isAfter(time)) {
    $(taskEl).addClass("list-group-item-danger");
  } else if (Math.abs(moment().diff(time, "days")) <= 2) {
    $(taskEl).addClass("list-group-item-warning");
  }

  // this should print out an object for the value of the date variable, but at 5:00pm of that date
  console.log(time);
  

};
// In the previous example, we multiply 1, 000 milliseconds by 60 to convert it to 
// 1 minute.Then we multiply that minute by 30 to get a 30 - minute timer.

setInterval(function () {
  $(".card .list-group-item").each(function (index, el) {
    auditTask(el);
  });
}, 1800000); // or (1000 * 60) * 30);

// The activate and deactivate events trigger once
// for all connected lists as soon as dragging starts and stops.

// The over and out events trigger when a dragged item enters or leaves a connected list.

// The update event triggers when the contents of a list have changed(e.g., the items were 
// re - ordered, an item was removed, or an item was added).
$(".card .list-group").sortable({
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function (event) {
    console.log("activate", this);
    $(this).addClass("dropover");
    $(".bottom-trash").addClass("bottom-trash-drag");
  },
  deactivate: function (event) {
    console.log("deactivate", this);
    $(this).removeClass("dropover");
    $(".bottom-trash").removeClass("bottom-trash-drag");
  },
  over: function (event) {
    console.log("over", event.target);
    $(event.target).addClass("dropover-active");
  },
  out: function (event) {
    console.log("out", event.target);
    $(event.target).removeClass("dropover-active");
  },
  update: function (event) {
    // arrar to store the task data in
    var tempArr = [];
    // jQuery 's each() method will run a callback function for every item/element in the array. 
    // It 's another form of looping, except that a function is now called on each loop iteration.    
    // loop over current set of children in sortable list.

    $(this).children().each(function () {
      var text = $(this)
        .find("p")
        .text()
        .trim();

      var date = $(this)
        .find("span")
        .text()
        .trim();

      // add task data to temp array as an object.
      tempArr.push({
        text: text,
        date: date
      });
    });
    // trim down list's ID to match object property
    var arrName = $(this)
      .attr("id")
      .replace("list-", "");

    // update array on tasks object and save
    tasks[arrName] = tempArr;
    saveTasks();
  }
});
$("#trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",
  drop: function (event, ui) {
    // jQuery 's remove() method works just like a regular JavaScript remove() and 
    // will remove that element from the DOM entirely.
    ui.draggable.remove();
    $(".bottom-trash").removeClass("bottom-trash-active");
  },
  over: function (event, ui) {
    console.log("over");
    $(".bottom-trash").addClass("bottom-trash-active");
  },
  out: function (event, ui) {
    console.log("out");
    $(".bottom-trash").removeClass("bottom-trash-active");
  }
});

// modal due date 
$("#modalDueDate").datepicker({
  minDate: 1
});
// modal was triggered
$("#task-form-modal").on("show.bs.modal", function () {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function () {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-save").click(function () {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function () {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();