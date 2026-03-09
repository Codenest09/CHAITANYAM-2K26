// ===================================
// CHAITANYAM 2K26 - Registration Form
// Dept of AI & CSE
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNeuralNetwork();
    initScrollIndicator();
    initFormValidation();
    initPaymentFlow();
});

// ===== PARTICLE SYSTEM =====
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.color = this.getColor();
            this.alpha = Math.random() * 0.5 + 0.1;
        }

        getColor() {
            const colors = [
                '0, 240, 255',    // cyan
                '123, 47, 255',   // purple
                '255, 45, 149',   // pink
                '255, 215, 0',    // gold
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }

            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const alpha = (1 - dist / 150) * 0.15;
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
}

// ===== NEURAL NETWORK VISUALIZATION =====
function initNeuralNetwork() {
    const svg = document.getElementById('neuralSvg');
    const nodes = [];
    const nodeCount = 15;

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 4 + 2,
        });
    }

    function updateNeural() {
        svg.innerHTML = '';
        const ns = 'http://www.w3.org/2000/svg';

        // Update positions
        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > window.innerWidth) n.vx *= -1;
            if (n.y < 0 || n.y > window.innerHeight) n.vy *= -1;
        });

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 250) {
                    const line = document.createElementNS(ns, 'line');
                    line.setAttribute('x1', nodes[i].x);
                    line.setAttribute('y1', nodes[i].y);
                    line.setAttribute('x2', nodes[j].x);
                    line.setAttribute('y2', nodes[j].y);
                    line.setAttribute('stroke', `rgba(123, 47, 255, ${(1 - dist / 250) * 0.5})`);
                    line.setAttribute('stroke-width', '1');
                    svg.appendChild(line);
                }
            }
        }

        // Draw nodes
        nodes.forEach(n => {
            const circle = document.createElementNS(ns, 'circle');
            circle.setAttribute('cx', n.x);
            circle.setAttribute('cy', n.y);
            circle.setAttribute('r', n.r);
            circle.setAttribute('fill', 'rgba(0, 240, 255, 0.4)');
            svg.appendChild(circle);
        });

        requestAnimationFrame(updateNeural);
    }
    updateNeural();
}

// ===== SCROLL INDICATOR =====
function initScrollIndicator() {
    const scrollBtn = document.querySelector('.scroll-indicator');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            document.getElementById('formSection').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const form = document.getElementById('registrationForm');
    const fields = {
        studentName: {
            el: document.getElementById('studentName'),
            group: document.getElementById('nameGroup'),
            error: document.getElementById('nameError'),
            validate: (v) => {
                if (!v.trim()) return 'Please enter your full name';
                if (v.trim().length < 3) return 'Name must be at least 3 characters';
                return '';
            }
        },
        pinNumber: {
            el: document.getElementById('pinNumber'),
            group: document.getElementById('pinGroup'),
            error: document.getElementById('pinError'),
            validate: (v) => {
                if (!v.trim()) return 'Please enter your PIN number';
                return '';
            }
        },
        studentClass: {
            el: document.getElementById('studentClass'),
            group: document.getElementById('classGroup'),
            error: document.getElementById('classError'),
            validate: (v) => {
                if (!v) return 'Please select your class';
                return '';
            }
        },
        studentYear: {
            el: document.getElementById('studentYear'),
            group: document.getElementById('yearGroup'),
            error: document.getElementById('yearError'),
            validate: (v) => {
                if (!v) return 'Please select your year';
                return '';
            }
        },
        studentBranch: {
            el: document.getElementById('studentBranch'),
            group: document.getElementById('branchGroup'),
            error: document.getElementById('branchError'),
            validate: (v) => {
                if (!v.trim()) return 'Please enter your branch';
                if (v.trim().length < 2) return 'Branch must be at least 2 characters';
                return '';
            }
        },
        phoneNumber: {
            el: document.getElementById('phoneNumber'),
            group: document.getElementById('phoneGroup'),
            error: document.getElementById('phoneError'),
            validate: (v) => {
                if (!v.trim()) return 'Please enter your phone number';
                if (!/^[0-9]{10}$/.test(v.trim())) return 'Enter a valid 10-digit phone number';
                return '';
            }
        },
        studentEmail: {
            el: document.getElementById('studentEmail'),
            group: document.getElementById('emailGroup'),
            error: document.getElementById('emailError'),
            validate: (v) => {
                if (!v.trim()) return 'Please enter your email address';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Enter a valid email address';
                return '';
            }
        }
    };

    // Real-time validation on blur & input
    Object.values(fields).forEach(field => {
        field.el.addEventListener('blur', () => validateField(field));
        field.el.addEventListener('input', () => {
            if (field.group.classList.contains('has-error')) {
                validateField(field);
            }
        });
    });

    function validateField(field) {
        const error = field.validate(field.el.value);
        if (error) {
            field.group.classList.add('has-error');
            field.group.classList.remove('is-valid');
            field.error.textContent = error;
            return false;
        } else {
            field.group.classList.remove('has-error');
            field.group.classList.add('is-valid');
            field.error.textContent = '';
            return true;
        }
    }

    // Form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        Object.values(fields).forEach(field => {
            if (!validateField(field)) isValid = false;
        });

        if (!isValid) {
            // Shake effect on first error
            const firstError = document.querySelector('.form-group.has-error');
            if (firstError) {
                firstError.style.animation = 'none';
                firstError.offsetHeight; // Trigger reflow
                firstError.style.animation = 'shake 0.5s ease';
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Show loading
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate short processing delay
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            showPaymentSection(fields);
        }, 1200);
    });
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
    }
