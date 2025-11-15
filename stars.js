const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
const STAR_COUNT = 1000;
const SPEED = 0.05;

function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.8 + 0.2,
            speed: Math.random() * SPEED + SPEED,
            opacity: Math.random() * 0.9 + 0.1
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let star of stars) {
        ctx.fillStyle = `rgba(168, 85, 247, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // movendo sutilmente pra baixo
        star.y += star.speed;

        // reposiciona estrela que sai da tela
        if (star.y > canvas.height) {
            star.y = -2;
            star.x = Math.random() * canvas.width;
        }
    }

    requestAnimationFrame(drawStars);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
});

createStars();
drawStars();
