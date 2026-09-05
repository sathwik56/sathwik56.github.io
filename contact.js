/* Reveal animation on contact page */

const revealEls = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));


/* =========================
   CONTACT FORM HANDLER
   Uses mailto: as fallback (no backend needed)
========================= */

(function () {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const nameIn = document.getElementById("cf-name");
    const emailIn = document.getElementById("cf-email");
    const msgIn = document.getElementById("cf-message");
    const submitBtn = document.getElementById("cf-submit");
    const btnText = document.getElementById("cf-btn-text");
    const note = document.getElementById("cf-note");

    function setNote(text, type) {
        note.textContent = text;
        note.className = "c-form-note " + (type || "");
    }

    function validate() {
        let ok = true;
        [nameIn, emailIn, msgIn].forEach(el => {
            el.classList.remove("error");
            el.removeAttribute('aria-invalid');
            el.removeAttribute('aria-describedby');
        });

        if (!nameIn.value.trim()) {
            nameIn.classList.add("error");
            nameIn.setAttribute('aria-invalid', 'true');
            nameIn.setAttribute('aria-describedby', 'cf-note');
            ok = false;
        }
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailReg.test(emailIn.value.trim())) {
            emailIn.classList.add("error");
            emailIn.setAttribute('aria-invalid', 'true');
            emailIn.setAttribute('aria-describedby', 'cf-note');
            ok = false;
        }
        if (!msgIn.value.trim()) {
            msgIn.classList.add("error");
            msgIn.setAttribute('aria-invalid', 'true');
            msgIn.setAttribute('aria-describedby', 'cf-note');
            ok = false;
        }
        // focus first invalid field for keyboard users
        if (!ok) {
            const firstInvalid = [nameIn, emailIn, msgIn].find(el => el.classList.contains('error'));
            if (firstInvalid) firstInvalid.focus();
        }
        return ok;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!validate()) {
            setNote("Please complete all fields before sending.", "error-note");
            return;
        }

        // Build mailto link as a no-backend solution
        const subject = encodeURIComponent("Portfolio Contact from " + nameIn.value.trim());
        const body = encodeURIComponent(
            "Name: " + nameIn.value.trim() + "\n" +
            "Email: " + emailIn.value.trim() + "\n\n" +
            msgIn.value.trim()
        );
        const mailto = `mailto:sathwikacharya022@gmail.com?subject=${subject}&body=${body}`;

        submitBtn.disabled = true;
        btnText.textContent = "Opening email...";

        window.location.href = mailto;

        setTimeout(() => {
            setNote("✓ Your email app will open with your message ready to send. Thank you!", "success");
            form.reset();
            submitBtn.disabled = false;
            btnText.textContent = "Send Message";
        }, 1200);
    });

    // Clear error state on input
    [nameIn, emailIn, msgIn].forEach(el => {
        el.addEventListener("input", () => {
            el.classList.remove("error");
            el.removeAttribute('aria-invalid');
            el.removeAttribute('aria-describedby');
            if (note.classList.contains("error-note")) setNote("");
        });
    });
})();
