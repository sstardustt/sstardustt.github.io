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
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
});

// ===== COMETA =====
let comet = {
    x: -200,
    y: Math.random() * canvas.height * 0.6,
    size: 2,
    speed: 4,
    tail: []
};

function resetComet() {
    comet.x = -200;
    comet.y = Math.random() * canvas.height * 0.6;
    comet.tail = [];
}

function drawComet() {
    comet.tail.push({ x: comet.x, y: comet.y });

    if (comet.tail.length > 40) {
        comet.tail.shift();
    }

    for (let i = 0; i < comet.tail.length; i++) {
        let t = comet.tail[i];
        let alpha = i / comet.tail.length;
        ctx.fillStyle = `rgba(255, 200, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2 + alpha * 3, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = "rgba(255, 230, 255, 1)";
    ctx.beginPath();
    ctx.arc(comet.x, comet.y, comet.size + 2, 0, Math.PI * 2);
    ctx.fill();

    comet.x += comet.speed;
    comet.y += 0.4;

    if (comet.x > canvas.width + 300) {
        setTimeout(resetComet, 4000 + Math.random() * 4000);
    }
}

// ===== Loop principal =====
function drawStarsAndComet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // limpa o canvas
    drawStars();   // desenha todas as estrelas
    drawComet();   // desenha o cometa
    requestAnimationFrame(drawStarsAndComet); // loop único
}

createStars();
drawStarsAndComet();
