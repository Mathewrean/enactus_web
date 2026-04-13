// =============================
// ENACTUS JOOUST - MAIN JS FILE
// =============================

// ===== MOBILE MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            updateActiveNav();
        });
    });

    // Update active nav based on current page
    updateActiveNav();
});

function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-item a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===== DATA LOADER WITH FALLBACK =====
async function loadData(jsonPath, renderCallback) {
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error('Network response failed');
        const data = await response.json();
        renderCallback(data);
    } catch (error) {
        console.warn(`Failed to load ${jsonPath}, using fallback data`, error);
        // Fallback data will be provided per page
        renderCallback(null);
    }
}

// ===== SWIPER INITIALIZATION =====
function initSwipers() {
    // Hero Swiper
    if (document.querySelector('.hero-swiper')) {
        new Swiper('.hero-swiper', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true,
            },
        });
    }

    // Featured Projects Swiper
    if (document.querySelector('.projects-swiper')) {
        new Swiper('.projects-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
            pagination: {
                el: '.projects-pagination',
                clickable: true,
            },
        });
    }

    // Team Spotlight Swiper
    if (document.querySelector('.team-swiper')) {
        new Swiper('.team-swiper', {
            slidesPerView: 2,
            spaceBetween: 15,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            breakpoints: {
                640: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 5,
                },
            },
            loop: true,
        });
    }

    // Event Gallery Swiper
    if (document.querySelector('.event-gallery-swiper')) {
        const galleryContainers = document.querySelectorAll('.event-gallery-swiper');
        galleryContainers.forEach((container, index) => {
            new Swiper(container, {
                slidesPerView: 1,
                spaceBetween: 10,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 3,
                    },
                },
                pagination: {
                    el: `.gallery-pagination-${index}`,
                    clickable: true,
                },
            });
        });
    }

    // Past Events Gallery Swiper
    if (document.querySelector('.swiper-gallery')) {
        const galleries = document.querySelectorAll('.swiper-gallery');
        galleries.forEach((gallery, index) => {
            new Swiper(gallery, {
                slidesPerView: 1,
                spaceBetween: 10,
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                },
                pagination: {
                    el: `.pagination-${index}`,
                    clickable: true,
                },
            });
        });
    }
}

// ===== ANIMATED COUNTERS =====
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const targetValue = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const start = 0;
    const startTime = Date.now();

    const updateCounter = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(start + (targetValue - start) * progress);

        const text = element.textContent.replace(/\d+/, current.toLocaleString());
        element.textContent = text;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    };

    updateCounter();
}

// ===== PROJECT FILTER =====
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('visible'), 10);
                } else {
                    card.classList.remove('visible');
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

// ===== PROJECT MODAL =====
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.modal-close');
    const projectCards = document.querySelectorAll('[data-project-id]');

    if (!modal) return;

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project-id');
            loadProjectModal(projectId);
            modal.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

async function loadProjectModal(projectId) {
    try {
        const response = await fetch('../data/projects.json');
        const projects = await response.json();
        const project = projects.find(p => p.id === projectId);

        if (project) {
            const modalBody = document.querySelector('.modal-body');
            modalBody.innerHTML = `
        <div class="modal-section">
          <img src="${project.images[0]}" alt="${project.name}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;">
        </div>
        <div class="modal-section">
          <h2>${project.name}</h2>
          <span class="status-badge status-${project.status.toLowerCase()}">${project.status}</span>
        </div>
        <div class="modal-section">
          <h3>Problem</h3>
          <p>${project.problem}</p>
        </div>
        <div class="modal-section">
          <h3>Solution</h3>
          <p>${project.solution}</p>
        </div>
        <div class="modal-section">
          <h3>Impact</h3>
          <ul style="list-style: none; padding-left: 0;">
            <li>👥 People Impacted: <strong>${project.impact.people.toLocaleString()}</strong></li>
            <li>💰 Revenue Generated: <strong>${project.impact.revenue}</strong></li>
            <li>✓ ${project.impact.units}</li>
          </ul>
        </div>
        ${project.testimonials.length > 0 ? `
          <div class="modal-section">
            <h3>Testimonials</h3>
            ${project.testimonials.map(t => `
              <div class="testimonial-item">
                <p class="testimonial-quote">"${t.quote}"</p>
                <p class="testimonial-author">— ${t.name}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
      `;
        }
    } catch (error) {
        console.error('Error loading project details:', error);
    }
}

// ===== COUNTDOWN TIMER =====
function initCountdown() {
    const countdownContainers = document.querySelectorAll('[data-countdown]');

    countdownContainers.forEach(container => {
        const eventDate = container.getAttribute('data-countdown');
        updateCountdown(eventDate, container);
        setInterval(() => updateCountdown(eventDate, container), 1000);
    });
}

function updateCountdown(eventDate, container) {
    const event = new Date(eventDate).getTime();
    const now = new Date().getTime();
    const distance = event - now;

    if (distance < 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--accent);">Event has started!</p>';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const html = `
    <div class="countdown-item">
      <span class="countdown-number">${days}</span>
      <span class="countdown-label">Days</span>
    </div>
    <div class="countdown-item">
      <span class="countdown-number">${hours}</span>
      <span class="countdown-label">Hours</span>
    </div>
    <div class="countdown-item">
      <span class="countdown-number">${minutes}</span>
      <span class="countdown-label">Minutes</span>
    </div>
    <div class="countdown-item">
      <span class="countdown-number">${seconds}</span>
      <span class="countdown-label">Seconds</span>
    </div>
  `;

    container.innerHTML = html;
}

// ===== AOS INITIALIZATION =====
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
        });
    }
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
            });
        }
    });
});

// ===== FORM HANDLER =====
function initForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            // In production, send to backend
            console.log('Form submitted:', Object.fromEntries(formData));

            // Reset form
            form.reset();

            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = 'Thank you! We\'ll get back to you soon.';
            successMsg.style.cssText = 'background: #4CAF50; color: white; padding: 1rem; border-radius: 6px; margin-top: 1rem; text-align: center;';

            form.appendChild(successMsg);

            setTimeout(() => successMsg.remove(), 4000);
        });
    });
}

// ===== INITIALIZE ALL =====
window.addEventListener('load', () => {
    initSwipers();
    initCounters();
    initProjectFilter();
    initProjectModal();
    initCountdown();
    initAOS();
    initForms();
});

// Reinitialize on page navigation
document.addEventListener('click', () => {
    setTimeout(() => {
        initSwipers();
        initAOS();
    }, 100);
});
