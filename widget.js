(function () {
    // Widget initialization function
    window.initBeastScanWidget = function (config = {}) {
        const containerId = config.containerId || 'beastscan-widget';
        const targetContainer = document.getElementById(containerId);

        if (!targetContainer) {
            console.error(`BeastScan Widget: Container with ID "${containerId}" not found.`);
            return;
        }

        // Inject widget HTML
        targetContainer.innerHTML = `
            <div id="beastscan-widget-root">
                <div class="controls card-container">
                    <div class="controls-left">
                        <button onclick="window.sortCards()">Sort by Votes</button>
                        <button onclick="window.resetCards()">Reset All</button>
                    </div>
                    <div class="controls-right">
                        <button class="add-idea-btn" onclick="window.openAddModal()">Add New Idea</button>
                    </div>
                </div>
                <div class="card-container" id="cardContainer"></div>
                <div class="modal" id="editModal">
                    <div class="modal-content">
                        <h3 id="modalTitle">Edit Card</h3>
                        <input type="text" id="editTitle" placeholder="Title" />
                        <textarea id="editDesc" placeholder="Description"></textarea>
                        <input type="text" id="editImage" placeholder="Image URL" />
                        <input type="text" id="editLabel" placeholder="Button Label" />
                        <input type="text" id="editURL" placeholder="Button URL" />
                        <div class="modal-buttons">
                            <button onclick="window.saveEdit()">Save</button>
                            <button onclick="window.closeModal()">Cancel</button>
                        </div>
                    </div>
                </div>
                <div class="modal" id="deleteModal">
                    <div class="modal-content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this idea?</p>
                        <div class="modal-buttons">
                            <button onclick="window.confirmDelete()">Delete</button>
                            <button onclick="window.closeDeleteModal()">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Inject CSS
        const style = document.createElement('style');
        style.textContent = `
            #beastscan-widget-root {
                font-family: Arial, sans-serif;
                background: #f2f2f2;
                padding: 20px;
            }
            #beastscan-widget-root .controls.card-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
            }
            #beastscan-widget-root .controls-left {
                display: flex;
                gap: 10px;
            }
            #beastscan-widget-root .controls-left button {
                padding: 8px 12px;
                cursor: pointer;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                transition: background 0.3s, transform 0.2s;
            }
            #beastscan-widget-root .controls-left button:hover {
                background: #218838;
                transform: scale(1.05);
            }
            #beastscan-widget-root .controls-left button:active {
                transform: scale(0.95);
            }
            #beastscan-widget-root .controls-right .add-idea-btn {
                padding: 10px 20px;
                cursor: pointer;
                background: #007bff;
                color: white;
                border: 2px solid #0056b3;
                border-radius: 6px;
                font-size: 16px;
                font-weight: bold;
                transition: background 0.3s, transform 0.2s;
            }
            #beastscan-widget-root .controls-right .add-idea-btn:hover {
                background: #0056b3;
                transform: scale(1.05);
            }
            #beastscan-widget-root .controls-right .add-idea-btn:active {
                transform: scale(0.95);
            }
            #beastscan-widget-root .card-container {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                max-width: 1200px;
                margin: 0 auto;
            }
            #beastscan-widget-root .card {
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 20px;
                width: calc(33% - 50px);
                position: relative;
                cursor: move;
            }
            #beastscan-widget-root .card img {
                width: 100%;
                border-radius: 6px;
            }
            #beastscan-widget-root .card h3 {
                margin: 10px 0 5px;
            }
            #beastscan-widget-root .card p {
                font-size: 14px;
                color: #555;
            }
            #beastscan-widget-root .vote-buttons {
                display: flex;
                align-items: center;
                gap: 12px;
                margin: 10px 0;
            }
            #beastscan-widget-root .vote-buttons button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 1px solid #ddd;
                background: #f8f9fa;
                cursor: pointer;
                font-size: 18px;
                color: #333;
                transition: background 0.3s, color 0.3s, transform 0.2s, box-shadow 0.3s;
                padding: 0;
            }
            #beastscan-widget-root .vote-buttons button.upvote-btn:hover {
                background: #007bff;
                color: #fff;
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
            }
            #beastscan-widget-root .vote-buttons button.downvote-btn:hover {
                background: #dc3545;
                color: #fff;
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
            }
            #beastscan-widget-root .vote-buttons button:active {
                transform: scale(0.95);
            }
            #beastscan-widget-root .vote-buttons span {
                font-size: 16px;
                font-weight: 500;
                color: #333;
                margin-left: 8px;
            }
            #beastscan-widget-root .action-buttons {
                margin-top: 10px;
                display: flex;
                justify-content: left;
                gap: 8px;
                align-items: center;
            }
            #beastscan-widget-root .action-buttons button,
            #beastscan-widget-root .action-buttons a {
                padding: 8px 12px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                text-decoration: none;
                color: #fff;
                transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
            }
            #beastscan-widget-root .edit-btn {
                background: #f0ad4e;
            }
            #beastscan-widget-root .edit-btn:hover {
                background: #e0a800;
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(240, 173, 78, 0.3);
            }
            #beastscan-widget-root .edit-btn:active {
                transform: scale(0.95);
            }
            #beastscan-widget-root .delete-btn {
                background: #ff4444;
            }
            #beastscan-widget-root .delete-btn:hover {
                background: #cc0000;
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
            }
            #beastscan-widget-root .delete-btn:active {
                transform: scale(0.95);
            }
            #beastscan-widget-root .redirect-btn {
                background: #0275d8;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            #beastscan-widget-root .redirect-btn:hover {
                background: #015ca0;
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(2, 117, 216, 0.3);
            }
            #beastscan-widget-root .redirect-btn:active {
                transform: scale(0.95);
            }
            #beastscan-widget-root .modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease-out;
            }
            #beastscan-widget-root .modal-content {
                background: #fff;
                padding: 24px;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                animation: scaleIn 0.3s ease-out;
                position: relative;
            }
            #beastscan-widget-root #editModal .modal-content {
                max-width: 600px;
            }
            #beastscan-widget-root #deleteModal .modal-content {
                max-width: 400px;
            }
            #beastscan-widget-root .modal-content h3 {
                margin: 0 0 20px;
                font-size: 24px;
                font-weight: 600;
                color: #333;
                text-align: center;
            }
            #beastscan-widget-root .modal-content p {
                margin: 0 0 20px;
                font-size: 16px;
                color: #555;
                text-align: center;
            }
            #beastscan-widget-root .modal-content input,
            #beastscan-widget-root .modal-content textarea {
                width: 100%;
                padding: 12px;
                margin: 10px 0;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                color: #333;
                background: #f9f9f9;
                transition: border-color 0.3s, box-shadow 0.3s;
                box-sizing: border-box;
            }
            #beastscan-widget-root .modal-content input:focus,
            #beastscan-widget-root .modal-content textarea:focus {
                border-color: #007bff;
                box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
                outline: none;
                background: #fff;
            }
            #beastscan-widget-root .modal-content textarea {
                min-height: 100px;
                resize: vertical;
            }
            #beastscan-widget-root .modal-content .modal-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                margin-top: 20px;
            }
            #beastscan-widget-root .modal-content button {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.3s, transform 0.2s;
            }
            #beastscan-widget-root #editModal .modal-content button:first-child {
                background: #007bff;
                color: white;
            }
            #beastscan-widget-root #editModal .modal-content button:first-child:hover {
                background: #0056b3;
                transform: scale(1.05);
            }
            #beastscan-widget-root #editModal .modal-content button:last-child {
                background: #6c757d;
                color: white;
            }
            #beastscan-widget-root #editModal .modal-content button:last-child:hover {
                background: #5a6268;
                transform: scale(1.05);
            }
            #beastscan-widget-root #deleteModal .modal-content button:first-child {
                background: #dc3545;
                color: white;
            }
            #beastscan-widget-root #deleteModal .modal-content button:first-child:hover {
                background: #c82333;
                transform: scale(1.05);
            }
            #beastscan-widget-root #deleteModal .modal-content button:last-child {
                background: #6c757d;
                color: white;
            }
            #beastscan-widget-root #deleteModal .modal-content button:last-child:hover {
                background: #5a6268;
                transform: scale(1.05);
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // JavaScript logic
        const container = document.getElementById('cardContainer');
        const modal = document.getElementById('editModal');
        const modalTitle = document.getElementById('modalTitle');
        let allCards = [];
        let editingIndex = null;
        const localKey = 'beastscan_cards';
        let draggedIndex = null;

        async function loadCards() {
            const local = localStorage.getItem(localKey);
            if (local) {
                allCards = JSON.parse(local);
                renderCards();
            } else {
                try {
                    const res = await fetch('https://my.beastscan.com/test-kit');
                    allCards = await res.json();
                    saveToLocal();
                    renderCards();
                } catch (error) {
                    console.error('BeastScan Widget: Failed to load cards from API.', error);
                }
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
            container.innerHTML = '';
            allCards.forEach((card, index) => {
                const div = document.createElement('div');
                div.className = 'card';
                div.setAttribute('draggable', 'true');
                div.setAttribute('data-index', index);
                div.ondragstart = window.dragStart;
                div.ondragover = window.dragOver;
                div.ondrop = window.drop;

                div.innerHTML = `
                    <img src="${card.image}" alt="Card Image" />
                    <h3>${card.title}</h3>
                    <p>${card.description}</p>
                    <div class="vote-buttons">
                        <button class="upvote-btn" onclick="window.vote(${index}, 'up')" aria-label="Upvote this idea">👍</button>
                        <span>${card.votes.up}</span>
                        <button class="downvote-btn" onclick="window.vote(${index}, 'down')" aria-label="Downvote this idea">👎</button>
                        <span>${card.votes.down}</span>
                    </div>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="window.openModal(${index})">Edit</button>
                        <button class="delete-btn" onclick="window.openDeleteModal(${index})">Delete</button>
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
            modalTitle.textContent = 'Edit Card';
            document.getElementById('editTitle').value = card.title;
            document.getElementById('editDesc').value = card.description;
            document.getElementById('editImage').value = card.image;
            document.getElementById('editLabel').value = card.button.label;
            document.getElementById('editURL').value = card.button.url;
            modal.style.display = 'flex';
        }

        function openAddModal() {
            editingIndex = null;
            modalTitle.textContent = 'Add New Idea';
            document.getElementById('editTitle').value = '';
            document.getElementById('editDesc').value = '';
            document.getElementById('editImage').value = '';
            document.getElementById('editLabel').value = '';
            document.getElementById('editURL').value = '';
            modal.style.display = 'flex';
        }

        function closeModal() {
            modal.style.display = 'none';
        }

        function saveEdit() {
            const newCard = {
                title: document.getElementById('editTitle').value,
                description: document.getElementById('editDesc').value,
                image: document.getElementById('editImage').value,
                button: {
                    label: document.getElementById('editLabel').value,
                    url: document.getElementById('editURL').value,
                },
                votes: { up: 0, down: 0 }
            };

            if (editingIndex !== null) {
                allCards[editingIndex] = newCard;
            } else {
                allCards.push(newCard);
            }

            saveToLocal();
            renderCards();
            closeModal();
        }

        function openDeleteModal(index) {
            editingIndex = index;
            document.getElementById('deleteModal').style.display = 'flex';
        }

        function closeDeleteModal() {
            document.getElementById('deleteModal').style.display = 'none';
        }

        function confirmDelete() {
            allCards.splice(editingIndex, 1);
            saveToLocal();
            renderCards();
            closeDeleteModal();
        }

        function dragStart(e) {
            draggedIndex = e.target.getAttribute('data-index');
        }

        function dragOver(e) {
            e.preventDefault();
        }

        function drop(e) {
            const targetIndex = e.target.closest('.card').getAttribute('data-index');
            const draggedCard = allCards.splice(draggedIndex, 1)[0];
            allCards.splice(targetIndex, 0, draggedCard);
            saveToLocal();
            renderCards();
        }

        // Expose functions to global scope for onclick handlers
        window.vote = vote;
        window.sortCards = sortCards;
        window.resetCards = resetCards;
        window.openModal = openModal;
        window.openAddModal = openAddModal;
        window.closeModal = closeModal;
        window.saveEdit = saveEdit;
        window.openDeleteModal = openDeleteModal;
        window.closeDeleteModal = closeDeleteModal;
        window.confirmDelete = confirmDelete;
        window.dragStart = dragStart;
        window.dragOver = dragOver;
        window.drop = drop;

        // Initialize the widget
        loadCards();
    };
})();