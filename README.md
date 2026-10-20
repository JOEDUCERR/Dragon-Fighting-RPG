## Dragon-Fighting RPG

A simple web-based RPG game where players battle dragons. The project includes the main game files and a local server for testing.

### Branch Information
This project is on a separate branch. To work on this branch:
1. Clone the repository
2. Checkout the branch using `git checkout <branch-name>`

### Getting Started
1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory
3. Checkout the branch: `git checkout <branch-name>`

### How to Run
1. Start the server: `python3 -m http.server 8787 --bind 127.0.0.1`
2. Access the game at http://127.0.0.1:8787

### Testing Instructions
- Before first use, clear localStorage: `localStorage.removeItem("dragonRpgSave")`

### Notes
- The server may restart automatically. Ensure the command is running.
- For testing, make sure to clear localStorage as mentioned above.