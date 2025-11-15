const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let supernovas = [];
let comets = [];
let shootingStars = [];

// Config
const STAR_COUNT = 800;
const SUPERNOVA_COUNT = 5;
const COMET_CHANCE = 0.003;
const SHOOTING_STAR_CHANCE = 0.002;

// ===== ESTRELAS =====
function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.2,
            speedY: Math.random() * 0.02,   // queda suave
            opacity: Math.random() * 0.9 + 0.1,
            opacityDir: Math.random() < 0.5 ? 0.01 : -0.01,
            color: `rgba(${168 + Math.random()*50}, ${85 + Math.random()*50}, ${247 + Math.random()*50}, 1)`
        });
    }
}

// ===== SUPERNOVAS =====
function createSupernovas() {
    supernovas = [];
    for (let i = 0; i < SUPERNOVA_COUNT; i++) {
        supernovas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            baseSize: 2 + Math.random() * 3,
            pulse: Math.random() * 0.05 + 0.01,
            opacity: 0
        });
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

// ===== ESTRELAS CADENTES =====
function spawnShootingStar() {
    shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        length: 20 + Math.random() * 30,
        speed: 8 + Math.random() * 4,
        angle: Math.random() * 0.3 + 0.1
    });
}

// ===== DRAW =====
function drawStars() {
    for (let star of stars) {
        star.opacity += star.opacityDir;
        if (star.opacity <= 0.1 || star.opacity >= 0.9) star.opacityDir *= -1;

        ctx.fillStyle = star.color.replace("1)", star.opacity.toFixed(2) + ")");
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI*2);
        ctx.fill();

        star.y += star.speedY;
        if (star.y > canvas.height) star.y = 0;
    }
}

function drawSupernovas() {
    for (let sn of supernovas) {
        sn.opacity += sn.pulse;
        if (sn.opacity > 1 || sn.opacity < 0) sn.pulse *= -1;
        let size = sn.baseSize + sn.opacity * 4;
        ctx.fillStyle = `rgba(255, 200, 255, ${sn.opacity.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(sn.x, sn.y, size, 0, Math.PI*2);
        ctx.fill();
    }
}

function drawComets() {
    for (let i = comets.length-1; i>=0; i--) {
        let comet = comets[i];

        comet.tail.push({x: comet.x, y: comet.y});
        if (comet.tail.length > 40) comet.tail.shift();

        for (let j = 0; j < comet.tail.length; j++) {
            let t = comet.tail[j];
            let alpha = j / comet.tail.length;
            ctx.fillStyle = `rgba(255, 200, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(t.x, t.y, 2 + alpha*3, 0, Math.PI*2);
            ctx.fill();
        }

        ctx.fillStyle = "rgba(255, 230, 255, 1)";
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size+2, 0, Math.PI*2);
        ctx.fill();

        comet.x += comet.speed;
        comet.y += comet.speed * comet.angle;

        if (comet.x > canvas.width + 100) comets.splice(i,1);
    }

    if (Math.random() < COMET_CHANCE) spawnComet();
}

function drawShootingStars() {
    for (let i = shootingStars.length-1; i>=0; i--) {
        let s = shootingStars[i];
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.length*s.angle, s.y + s.length*s.angle);
        ctx.stroke();

        s.x += s.speed;
        s.y += s.speed * s.angle;

        if (s.x > canvas.width || s.y > canvas.height) shootingStars.splice(i,1);
    }

    if (Math.random() < SHOOTING_STAR_CHANCE) spawnShootingStar();
}

// ===== LOOP PRINCIPAL =====
function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawStars();
    drawSupernovas();
    drawComets();
    drawShootingStars();
    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

createStars();
createSupernovas();
animate();
