let dinoImage; // Declare a variable for the dinosaur image

function loadDinoImage() {
    dinoImage = new Image();
    dinoImage.src = 'images/dino.png'; // Set the source to your dinosaur image path
}

function drawDino() {
    if (dinoImage) {
        ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    canvas.width = 800;
    canvas.height = 400;

    let dino, gravity, obstacle, score, jumping, gameStarted;

    function resetGame() {
        dino = { height: 40, width: 40, x: 50, y: canvas.height - 40, vel: 0 };
        gravity = 1;
        obstacle = { width: 20, height: getRandomInt(20, 70), x: canvas.width };
        score = 0;
        jumping = false;
        gameStarted = false; // Ensure game is marked as not started
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for a fresh start
    }

    function initializeGame() {
        resetGame(); // Reset or initialize game variables
        startButton.innerText = "Start Game"; // Set button text to "Start Game"
        startButton.onclick = startGame; // Assign startGame function to onclick event of the button
    }

    function startGame() {
        if (!gameStarted) {
            gameStarted = true;
            startButton.innerText = "Jump"; // Change button text to "Jump"
            updateGame();
        } else {
            jump();
        }
    }

    function jump() {
        if (gameStarted && !jumping) {
            jumping = true;
            dino.vel = -15;
        }
    }

    function updateGame() {
        if (!gameStarted) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas on each frame

        // Update dino position
        if (jumping) {
            dino.y += dino.vel;
            dino.vel += gravity;
            if (dino.y > canvas.height - dino.height) {
                dino.y = canvas.height - dino.height;
                jumping = false;
            }
        }

        // Update obstacle position
        obstacle.x -= 7;
        if (obstacle.x < -obstacle.width) {
            obstacle.x = canvas.width;
            obstacle.height = getRandomInt(20, 70);
        }

        drawDino();
        drawObstacle();
        displayScore();

        if (checkCollision()) {
            gameEnded("Game Over!");
            return;
        } else if (score >= 1000) {
            gameEnded("You Win!", "green");
            return;
        }

        score++;
        requestAnimationFrame(updateGame);
    }

    function gameEnded(message, color = "red") {
        displayMessage(message, color);
        gameStarted = false;
        startButton.innerText = "Restart";
        startButton.onclick = initializeGame; // Re-assign onclick event to re-initialize the game
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function drawDino() {
        ctx.fillStyle = 'black';
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    }

    function drawObstacle() {
        ctx.fillStyle = 'black';
        ctx.fillRect(obstacle.x, canvas.height - obstacle.height, obstacle.width, obstacle.height);
    }

    function checkCollision() {
        return dino.x < obstacle.x + obstacle.width &&
               dino.x + dino.width > obstacle.x &&
               dino.y + dino.height > canvas.height - obstacle.height;
    }

    function displayScore() {
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "right";
        ctx.fillText(`Score: ${score}`, canvas.width - 10, 30);
    }

    function displayMessage(message, color) {
        ctx.font = "40px Arial";
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && gameStarted) {
            jump();
        }
    });

    loadDinoImage(); // Make sure to load the image when the document is ready

    initializeGame(); // Initialize game when DOM is fully loaded
});





