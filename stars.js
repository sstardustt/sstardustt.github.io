const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== ESTRELAS (3 camadas para profundidade) =====
const STAR_LAYERS = [
    { count: 500, speed: 0.015, stars: [] },
    { count: 300, speed: 0.04, stars: [] },
    { count: 150, speed: 0.08, stars: [] }
];

// ===== NEBULOSA (brush suave + textura fractal) =====
let nebulas = [];
const NEBULA_PARTICLES = 60;

// ===== COMETA (um por vez, com tail neon) =====
let comet = null;
let cometCooldown = 0;
const COMET_CHANCE = 0.004;
const MAX_TAIL = 45;

// -------------------------------------------
// FUNÇÕES DE CRIAÇÃO
// -------------------------------------------

// Estrelas
function createStars() {
    STAR_LAYERS.forEach(layer => {
        layer.stars = [];
        for (let i = 0; i < layer.count; i++) {
            const opacity = Math.random() * 0.9 + 0.1;
            const size = Math.random() * 1.5 + 0.3;

            layer.stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size,
                opacity,
                opacityDir: Math.random() < 0.5 ? 1 : -1,
                blinkSpeed: Math.random() * 0.015 + 0.003,
                color: `rgba(200,170,255,${opacity})`
            });
        }
    });
}

// Nebulosas
function createNebula() {
    nebulas = [];

    for (let i = 0; i < NEBULA_PARTICLES; i++) {
        nebulas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 80 + Math.random() * 220,
            hue: 240 + Math.random() * 60, // roxo-azulado
            alpha: 0.05 + Math.random() * 0.12,
            driftX: (Math.random() - 0.5) * 0.08,
            driftY: (Math.random() - 0.5) * 0.08
        });
    }
}

// Cometa
function spawnComet() {
    if (comet || cometCooldown > 0) return;

    const fromLeft = Math.random() < 0.5;

    comet = {
        x: fromLeft ? -100 : canvas.width + 100,
        y: Math.random() * canvas.height * 0.6,
        direction: fromLeft ? 1 : -1,
        speed: 2 + Math.random() * 3,
        angle: (Math.random() * 0.3 - 0.15),
        size: 3 + Math.random() * 2,
        tail: []
    };

    cometCooldown = 350;
}

// -------------------------------------------
// DESENHO
// -------------------------------------------

// Nebulosas com brush suave
function drawNebulas() {
    nebulas.forEach(n => {
        // textura suave
        let gradient = ctx.createRadialGradient(
            n.x, n.y, 0,
            n.x, n.y, n.radius
        );

        gradient.addColorStop(0, `hsla(${n.hue}, 80%, 70%, ${n.alpha})`);
        gradient.addColorStop(0.4, `hsla(${n.hue}, 70%, 50%, ${n.alpha * 0.6})`);
        gradient.addColorStop(1, `hsla(${n.hue}, 80%, 40%, 0)`);

        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        // movimento suave
        n.x += n.driftX;
        n.y += n.driftY;

        // wrap de borda
        if (n.x < -300) n.x = canvas.width + 300;
        if (n.x > canvas.width + 300) n.x = -300;
        if (n.y < -300) n.y = canvas.height + 300;
        if (n.y > canvas.height + 300) n.y = -300;

        ctx.globalCompositeOperation = "source-over";
    });
}

// Estrelas com brilho suave
function drawStars() {
    STAR_LAYERS.forEach(layer => {
        layer.stars.forEach(star => {
            // animação de brilho
            star.opacity += star.opacityDir * star.blinkSpeed;
            if (star.opacity <= 0.1 || star.opacity >= 1) {
                star.opacityDir *= -1;
            }

            // brilho
            ctx.fillStyle = star.color.replace(/[\d.]+\)$/g, `${star.opacity})`);

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();

            // parallax
            star.x -= layer.speed;
            if (star.x < 0) star.x = canvas.width;
        });
    });
}

// Cometa com tail neon
function drawComet() {
    if (!comet) return;

    comet.tail.push({ x: comet.x, y: comet.y });

    if (comet.tail.length > MAX_TAIL) comet.tail.shift();

    // desenhar tail
    for (let i = 0; i < comet.tail.length; i++) {
        let t = comet.tail[i];
        let pct = i / comet.tail.length;

        let radius = pct * 8 + 0.5; // fino na ponta, grosso no meio
        let alpha = pct * 0.7;

        let g = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, radius);
        g.addColorStop(0, `rgba(255,255,255,${alpha})`);
        g.addColorStop(0.6, `rgba(180,140,255,${alpha * 0.7})`);
        g.addColorStop(1, `rgba(120,80,255,0)`);

        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(t.x, t.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";

    // núcleo
    let core = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, comet.size * 3);
    core.addColorStop(0, "rgba(255,240,255,1)");
    core.addColorStop(0.5, "rgba(210,180,255,0.8)");
    core.addColorStop(1, "rgba(180,120,255,0)");

    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(comet.x, comet.y, comet.size * 3, 0, Math.PI * 2);
    ctx.fill();

    // movimentação
    comet.x += comet.speed * comet.direction;
    comet.y += comet.angle * comet.speed;

    if (Math.random() < 0.001) comet.angle *= -1;

    if (
        comet.x < -150 ||
        comet.x > canvas.width + 150 ||
        comet.y < -150 ||
        comet.y > canvas.height + 150
    ) {
        comet = null;
    }
}

// -------------------------------------------
// LOOP
// -------------------------------------------
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNebulas();
    drawStars();
    drawComet();

    if (cometCooldown > 0) cometCooldown--;
    else if (!comet && Math.random() < COMET_CHANCE) spawnComet();

    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Inicializa
createStars();
createNebula();
animate();
