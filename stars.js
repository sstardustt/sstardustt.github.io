const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== CAMADAS DE ESTRELAS =====
let layers = [
    {stars: [], speed: 0.01, count: 400}, 
    {stars: [], speed: 0.03, count: 300}, 
    {stars: [], speed: 0.06, count: 100}  
];

// ===== COMETAS =====
let comets = [];
const MAX_COMETS = 1; // 1 por vez
const COMET_CHANCE = 0.02;

// ===== NEBULOSAS =====
let nebulas = [];
const NEBULA_COUNT = 8;

// ===== FUNÇÕES DE CRIAÇÃO =====
function createStars() {
    for (let layer of layers) {
        layer.stars = [];
        for (let i = 0; i < layer.count; i++) {
            const r = 160 + Math.random() * 40;
            const g = 80 + Math.random() * 40;
            const b = 240 + Math.random() * 40;
            layer.stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.2,
                opacity: Math.random() * 0.9 + 0.1,
                opacityDir: Math.random() < 0.5 ? 0.01 : -0.01,
                color: `rgba(${r}, ${g}, ${b}, 1)`
            });
        }
    }
}

function createNebulas() {
    nebulas = [];
    for (let i = 0; i < NEBULA_COUNT; i++) {
        nebulas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 100 + Math.random() * 300,
            color: `rgba(${168 + Math.random()*50}, ${85 + Math.random()*50}, ${247 + Math.random()*50}, 0.05)`,
            speedX: (Math.random()-0.5)*0.01,
            speedY: (Math.random()-0.5)*0.01
        });
    }
}

function spawnComet() {
    if (comets.length >= MAX_COMETS) return;

    let directions = ["left-to-right", "right-to-left", "top-to-bottom", "bottom-to-top"];
    let dir = directions[Math.floor(Math.random() * directions.length)];

    let comet = { tail: [], size: 2 + Math.random()*2, speed: 3 + Math.random()*2 };

    if(dir === "left-to-right") {
        comet.x = -50;
        comet.y = Math.random() * canvas.height * 0.6;
        comet.angleX = comet.speed;
        comet.angleY = comet.speed * (0.1 + Math.random()*0.3);
    } else if(dir === "right-to-left") {
        comet.x = canvas.width + 50;
        comet.y = Math.random() * canvas.height * 0.6;
        comet.angleX = -comet.speed;
        comet.angleY = comet.speed * (0.1 + Math.random()*0.3);
    } else if(dir === "top-to-bottom") {
        comet.x = Math.random() * canvas.width;
        comet.y = -50;
        comet.angleX = comet.speed * (Math.random()*0.2 - 0.1);
        comet.angleY = comet.speed;
    } else if(dir === "bottom-to-top") {
        comet.x = Math.random() * canvas.width;
        comet.y = canvas.height + 50;
        comet.angleX = comet.speed * (Math.random()*0.2 - 0.1);
        comet.angleY = -comet.speed;
    }

    comets.push(comet);
}

// ===== FUNÇÕES DE DESENHO =====
function drawStars() {
    for (let layer of layers) {
        for (let star of layer.stars) {
            star.opacity += star.opacityDir;
            if (star.opacity <= 0.1 || star.opacity >= 0.9) star.opacityDir *= -1;

            ctx.fillStyle = star.color.replace("1)", star.opacity.toFixed(2) + ")");
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI*2);
            ctx.fill();

            star.x -= layer.speed;
            if (star.x < 0) star.x = canvas.width;
        }
    }
}

function drawNebulas() {
    for (let neb of nebulas) {
        let gradient = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.radius);
        gradient.addColorStop(0, "rgba(168,85,247,0.2)");
        gradient.addColorStop(0.5, "rgba(168,85,247,0.08)");
        gradient.addColorStop(1, "rgba(168,85,247,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, neb.radius, 0, Math.PI*2);
        ctx.fill();

        neb.x += neb.speedX;
        neb.y += neb.speedY;
        if (neb.x < -neb.radius) neb.x = canvas.width + neb.radius;
        if (neb.x > canvas.width + neb.radius) neb.x = -neb.radius;
        if (neb.y < -neb.radius) neb.y = canvas.height + neb.radius;
        if (neb.y > canvas.height + neb.radius) neb.y = -neb.radius;
    }
}

function drawComets() {
    for (let i = comets.length-1; i>=0; i--) {
        let comet = comets[i];

        comet.tail.push({x: comet.x, y: comet.y});
        if (comet.tail.length > 40) comet.tail.shift();

        // Tail: maior no núcleo, menor na ponta + fade
        for (let j = 0; j < comet.tail.length; j++) {
            let t = comet.tail[j];
            let alpha = 1 - j / comet.tail.length;
            let radius = (comet.tail.length - j) / comet.tail.length * 4;
            ctx.fillStyle = `rgba(255,180,255,${alpha})`;
            ctx.beginPath();
            ctx.arc(t.x, t.y, radius, 0, Math.PI*2);
            ctx.fill();
        }

        // Núcleo radial
        let gradient = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, comet.size+5);
        gradient.addColorStop(0, "rgba(255,230,255,1)");
        gradient.addColorStop(0.5, "rgba(200,200,255,0.8)");
        gradient.addColorStop(1, "rgba(255,180,255,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size+5, 0, Math.PI*2);
        ctx.fill();

        comet.x += comet.angleX;
        comet.y += comet.angleY;

        if(comet.x < -100 || comet.x > canvas.width + 100 || comet.y < -100 || comet.y > canvas.height + 100) {
            comets.splice(i,1);
        }
    }

    if(Math.random() < COMET_CHANCE) spawnComet();
}

// ===== LOOP PRINCIPAL =====
function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawNebulas();
    drawStars();
    drawComets();
    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

createStars();
createNebulas();
animate();
