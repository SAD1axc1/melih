// Tüm Elementleri Seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstcardBody = document.querySelectorAll(".card-body")[0];
const secondcardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

/////
eventListerens();
function eventListerens() {
  // Tüm event listenerlar
  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  secondcardBody.addEventListener("click", deleteTodo);
  filter.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos(e) {
  const listItems = document.querySelectorAll(".list-group-item");
  if (listItems.length === 0) {
    alert("Silinecek Bir Kitap Yok!");
  } else {
    if (confirm("Tümünü Silmek İstediğinize Emin misiniz ?")) {
      // Arayüzden Todoları temizleme

      // todoList.innerHTML = ""; // Yavaş

      while (todoList.firstElementChild != null) {
        todoList.removeChild(todoList.firstElementChild);
      }
      localStorage.removeItem("todos");
    }
  }
}

function filterTodos(e) {
  const filterValue = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach(function (listItem) {
    const text = listItem.textContent.toLowerCase();

    if (text.indexOf(filterValue) === -1) {
      // Bulamadı
      listItem.setAttribute("style", "display : none !important");
    } else {
      listItem.setAttribute("style", "display : block");
    }
  });
}

function deleteTodo(e) {
  if (e.target.className === "fa fa-remove") {
    e.target.parentElement.parentElement.remove();
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);

    showAlert("success", "Kitap Başarıyla Silindi...");
  }
}

function deleteTodoFromStorage(deleteTodo) {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo, index) {
    if (todo === deleteTodo) {
      todos.splice(index, 1); // Arrayden değeri silme
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}

function addTodo(e) {
  const newTodo = todoInput.value.trim();
  let todos = getTodosFromStorage();
  if (newTodo === "") {
    showAlert("danger", "Lütfen Bir Kitap Girin...");
  } else if (todos.indexOf(newTodo) === -1) {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);

    showAlert("success", "Kitap Başarıyla Eklendi...");
  } else {
    showAlert("warning", "Bu Kitap Zaten Kayıtlı...");
  }

  e.preventDefault();
}

function getTodosFromStorage() {
  // Storagedan bütün todoları alma
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();

  todos.push(newTodo);

  localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message) {
  const alert = document.createElement("div");

  alert.className = `alert alert-${type}`;

  alert.textContent = message;

  firstcardBody.appendChild(alert);

  // SetTimeout
  setTimeout(function () {
    alert.remove();
  }, 1000);
}

function addTodoToUI(newTodo) {
  // String Değerini list item olarak ekleyecek
  // <!-- <li class="list-group-item d-flex justify-content-between">
  //                         Todo 1
  //                         <a href = "#" class ="delete-item">
  //                             <i class = "fa fa-remove"></i>
  //                         </a>
  //                     </li>-->
  // List item oluşturma
  const listItem = document.createElement("li");
  const link = document.createElement("a");

  // Link oluşturma
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class = 'fa fa-remove'></i>";

  listItem.className = "list-group-item d-flex justify-content-between";

  // Text node Ekleme
  listItem.appendChild(document.createTextNode(newTodo));
  listItem.appendChild(link);

  // Todo liste list itemi ekleme
  todoList.appendChild(listItem);
  todoInput.value = "";
}
