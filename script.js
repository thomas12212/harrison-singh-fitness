// ========================================
// HARRISON SINGH FITNESS - Landing Page JS
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Multi-step form ---
    const form = document.getElementById('coachingForm');
    const steps = form.querySelectorAll('.form-step');
    const progressBar = form.querySelector('.form-progress-bar');
    const nextBtns = form.querySelectorAll('.form-next');
    const prevBtns = form.querySelectorAll('.form-prev');
    let currentStep = 1;

    function showStep(step) {
        steps.forEach(s => s.classList.remove('active'));
        form.querySelector(`[data-step="${step}"]`).classList.add('active');
        progressBar.style.width = `${(step / steps.length) * 100}%`;
        currentStep = step;
    }

    function validateStep(step) {
        const currentStepEl = form.querySelector(`[data-step="${step}"]`);
        const required = currentStepEl.querySelectorAll('[required]');
        let valid = true;

        required.forEach(field => {
            if (field.type === 'radio') {
                const name = field.name;
                const checked = currentStepEl.querySelector(`input[name="${name}"]:checked`);
                if (!checked) {
                    valid = false;
                    // Highlight the radio group
                    const group = field.closest('.radio-group');
                    if (group) {
                        group.style.outline = '1px solid #e74c3c';
                        group.style.borderRadius = '6px';
                        setTimeout(() => { group.style.outline = 'none'; }, 2000);
                    }
                }
            } else if (!field.value.trim()) {
                valid = false;
                field.style.borderColor = '#e74c3c';
                setTimeout(() => { field.style.borderColor = ''; }, 2000);
            }
        });

        return valid;
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                showStep(currentStep + 1);
                // Scroll to form top
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showStep(currentStep - 1);
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        if (!validateStep(currentStep)) {
            e.preventDefault();
            return;
        }

        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.textContent = 'SUBMITTING...';
        submitBtn.disabled = true;

        // Collect form data
        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            // Show success regardless (formsubmit.co may redirect)
            form.style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
            document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(() => {
            // Show success anyway - formsubmit.co can be finicky with CORS
            form.style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
            document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });


    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked (if it wasn't already open)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });


    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    // --- Scroll animations (subtle fade-in) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes
    const animateElements = document.querySelectorAll(
        '.pain-card, .offer-card, .step-card, .faq-item, .about-text, .about-images'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // CSS class for visible state
    const style = document.createElement('style');
    style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
});
