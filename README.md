## Discription of Project

Dynamic Voting Widget
A simple JavaScript widget for managing and voting on ideas. Users can add, edit, delete, and vote on idea cards, with drag-and-drop reordering and local storage.

## About the project

The Dynamic Voting Widget lets users create and manage idea cards with titles, descriptions, images, and links. It supports upvoting/downvoting, sorting by votes, and reordering cards. Data is fetched from an API initially and saved locally.
Features

Add, edit, delete idea cards
Upvote and downvote ideas
Sort cards by votes
Drag-and-drop card reordering
Local storage for persistence
Responsive design
Modals for editing and deleting

## Technologies

HTML
CSS
JavaScript (vanilla)
Browser APIs (localStorage, Fetch, Drag and Drop)

## Installation

Clone the repository:git clone https://github.com/Integritistudio/dynamic-voting-widget.git
cd dynamic-voting-widget


Open index.html in a browser or serve it with a local server (e.g., Live Server in VS Code).

## Usage

Add Idea: Click "Add New Idea", fill in details, and save.
Edit/Delete: Use "Edit" or "Delete" buttons on cards.
Vote: Click thumbs-up (👍) or thumbs-down (👎).
Sort/Reset: Click "Sort by Votes" or "Reset All".
Reorder: Drag and drop cards.

To embed in your HTML:
<div id="beastscan-widget"></div>
<script src="widget.js"></script>
<script>
    initBeastScanWidget({ containerId: 'beastscan-widget' });
</script>

## Contact

GitHub: Integritistudio
Email: developers@integriti.io

