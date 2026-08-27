/* =========================
   PAGE LOADER
========================= */

window.addEventListener("load", () => {
    const loader = document.getElementById("page-loader");
    if (!loader) return;
    setTimeout(() => {
        loader.classList.add("hidden");
        setTimeout(() => loader.remove(), 600);
    }, 400);
});


/* =========================
   MOBILE MENU
========================= */

const menuToggle = document.getElementById("menu-toggle");
const navLinks  = document.getElementById("nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");
        menuToggle.classList.toggle("open", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close on nav link click
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("open");
            document.body.classList.remove("menu-open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navLinks.classList.contains("active")) {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("open");
            document.body.classList.remove("menu-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.focus();
        }
    });
}


/* =========================
   HEADER SCROLL EFFECT
========================= */

const header = document.getElementById("header");

window.addEventListener("scroll", handleHeaderScroll, { passive: true });

function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
}


/* =========================
   ACTIVE NAV HIGHLIGHT
========================= */

const sections = document.querySelectorAll("section[id], header[id]");
const navAnchors = document.querySelectorAll(".nav-links a[data-section]");

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navAnchors.forEach(a => {
                a.classList.toggle("active", a.dataset.section === id);
            });
        }
    });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));


/* =========================
   SCROLL REVEAL
========================= */

const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));


/* =========================
   BACK TO TOP
========================= */

const backToTop = document.getElementById("back-to-top");

if (backToTop) {
    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("show", window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


/* =========================
   PROJECT CARD 3D TILT
   (desktop only, no touch)
========================= */

const projectCards = document.querySelectorAll(".project-card");
const isTouchDevice = window.matchMedia("(hover: none)").matches;

if (!isTouchDevice) {
    projectCards.forEach(card => {

        card.addEventListener("mousemove", (e) => {
            if (window.innerWidth <= 900) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -2.5;
            const rotY = ((x - cx) / cx) * 2.5;
            card.style.transform =
                `translateY(-9px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });

    });
}


/* =========================
   HERO PORTRAIT PARALLAX
   (desktop only)
========================= */

const heroVisual = document.getElementById("hero-visual");

if (heroVisual && !isTouchDevice) {

    const imageFrame = heroVisual.querySelector(".hero-image-frame");

    heroVisual.addEventListener("mousemove", (e) => {
        if (window.innerWidth <= 900) return;
        const rect = heroVisual.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        if (imageFrame) {
            imageFrame.style.transform =
                `translate(${x * 10}px, ${y * 10}px)`;
        }
    });

    heroVisual.addEventListener("mouseleave", () => {
        if (imageFrame) imageFrame.style.transform = "";
    });
}


/* =========================
   BACKGROUND PARTICLES
   Subtle floating dots — pure canvas,
   no library, no memory leaks
========================= */

(function () {
    const canvas = document.getElementById("bg-particles");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Respect reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const PARTICLE_COUNT = 55;
    let W = 0, H = 0;
    let particles = [];
    let rafId = null;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createParticle() {
        return {
            x:     rand(0, W),
            y:     rand(0, H),
            r:     rand(0.5, 1.8),
            vx:    rand(-0.12, 0.12),
            vy:    rand(-0.18, -0.04),  // mostly drifting upward, slowly
            alpha: rand(0.04, 0.18),
            fade:  rand(0.0003, 0.0008),
            dir:   1,
        };
    }

    function init() {
        resize();
        particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach(p => {
            // Fade in/out
            p.alpha += p.fade * p.dir;
            if (p.alpha >= 0.18 || p.alpha <= 0.02) p.dir *= -1;

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around
            if (p.y < -5)  p.y = H + 5;
            if (p.x < -5)  p.x = W + 5;
            if (p.x > W + 5) p.x = -5;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
            ctx.fill();
        });

        rafId = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", () => {
        resize();
    }, { passive: true });

    init();
    draw();

    // Clean up if page is hidden to save resources
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            cancelAnimationFrame(rafId);
        } else {
            draw();
        }
    });
})();


/* =========================
   CURSOR / TOUCH DOT
   Desktop/mouse only — hidden on touch devices.
========================= */

(function () {
    const dot = document.getElementById("cursor-dot");
    if (!dot) return;

    // Skip on reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Skip entirely on touch / coarse-pointer devices
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;
    let rippleTimer = null;

    const LERP = 0.16;
    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
        currentX = lerp(currentX, targetX, LERP);
        currentY = lerp(currentY, targetY, LERP);
        dot.style.left = currentX + "px";
        dot.style.top  = currentY + "px";
        rafId = requestAnimationFrame(tick);
    }
    tick();

    function triggerRipple() {
        dot.classList.remove("ripple");
        void dot.offsetWidth;
        dot.classList.add("pressed", "ripple");
        clearTimeout(rippleTimer);
        rippleTimer = setTimeout(() => {
            dot.classList.remove("ripple", "pressed");
        }, 560);
    }

    document.addEventListener("pointermove", (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        dot.classList.add("visible");
    }, { passive: true });

    document.addEventListener("pointerdown", (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        dot.classList.add("visible");
        triggerRipple();
    }, { passive: true });

    document.addEventListener("pointerup", () => {
        dot.classList.remove("pressed");
    }, { passive: true });

    document.addEventListener("pointercancel", () => {
        dot.classList.remove("pressed", "ripple");
    }, { passive: true });

    const sel = "a, button, [role='button'], input, textarea, select, [tabindex]";
    document.addEventListener("pointerover", (e) => {
        if (e.target.closest(sel)) dot.classList.add("hovering");
    }, { passive: true });
    document.addEventListener("pointerout", (e) => {
        if (e.target.closest(sel)) dot.classList.remove("hovering");
    }, { passive: true });

    document.documentElement.addEventListener("pointerleave", () => {
        dot.classList.remove("visible", "hovering", "pressed", "ripple");
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) cancelAnimationFrame(rafId);
        else tick();
    });
})();
