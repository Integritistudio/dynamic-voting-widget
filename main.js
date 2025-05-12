const container = document.getElementById("cardContainer");
const modal = document.getElementById("editModal");
let allCards = [];
let editingIndex = null;
const localKey = "beastscan_cards";
let draggedIndex = null;

async function loadCards() {
    const local = localStorage.getItem(localKey);
    if (local) {
        allCards = JSON.parse(local);
        renderCards();
    } else {
        const res = await fetch("https://my.beastscan.com/test-kit");
        allCards = await res.json();
        saveToLocal();
        renderCards();
    }
}

function saveToLocal() {
    localStorage.setItem(localKey, JSON.stringify(allCards));
}

function resetCards() {
    localStorage.removeItem(localKey);
    location.reload();
}

function sortCards() {
    allCards.sort((a, b) => (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down));
    saveToLocal();
    renderCards();
}

function renderCards() {
    container.innerHTML = "";
    allCards.forEach((card, index) => {
        const div = document.createElement("div");
        div.className = "card";
        div.setAttribute("draggable", "true");
        div.setAttribute("data-index", index);
        div.ondragstart = dragStart;
        div.ondragover = dragOver;
        div.ondrop = drop;

        div.innerHTML = `
          <img src="${card.image}" alt="Card Image" />
          <h3>${card.title}</h3>
          <p>${card.description}</p>
          <div class="vote-buttons">
            <button onclick="vote(${index}, 'up')">👍 <span>${card.votes.up}</span></button>
            <button onclick="vote(${index}, 'down')">👎 <span>${card.votes.down}</span></button>
          </div>
          <div class="action-buttons">
            <button class="edit-btn" onclick="openModal(${index})">Edit</button>
            <a class="redirect-btn" href="${card.button.url}" target="_blank">${card.button.label}</a>
          </div>
        `;
        container.appendChild(div);
    });
}

function vote(index, type) {
    allCards[index].votes[type]++;
    saveToLocal();
    renderCards();
}

function openModal(index) {
    editingIndex = index;
    const card = allCards[index];
    document.getElementById("editTitle").value = card.title;
    document.getElementById("editDesc").value = card.description;
    document.getElementById("editImage").value = card.image;
    document.getElementById("editLabel").value = card.button.label;
    document.getElementById("editURL").value = card.button.url;
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

function saveEdit() {
    const card = allCards[editingIndex];
    card.title = document.getElementById("editTitle").value;
    card.description = document.getElementById("editDesc").value;
    card.image = document.getElementById("editImage").value;
    card.button.label = document.getElementById("editLabel").value;
    card.button.url = document.getElementById("editURL").value;
    saveToLocal();
    renderCards();
    closeModal();
}

function dragStart(e) {
    draggedIndex = e.target.getAttribute("data-index");
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    const targetIndex = e.target.closest(".card").getAttribute("data-index");
    const draggedCard = allCards.splice(draggedIndex, 1)[0];
    allCards.splice(targetIndex, 0, draggedCard);
    saveToLocal();
    renderCards();
}

loadCards();