`;
document.head.appendChild(shakeStyle);

// ===== PAYMENT FLOW =====
function showPaymentSection(fields) {
    const formSection = document.getElementById('formSection');
    const paymentSection = document.getElementById('paymentSection');
    const heroHeader = document.getElementById('heroHeader');

    // Build registrant summary
    const summary = document.getElementById('registrantSummary');
    summary.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">Name</span>
            <span class="summary-value">${escapeHtml(fields.studentName.el.value)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">PIN Number</span>
            <span class="summary-value">${escapeHtml(fields.pinNumber.el.value)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Class</span>
            <span class="summary-value">${escapeHtml(fields.studentClass.el.value)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Year</span>
            <span class="summary-value">${escapeHtml(fields.studentYear.el.value)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Branch</span>
            <span class="summary-value">${escapeHtml(fields.studentBranch.el.value)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Phone</span>
            <span class="summary-value">${escapeHtml(fields.phoneNumber.el.value)}</span>
        </div>
        <div class="summary-item" style="grid-column: 1 / -1;">
            <span class="summary-label">Email</span>
            <span class="summary-value">${escapeHtml(fields.studentEmail.el.value)}</span>
        </div>
    `;

    // Hide form, show payment
    formSection.style.display = 'none';
    heroHeader.style.minHeight = 'auto';
    heroHeader.style.paddingTop = '40px';
    heroHeader.style.paddingBottom = '20px';

    // Remove scroll indicator
    const scrollInd = document.querySelector('.scroll-indicator');
    if (scrollInd) scrollInd.style.display = 'none';

    paymentSection.classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initPaymentFlow() {
    const backBtn = document.getElementById('backBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const modal = document.getElementById('confirmModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    // Back to form
    backBtn.addEventListener('click', () => {
        const formSection = document.getElementById('formSection');
        const paymentSection = document.getElementById('paymentSection');
        const heroHeader = document.getElementById('heroHeader');
        const scrollInd = document.querySelector('.scroll-indicator');

        paymentSection.classList.remove('active');
        formSection.style.display = '';
        heroHeader.style.minHeight = '';
        heroHeader.style.paddingTop = '';
        heroHeader.style.paddingBottom = '';
        if (scrollInd) scrollInd.style.display = '';

        document.getElementById('formSection').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

    // Confirm payment
    confirmBtn.addEventListener('click', () => {
        const utrInput = document.getElementById('utrNumber');
        const utrError = document.getElementById('utrError');
        const utrValue = utrInput.value.trim();

        if (!utrValue) {
            utrError.textContent = 'Please enter your UTR number';
            utrInput.parentElement.classList.add('has-error');

            // Shake effect
            utrInput.parentElement.style.animation = 'none';
            utrInput.parentElement.offsetHeight; // Trigger reflow
            utrInput.parentElement.style.animation = 'shake 0.5s ease';
            return;
        }

        if (utrValue.length < 6) {
            utrError.textContent = 'Please enter a valid UTR number';
            utrInput.parentElement.classList.add('has-error');
            return;
        }

        // Clear error if valid
        utrError.textContent = '';
        utrInput.parentElement.classList.remove('has-error');
        utrInput.parentElement.classList.add('is-valid');

        // Disable button while submitting
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        // Collect form data and send to Google Sheets
        const formData = {
            name: document.getElementById('studentName').value.trim(),
            pin: document.getElementById('pinNumber').value.trim(),
            class: document.getElementById('studentClass').value,
            year: document.getElementById('studentYear').value,
            branch: document.getElementById('studentBranch').value.trim(),
            phone: document.getElementById('phoneNumber').value.trim(),
            email: document.getElementById('studentEmail').value.trim(),
            utr: utrValue
        };

        submitToGoogleSheet(formData)
            .then(() => {
                // Show success modal
                confirmBtn.disabled = false;
                confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Payment Done';
                modal.classList.add('active');
                createConfetti();
            })
            .catch((error) => {
                console.error('Error submitting to Google Sheet:', error);
                // Still show success (no-cors mode doesn't return response)
                confirmBtn.disabled = false;
                confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Payment Done';
                modal.classList.add('active');
                createConfetti();
            });
    });

    // Handle UTR input while typing to clear error
    document.getElementById('utrNumber').addEventListener('input', function () {
        const utrError = document.getElementById('utrError');
        if (this.value.trim().length >= 6) {
            utrError.textContent = '';
            this.parentElement.classList.remove('has-error');
        }
    });

    // Close modal
    modalCloseBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        // Reset everything
        document.getElementById('registrationForm').reset();
        document.getElementById('utrNumber').value = '';
        document.getElementById('utrError').textContent = '';
        document.getElementById('utrNumber').parentElement.classList.remove('has-error', 'is-valid');

        const groups = document.querySelectorAll('.form-group');
        groups.forEach(g => {
            g.classList.remove('has-error', 'is-valid');
        });

        const formSection = document.getElementById('formSection');
        const paymentSection = document.getElementById('paymentSection');
        const heroHeader = document.getElementById('heroHeader');
        const scrollInd = document.querySelector('.scroll-indicator');

        paymentSection.classList.remove('active');
        formSection.style.display = '';
        heroHeader.style.minHeight = '';
        heroHeader.style.paddingTop = '';
        heroHeader.style.paddingBottom = '';
        if (scrollInd) scrollInd.style.display = '';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== CONFETTI =====
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    container.innerHTML = '';
    const colors = ['#00f0ff', '#7b2fff', '#ff2d95', '#ffd700', '#00e676', '#ff6b35'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.width = (Math.random() * 8 + 4) + 'px';
        confetti.style.height = (Math.random() * 12 + 6) + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        container.appendChild(confetti);
    }
}

// ===== GOOGLE SHEETS INTEGRATION =====
// IMPORTANT: Replace this URL with your Google Apps Script Web App URL
const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

function submitToGoogleSheet(data) {
    return fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

// ===== UTILITY =====
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe form groups after DOM load
document.querySelectorAll('.form-group').forEach(group => {
    observer.observe(group);
});
