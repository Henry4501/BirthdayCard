document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 2. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0 });
        gsap.to(cursorOutline, { x: e.clientX, y: e.clientY, duration: 0.15 });
    });

    // 3. Landing Page Logic
    const startBtn = document.getElementById('startBtn');
    const music = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');

    startBtn.addEventListener('click', () => {
        gsap.to('#landing', {
            opacity: 0,
            y: -100,
            duration: 1,
            onComplete: () => {
                document.getElementById('landing').style.display = 'none';
                document.body.style.overflow = 'auto';
                initGalaxy();
            }
        });
        // Try playing music (some browsers block autoplay)
        music.play().catch(() => console.log("Music blocked by browser"));
    });

    musicToggle.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            musicToggle.innerText = "🔊 Music";
        } else {
            music.pause();
            musicToggle.innerText = "🔇 Music";
        }
    });

    
    // 5. Envelope Animation
    const envelope = document.getElementById('envelope');
    envelope.addEventListener('click', () => {
        envelope.classList.toggle('open');
        if(envelope.classList.contains('open')) {
            drawSignature();
            createHearts(20);
        }
    });

    // 6. Signature Animation
    function drawSignature() {
        const canvas = document.getElementById('signatureCanvas');
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#d63384';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        let p = 0;
        const points = [[10, 40], [30, 20], [50, 45], [70, 25], [100, 40], [150, 35]];

        function animate() {
            if (p < points.length - 1) {
                ctx.beginPath();
                ctx.moveTo(points[p][0], points[p][1]);
                ctx.lineTo(points[p+1][0], points[p+1][1]);
                ctx.stroke();
                p++;
                setTimeout(animate, 100);
            }
        }
        animate();
    }

    // 7. Click for Hearts Effect
    document.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = e.clientX + 'px';
            heart.style.top = e.clientY + 'px';
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '9999';
            document.body.appendChild(heart);

            gsap.to(heart, {
                y: -100,
                x: (Math.random() - 0.5) * 100,
                opacity: 0,
                duration: 1,
                onComplete: () => heart.remove()
            });
        }
    });

    function createHearts(count) {
        for(let i=0; i<count; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                const heart = document.createElement('div');
                heart.innerHTML = '💖';
                heart.style.position = 'fixed';
                heart.style.left = x + 'px';
                heart.style.top = y + 'px';
                document.body.appendChild(heart);
                gsap.to(heart, { y: -200, opacity: 0, duration: 2, onComplete: () => heart.remove() });
            }, i * 100);
        }
    }

    // 8. Meter Scroll Animation
    gsap.to("#meterFill", {
        width: "100%",
        scrollTrigger: {
            trigger: ".meter-section",
            start: "top 80%",
            onEnter: () => {
                const label = document.getElementById('meterLabel');
                let count = 0;
                const interval = setInterval(() => {
                    count++;
                    label.innerText = `Bestie Level: ${count}%`;
                    if (count >= 100) {
                        label.innerText = "Bestie Level: INFINITE ♾️";
                        clearInterval(interval);
                    }
                }, 20);
            }
        }
    });

    // 9. Fireworks System
    const fwCanvas = document.getElementById('fireworksCanvas');
    const fwCtx = fwCanvas.getContext('2d');
    let particles = [];

    function resizeFw() {
        fwCanvas.width = window.innerWidth;
        fwCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeFw);
    resizeFw();

    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y; this.color = color;
            this.velocity = { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 };
            this.alpha = 1;
            this.friction = 0.95;
        }
        draw() {
            fwCtx.globalAlpha = this.alpha;
            fwCtx.beginPath();
            fwCtx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            fwCtx.fillStyle = this.color;
            fwCtx.fill();
        }
        update() {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= 0.01;
        }
    }

    function createFirework(x, y) {
        const colors = ['#ff758c', '#ff7eb3', '#ffd1ff', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 40; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    function animateFw() {
        fwCtx.fillStyle = 'rgba(15, 12, 41, 0.2)';
        fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
        particles.forEach((p, i) => {
            if (p.alpha > 0) {
                p.update();
                p.draw();
            } else {
                particles.splice(i, 1);
            }
        });
        requestAnimationFrame(animateFw);
    }
    animateFw();

    document.getElementById('surpriseBtn').addEventListener('click', () => {
        for(let i=0; i<10; i++) {
            setTimeout(() => {
                createFirework(Math.random() * fwCanvas.width, Math.random() * fwCanvas.height);
            }, i * 300);
        }
        alert("Neha, you're the best! Stay amazing! 💖");
    });

    // 10. Galaxy Constellation Effect
    function initGalaxy() {
        const canvas = document.getElementById('galaxyCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let stars = [];
        for(let i=0; i<150; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        function drawGalaxy() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            stars.forEach(s => {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
                ctx.fill();
                s.x += s.vx; s.y += s.vy;
                if(s.x < 0 || s.x > canvas.width) s.vx *= -1;
                if(s.y < 0 || s.y > canvas.height) s.vy *= -1;
            });

            // Connect nearby stars
            for(let i=0; i<stars.length; i++) {
                for(let j=i+1; j<stars.length; j++) {
                    const dist = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
                    if(dist < 100) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist/100})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawGalaxy);
        }
        drawGalaxy();
    }

    // Scroll reveal animations
    gsap.utils.toArray('.photo-card, .flip-card, .glass-card').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: elem,
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });
});