const starCount = 180;

for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");


    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";

    star.style.animationDelay = Math.random() * 4 + "s";

    document.body.appendChild(star);
}

