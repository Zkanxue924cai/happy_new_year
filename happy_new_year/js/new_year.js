let countdownElement = document.getElementById("countdown");
let countdownValue = 3;

function updateCountdown() {
    countdownElement.innerHTML = countdownValue;
    countdownValue--;

    if (countdownValue < 0) {
        clearInterval(countdownInterval);
        countdownElement.innerHTML = "Happy New Year!";
        startFireworks();
    }
}

let countdownInterval = setInterval(updateCountdown, 1000);

function startFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks = [];
    const particles = [];

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    class Firework {
        constructor(x, y, xEnd, yEnd) {
            this.x = x;
            this.y = y;
            this.xEnd = xEnd;
            this.yEnd = yEnd;
            this.distanceToEnd = Math.hypot(xEnd - x, yEnd - y);
            this.angle = Math.atan2(yEnd - y, xEnd - x);
            this.speed = random(2, 10);
            this.distanceTraveled = 0;
        }

        update() {
            this.distanceTraveled += this.speed;
            const travelRatio = this.distanceTraveled / this.distanceToEnd;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;

            if (travelRatio >= 1) {
                this.createParticles();
                return true;
            }
            return false;
        }

        createParticles() {
            const particleCount = random(100, 200); // More particles for variety
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(this.xEnd, this.yEnd));
            }
        }

        draw() {
            // Hide the firework trail
            if (this.distanceTraveled < this.distanceToEnd * 0.9) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${random(0, 360)}, 100%, 50%)`; // Random color for each firework
                ctx.fill();
            }
        }
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.angle = random(0, Math.PI * 2);
            this.speed = random(1, 10);
            this.friction = 0.95;
            this.gravity = 1;
            this.hue = random(0, 360);
            this.brightness = random(50, 80);
            this.alpha = 1;
            this.decay = random(0.015, 0.03);
        }

        update() {
            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, random(1, 3), 0, Math.PI * 2); // Varying particle size
            ctx.fill();
            ctx.restore();
        }
    }

    function loop() {
        requestAnimationFrame(loop);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        fireworks.forEach((firework, index) => {
            if (firework.update()) {
                fireworks.splice(index, 1);
            }
            firework.draw();
        });

        particles.forEach((particle, index) => {
            particle.update();
            particle.draw();
            if (particle.alpha <= 0) {
                particles.splice(index, 1);
            }
        });

        if (Math.random() < 0.05) {
            const x = random(0, canvas.width);
            const y = canvas.height;
            const xEnd = random(0, canvas.width);
            const yEnd = random(0, canvas.height / 2);
            fireworks.push(new Firework(x, y, xEnd, yEnd));
        }
    }

    loop();
}