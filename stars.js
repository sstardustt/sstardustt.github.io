const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
const STAR_COUNT = 1000;

// Cometas
let comets = [];
const COMET_CHANCE = 0.005; // chance de spawn por frame

// ===== ESTRELAS =====
function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.8 + 0.2,
            speedY: Math.random() * 0.02,   // queda leve
            opacity: Math.random() * 0.9 + 0.1,
            opacityDir: Math.random() < 0.5 ? 0.01 : -0.01, // piscar
            color: `rgba(${168 + Math.random()*50}, ${85 + Math.random()*50}, ${247 + Math.random()*50}, 1)`
        });
    }
}

function drawStars() {
    for (let star of stars) {
        // Piscar
        star.opacity += star.opacityDir;
        if (star.opacity <= 0.1 || star.opacity >= 0.9) star.opacityDir *= -1;

        ctx.fillStyle = star.color.replace("1)", star.opacity.toFixed(2) + ")");
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Queda suave
        star.y += star.speedY;
        if (star.y > canvas.height) star.y = 0;
    }
}

// ===== COMETAS =====
function spawnComet() {
    comets.push({
        x: -50,
        y: Math.random() * canvas.height * 0.6,
        size: 2 + Math.random() * 2,
        speed: 3 + Math.random() * 2,
        angle: 0.2 + Math.random() * 0.3,
        tail: []
    });
}

function drawComets() {
    for (let i = comets.length -1; i >=0; i--) {
        let comet = comets[i];

        // adiciona ponto na cauda
        comet.tail.push({ x: comet.x, y: comet.y });
        if (comet.tail.length > 40) comet.tail.shift();

        // desenha cauda
        for (let j = 0; j < comet.tail.length; j++) {
            let t = comet.tail[j];
            let alpha = j / comet.tail.length;
            ctx.fillStyle = `rgba(255, 200, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(t.x, t.y, 2 + alpha*3, 0, Math.PI*2);
            ctx.fill();
        }

        // cometa
        ctx.fillStyle = "rgba(255, 230, 255, 1)";
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size + 2, 0, Math.PI*2);
        ctx.fill();

        // movimento
        comet.x += comet.speed;
        comet.y += comet.speed * comet.angle;

        // se saiu da tela
        if (comet.x > canvas.width + 100) comets.splice(i,1);
    }

    // chance de spawn
    if (Math.random() < COMET_CHANCE) spawnComet();
}

// ===== LOOP PRINCIPAL =====
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawComets();
    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

createStars();
animate();
