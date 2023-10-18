let items = [];
// const handler = document.getElementById("handler");
const table = document.getElementById("myTable");
const descInput = document.getElementById("DESC");
const idInput = document.getElementById("ID");

function loadItems() {
  items.forEach((item) => {
    let row = document.createElement("tr");
    let id = document.createElement("td");
    let description = document.createElement("td");
    id.innerHTML = item.id;
    description.innerHTML = item.descripcion;
    row.appendChild(id);
    row.appendChild(description);
    table.appendChild(row);
  });
}

function getItems() {
  fetch("http://localhost:3000/productos", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      data.forEach((row) => {
        items.push(row);
      });
      loadItems();
    });
}

function getItem(id) {
  fetch(`http://localhost:3000/productos/${id}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      items.push(data);
      loadItems();
    });
}

function addItem(descripcion) {
  fetch("http://localhost:3000/productos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      descripcion: descripcion,
    }),
  });
}

function deleteItem(id) {
  fetch(`http://localhost:3000/productos/${id}`, {
    method: "DELETE",
  });
}

function updateItem(id, descripcion) {
  fetch(`http://localhost:3000/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      descripcion: descripcion,
    }),
  });
}

function refresh() {
  items = [];
  getItems();
}

function cleanInputs() {
  idInput.value = "";
  descInput.value = "";
}

document.getElementById("Read").addEventListener("click", () => {
  table.innerHTML = "";
  const id = idInput.value;
  if (id) {
    getItem(id);
  } else {
    getItems();
  }
  cleanInputs();
  items = [];
});

document.getElementById("Create").addEventListener("click", () => {
  table.innerHTML = "";
  const descripcion = descInput.value;
  cleanInputs();
  addItem(descripcion);
  refresh();
});

document.getElementById("Delete").addEventListener("click", () => {
  table.innerHTML = "";
  const id = idInput.value;
  cleanInputs();
  deleteItem(id);
  refresh();
});

document.getElementById("Update").addEventListener("click", () => {
  table.innerHTML = "";
  const id = idInput.value;
  const descripcion = descInput.value;
  cleanInputs();
  updateItem(id, descripcion);
  refresh();
});
