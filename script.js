/* ============================================================
   PRAJWAL H D — Portfolio Script
   Features: Particles, Custom Cursor, Counters,
             Scroll Animations, Skill Bars, Navbar
   ============================================================ */

// ===== TYPED.JS =====
const typed = new Typed(".text", {
    strings: ["ML Engineer", "Data Scientist", "AI Developer", "Data Analyst"],
    typeSpeed: 80,
    backSpeed: 60,
    backDelay: 1500,
    loop: true
});

// ===== CUSTOM CURSOR =====
const cursorDot     = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top  = mouseY + 'px';
    });

    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.12;
        outlineY += (mouseY - outlineY) * 0.12;
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top  = outlineY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Scale on hoverable elements
    document.querySelectorAll('a, button, .project-card, .achievement-card, .skill-card, .timeline-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%,-50%) scale(1.8)';
            cursorOutline.style.opacity   = '0.8';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%,-50%) scale(1)';
            cursorOutline.style.opacity   = '0.5';
        });
    });
}

// ===== PARTICLE CANVAS =====
const canvas  = document.getElementById('particles-canvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x    = Math.random() * W;
        this.y    = Math.random() * H;
        this.r    = Math.random() * 1.6 + 0.4;
        this.vx   = (Math.random() - 0.5) * 0.35;
        this.vy   = (Math.random() - 0.5) * 0.35;
        this.life = Math.random();
        this.maxLife = Math.random() * 200 + 100;
        this.tick = 0;
    }
    update() {
        this.x   += this.vx;
        this.y   += this.vy;
        this.tick++;
        if (this.tick > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
        const alpha = Math.sin((this.tick / this.maxLife) * Math.PI) * 0.6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,238,255,${alpha})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = Array.from({ length: count }, () => new Particle());
}
initParticles();

function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
                const alpha = (1 - dist / maxDist) * 0.15;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0,238,255,${alpha})`;
                ctx.lineWidth   = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 60;
    header.classList.toggle('scrolled', scrolled);
    scrollTopBtn?.classList.toggle('show', window.scrollY > 400);
    updateActiveNav();
});

// ===== ACTIVE NAV LINK =====
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.navbar a');
    let current = '';
    sections.forEach(section => {
        const top    = section.offsetTop - 100;
        const bottom = top + section.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bottom) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navbar    = document.querySelector('.navbar');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navbar.classList.toggle('open');
});

navbar?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navbar.classList.remove('open');
    });
});

// ===== INTERSECTION OBSERVER (Scroll Reveals) =====
const observerOpts = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' };

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOpts);

document.querySelectorAll('.section-reveal, .reveal-item').forEach(el => revealObserver.observe(el));

// Stagger reveal items inside sections
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.reveal-item');
            items.forEach((item, i) => {
                setTimeout(() => item.classList.add('visible'), i * 120);
            });
        }
    });
}, { threshold: 0.05 });

document.querySelectorAll('.skills-grid, .projects-grid, .achievements-grid, .timeline').forEach(el => {
    staggerObserver.observe(el);
});

// ===== ANIMATED COUNTERS =====
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 1400;
    const start = performance.now();
    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        el.textContent = Math.round(ease * target);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ===== SKILL BARS =====
const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => { bar.style.width = width + '%'; }, 200);
            });
            skillBarObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => skillBarObserver.observe(card));

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const notification = document.getElementById('notification');

function showNotification(msg, success = true) {
    notification.textContent = msg;
    notification.style.color  = success ? 'var(--accent)' : '#ff6b6b';
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 4000);
}

contactForm?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.submit-btn');
    const formData  = new FormData(this);
    const data = {};
    formData.forEach((v, k) => { data[k] = v; });

    submitBtn.disabled  = true;
    submitBtn.innerHTML = '<span>Sending…</span> <i class="bx bx-loader-alt bx-spin"></i>';

    try {
        const response = await fetch('/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (response.ok) {
            showNotification('✅ Message sent successfully!');
            this.reset();
        } else {
            showNotification(result.error || 'Something went wrong. Please try again.', false);
        }
    } catch (err) {
        // Fallback: open mail client
        const { name, email, subject, message } = data;
        const mailto = `mailto:prajwalhd26@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`From: ${name} <${email}>\n\n${message}`)}`;
        window.location.href = mailto;
        showNotification('Opening mail client…');
    } finally {
        submitBtn.disabled  = false;
        submitBtn.innerHTML = '<span>Send Message</span><i class="bx bx-send"></i>';
    }
});

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== TILT EFFECT on Cards =====
document.querySelectorAll('.project-card, .achievement-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        this.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ===== TYPING GLOW on focus =====
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.style.boxShadow = '0 0 0 3px rgba(0,238,255,0.12)';
    });
    input.addEventListener('blur', () => {
        input.style.boxShadow = '';
    });
});
