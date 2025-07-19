document.addEventListener('DOMContentLoaded', () => {
            
    // --- Interactive Background Animation ---
    const canvas = document.getElementById('interactive-bg');
    const ctx = canvas.getContext('2d');
    let mouse = { x: null, y: null };
    let dots = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createDots(); // Recreate dots on resize
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Dot {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseRadius = 1;
            this.color = 'rgba(100, 116, 139, 0.5)'; // slate-500 with opacity
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.baseRadius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let maxDist = 150; // Radius of the "aura" effect

            if (distance < maxDist) {
                let force = (maxDist - distance) / maxDist;
                this.baseRadius = 1 + 2 * force; // Enlarge dot
                this.color = `rgba(94, 234, 212, ${0.5 + 0.5 * force})`; // teal-300 with dynamic opacity
            } else {
                this.baseRadius = 1;
                this.color = 'rgba(100, 116, 139, 0.5)';
            }
            this.draw();
        }
    }
    
    function createDots() {
        dots = [];
        const spacing = 40; // Spacing between dots
        for (let x = 0; x < canvas.width; x += spacing) {
            for (let y = 0; y < canvas.height; y += spacing) {
                dots.push(new Dot(x, y));
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < dots.length; i++) {
            dots[i].update();
        }
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    animate();

    // --- Section Scroll Animations & Nav Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add fade-in class for animation
                entry.target.classList.add('is-visible');

                // Update active nav link
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        root: null, // relative to viewport
        rootMargin: '0px',
        threshold: 0.3 // 30% of the section must be visible
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});