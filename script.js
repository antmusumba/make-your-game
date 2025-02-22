// Paddle
const paddle = {
    width: 75,
    height: 10,
    x: (480 - 75) / 2,
    speed: 6,
    dx: 0
};

// Ball
const ball = {
    x: 480 / 2,
    y: 320 - 30,
    radius: 7,
    speed: 4,
    dx: 3,
    dy: -3
};

// Bricks
const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 60;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 20;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

let score = 0;
let lives = 3;

let isPaused = false;
let startTime = Date.now();
let timer = 0;

// Event Listeners
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        paddle.dx = paddle.speed;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        paddle.dx = -paddle.speed;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "Left" || e.key === "ArrowLeft") {
        paddle.dx = 0;
    }
}

// Move paddle
function movePaddle() {
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > 480) paddle.x = 480 - paddle.width;
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > 480) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (
        ball.y + ball.radius > 320 - paddle.height &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        ball.dy *= -1;
    }

    // Brick collision
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let brick = bricks[c][r];
            if (brick.status === 1) {
                if (
                    ball.x > brick.x &&
                    ball.x < brick.x + brickWidth &&
                    ball.y > brick.y &&
                    ball.y < brick.y + brickHeight
                ) {
                    ball.dy *= -1;
                    brick.status = 0;
                    score += 10;
                    if (score === brickRowCount * brickColumnCount * 10) {
                        alert("YOU WIN!");
                        document.location.reload();
                    }
                }
            }
        }
    }

    // Ball falls below paddle
    if (ball.y + ball.radius > 320) {
        lives--;
        if (lives === 0) {
            alert("Game Over!");
            document.location.reload();
        } else {
            resetBall();
        }
    }
}

function resetBall() {
    ball.x = 480 / 2;
    ball.y = 320 - 30;
    ball.dx = 3;
    ball.dy = -3;
}

// Draw paddle
function drawPaddle() {
    const paddleElement = document.getElementById("paddle");
    paddleElement.style.left = paddle.x + "px";
    paddleElement.style.bottom = "0px"; // Position at the bottom
}

// Draw ball
function drawBall() {
    const ballElement = document.getElementById("ball");
    ballElement.style.left = ball.x + "px";
    ballElement.style.bottom = ball.y + "px"; // Position based on ball's Y coordinate
}

// Function to create bricks dynamically
function createBricks() {
    const gameContainer = document.getElementById("game-container");
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = document.createElement("div");
            brick.style.width = brickWidth + "px";
            brick.style.height = brickHeight + "px";
            brick.style.background = "red";
            brick.style.position = "absolute";
            brick.style.left = (c * (brickWidth + brickPadding) + brickOffsetLeft) + "px";
            brick.style.top = (r * (brickHeight + brickPadding) + brickOffsetTop) + "px";
            gameContainer.appendChild(brick);
            bricks[c][r].x = c * (brickWidth + brickPadding) + brickOffsetLeft;
            bricks[c][r].y = r * (brickHeight + brickPadding) + brickOffsetTop;
        }
    }
}

// Draw Score
function drawScore() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = score;
}

function drawLives() {
    const livesElement = document.getElementById("lives");
    livesElement.textContent = lives;
}

// Draw Timer
function drawTimer() {
    const timerElement = document.getElementById("timer");
    timerElement.textContent = timer;
}

// Draw everything
function draw() {
    drawPaddle();
    drawBall();
    drawScore();
    drawLives();
    drawTimer();
}

// Update game state
function update() {
    movePaddle();
    moveBall();
}

// Function to pause the game
function pauseGame() {
    isPaused = true;
    document.getElementById("pause-menu").style.display = "block";
}

function continueGame() {
    isPaused = false;
    document.getElementById("pause-menu").style.display = "none";
}

// Function to restart the game
function restartGame() {
    score = 0;
    lives = 3;
    resetBall();
    startTime = Date.now(); // Reset timer
    continueGame();
}

// Add event listeners for pause and restart
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") { // Press Escape to pause
        pauseGame();
    } else if (e.key === "R") { // Press R to restart
        restartGame();
    } else if (e.key === "C") { // Press C to continue
        continueGame();
    }
});

function gameLoop() {
    if (!isPaused) {
        update();
        draw();
        timer = Math.floor((Date.now() - startTime) / 1000); // Update timer every frame
    }
    requestAnimationFrame(gameLoop);
}

// Start the game after the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    createBricks(); // Create bricks after the DOM is loaded
    requestAnimationFrame(gameLoop); // Start the game loop
});
