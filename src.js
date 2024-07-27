const state = {
  taskList: [],
};

const modalContainer = document.querySelector(".open_task_modal");
const cardContainer = document.querySelector(".card_section");

const newCard = ({ id, title, description, url }) => `
          <div class="m-2 shadow-lg" id = "${id}">
          <div class="card p-3" style="width: 22rem;">
            <div
              class="header d-flex justify-content-between align-items-center"
            >
              <h5 class="card-title text-primary fs-4 mt-2 text-start">
                ${title}
              </h5>
              <div class="card_top d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-outline-success"  id = "${id}" onclick = "editCard()">
                  <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button type="button" class="btn btn-outline-danger"  id = "${id}"  onclick = "deleteCard()">
                  <i class="fa-solid fa-trash" name= "${id}"></i>
                </button>
              </div>
            </div>
            <hr />
            <img
              src = "${
                url
                  ? url
                  : "https://imgs.search.brave.com/Zk7Fn5dawWZroXzNsBpDoB9SlYew6Osku-Q4f4yUTGM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZGlnaXRhbGNpdGl6/ZW4ubGlmZS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMC8xMC9w/aG90b19nYWxsZXJ5/LmpwZw"
              }"
              class="card-img-top"
              alt="..."
              aria-required="true"
            />
            <div class="card-body">
              <p class="card-text">
                ${description}
              </p>
              <a
                href="#"
                class="btn btn-outline-primary"
                data-bs-toggle="modal"
                data-bs-target="#showTask"
                id = "${id}"
                onclick = "openCreatedCard()"
                >Open Task</a
              >
            </div>
          </div>
        </div>
`;

// Dynamic modals(cards) on our home page/ui
const openCardModal = ({ id, title, description, url }) => {
  

  return `
            <div id = "${id}">
            <img
                  class="open_task_img"
                  src="${
                    url
                      ? url
                      : "https://imgs.search.brave.com/Zk7Fn5dawWZroXzNsBpDoB9SlYew6Osku-Q4f4yUTGM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZGlnaXRhbGNpdGl6/ZW4ubGlmZS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMC8xMC9w/aG90b19nYWxsZXJ5/LmpwZw"
                  }"
                  class="card-img-top img-fluid"
                  alt="..."
                  aria-required="true"
                />
                <hr />
                <div class="d-flex flex-column gap-2">
                  
                <h1 class="text-primary fs-4">${title}</h1>
                <p class="text-center text-muted">${description}</p>
                </div>
                </div>
       `;
};

// here we will be updating our local storage (i.e., the modals/cards which we see on our ui)

const saveCard = () => {
  localStorage.setItem("tasky03", JSON.stringify({ tasks: state.taskList }));
};

function displayCards() {
  const cards = JSON.parse(localStorage.getItem("tasky03")) || { tasks: [] };
  if (cards) state.taskList = cards.tasks;
  state.taskList.map((cardData) => {
    cardContainer.insertAdjacentHTML("beforeend", newCard(cardData));
  });
}

const handleSubmit = () => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageUrl").value,
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
  };

  if (input.title === "" || input.description === "") {
    return alert("Please fill all the fields to get the card !");
  }

  cardContainer.insertAdjacentHTML(
    "beforeend",
    newCard({
      ...input,
      id,
    })
  );

  state.taskList.push({ ...input, id });
  saveCard();
  document.getElementById("imageUrl").value = "";
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
};

const openCreatedCard = (event) => {
  if (!event) event = window.event; // As we did not pass any parameter event in the method while calling it on the btn 'Open Task'
  let getCardData = state.taskList.find(({ id }) => id === event.target.id);
  modalContainer.innerHTML = openCardModal(getCardData);
};

const deleteCard = (event) => {
  if (!event) event = window.event;
  const targetId = event.target.closest(".m-2").id;
  state.taskList = state.taskList.filter(({ id }) => id !== targetId);
  saveCard();
  const cardElement = document.getElementById(targetId);
  cardContainer.removeChild(cardElement);
};

const editCard = (event) => {
  if (!event) event = window.event;
  const parentNode = event.target.closest(".m-2");
  const taskTitle = parentNode.querySelector(".card-title");
  const taskDescription = parentNode.querySelector(".card-text");
  const submitBtn = parentNode.querySelector(".btn-outline-primary");

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  submitBtn.setAttribute("onclick", "saveEdit(event)");
  submitBtn.removeAttribute("data-bs-toggle");
  submitBtn.removeAttribute("data-bs-target");
  submitBtn.innerText = "Save Changes";
};

const saveEdit = (e) => {
  if (!e) e = window.event;
  const parentNode = e.target.closest(".m-2");
  const targetID = parentNode.id;
  const taskTitle = parentNode.querySelector(".card-title");
  const taskDescription = parentNode.querySelector(".card-text");
  const submitBtn = parentNode.querySelector(".btn-outline-primary");

  const updatedData = {
    title: taskTitle.innerHTML,
    description: taskDescription.innerHTML,
  };

  state.taskList = state.taskList.map((task) =>
    task.id === targetID
      ? {
          ...task,
          title: updatedData.title,
          description: updatedData.description,
        }
      : task
  );

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  saveCard();
  submitBtn.setAttribute("onclick", "openCreatedCard(event)");
  submitBtn.setAttribute("data-bs-toggle", "modal");
  submitBtn.setAttribute("data-bs-target", "#showTask");
  submitBtn.innerHTML = "Open Task";
};

const searchTask = (e) => {
  if (!e) e = window.event;

  while (cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.firstChild);
  }

  const resultData = state.taskList.filter(({ title }) =>
    title.toLowerCase().includes(e.target.value.toLowerCase())
  );

  resultData.map((cardData) =>
    cardContainer.insertAdjacentHTML("beforeend", newCard(cardData))
  );
};
