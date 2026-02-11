// ========================================
// HARRISON SINGH FITNESS - Landing Page JS
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Nav (show after scrolling past hero) ---
    const nav = document.getElementById('nav');
    const hero = document.querySelector('.hero');

    function handleNav() {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        if (window.scrollY > heroBottom - 100) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleNav, { passive: true });


    // --- Hero Parallax ---
    const heroBg = document.querySelector('.hero-bg');

    function handleParallax() {
        if (window.scrollY < window.innerHeight) {
            const offset = window.scrollY * 0.4;
            heroBg.style.transform = `translateY(${offset}px) scale(1.1)`;
        }
    }

    window.addEventListener('scroll', handleParallax, { passive: true });
    heroBg.style.transform = 'scale(1.1)';


    // --- Scroll Reveal Animations ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add stagger delay for grid children
                const delay = entry.target.dataset.delay || 0;
                entry.target.style.transitionDelay = `${delay}s`;
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    // Section headings - fade up
    document.querySelectorAll('.section-heading, .section-sub, .section-cta-text').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Pain cards - staggered fade up
    document.querySelectorAll('.pain-card').forEach((el, i) => {
        el.classList.add('reveal');
        el.dataset.delay = (i * 0.1).toFixed(1);
        revealObserver.observe(el);
    });

    // Offer cards - staggered fade up
    document.querySelectorAll('.offer-card').forEach((el, i) => {
        el.classList.add('reveal');
        el.dataset.delay = (i * 0.1).toFixed(1);
        revealObserver.observe(el);
    });

    // Step cards - staggered fade up
    document.querySelectorAll('.step-card').forEach((el, i) => {
        el.classList.add('reveal');
        el.dataset.delay = (i * 0.15).toFixed(2);
        revealObserver.observe(el);
    });

    // About section - images slide from left, text slides from right
    document.querySelectorAll('.about-images').forEach(el => {
        el.classList.add('reveal-left');
        revealObserver.observe(el);
    });

    document.querySelectorAll('.about-text').forEach(el => {
        el.classList.add('reveal-right');
        revealObserver.observe(el);
    });

    // FAQ items - staggered fade up
    document.querySelectorAll('.faq-item').forEach((el, i) => {
        el.classList.add('reveal');
        el.dataset.delay = (i * 0.08).toFixed(2);
        revealObserver.observe(el);
    });

    // Scarcity sections - scale reveal
    document.querySelectorAll('#spots .section-heading, #spots .scarcity-text, #final-cta .section-heading, #final-cta .scarcity-text').forEach(el => {
        el.classList.remove('reveal');
        el.classList.add('reveal-scale');
        revealObserver.observe(el);
    });

    // Form section
    document.querySelectorAll('.coaching-form').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });


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

        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
        .then(() => {
            form.style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
            document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(() => {
            // Still show success - no-cors doesn't return readable responses
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
            faqItems.forEach(i => i.classList.remove('active'));
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
});
