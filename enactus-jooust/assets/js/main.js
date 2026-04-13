// Enactus JOOUST - Main JavaScript
// Vanilla JS • AOS • Swiper • Chart.js • Responsive

'use strict';

// Data fallbacks (for file:// protocol)
const FALLBACK_DATA = {
  projects: [
    // Minimal fallback - full data loaded from JSON
    { id: 'fallback', name: 'Sample Project', category: 'All', status: 'Ongoing', shortDescription: 'Demo project' }
  ],
  events: [],
  team: [],
  partners: []
};

// Global state
let currentData = { projects: [], events: [], team: [], partners: [] };
let currentEventCountdown = null;

// DOM ready
document.addEventListener('DOMContentLoaded', initApp);

// App initialization
function initApp() {
  loadAllData();
  initNavigation();
  initSwipers();
  initAOS();
  initIntersectionObservers();
  initCharts();
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
}

// Data loader with fallback
async function loadData(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error('Fetch failed');
    return await response.json();
  } catch (error) {
    console.warn(`Using fallback for ${path}`);
    return FALLBACK_DATA;
  }
}

async function loadAllData() {
  const paths = {
    projects: './data/projects.json',
    events: './data/events.json',
    team: './data/team.json',
    partners: './data/partners.json'
  };

  // Load all parallel
  const loads = Object.entries(paths).map(([key, path]) => 
    loadData(path).then(data => ({ [key]: data }))
  );
  
  const results = await Promise.all(loads);
  results.forEach(result => Object.assign(currentData, result));

  // Post-load actions
  renderDynamicContent();
  startCountdown();
  initProjectFilters();
}

function renderDynamicContent() {
  // Page-specific renders (use data attributes or classes)
  if (document.querySelector('.featured-projects')) renderFeaturedProjects();
  if (document.querySelector('.team-spotlight')) renderTeamSpotlight();
  if (document.querySelector('.partners-strip')) renderPartners();
  if (document.querySelector('.event-countdown')) renderEventCountdown();
  if (document.querySelector('.leadership-grid')) renderLeadership();
  // Add more as needed
}

// Navigation
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        smoothScroll(href);
      } else {
        window.location.href = href;
      }
      // Close mobile menu
      hamburger?.classList.remove('active');
      mobileMenu?.classList.remove('active');
    });
  });

  // Navbar scroll effect
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    }
  });
}

function smoothScroll(target) {
  document.querySelector(target)?.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
}

// Swiper initialization
function initSwipers() {
  // Hero slider
  const heroSwiper = new Swiper('.swiper-hero', {
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    effect: 'fade',
    speed: 800,
  });

  // Featured projects slider
  new Swiper('.projects-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: { delay: 4000 },
    pagination: { el: '.projects-pagination', clickable: true },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });

  // Team spotlight
  new Swiper('.team-spotlight-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    loop: true,
    autoplay: { delay: 3000 },
    centeredSlides: true,
    breakpoints: {
      640: { slidesPerView: 4 },
      1024: { slidesPerView: 6 }
    }
  });

  // Event galleries
  document.querySelectorAll('.event-gallery').forEach(el => {
    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      pagination: { el: `.${el.classList[1]}-pagination`, clickable: true },
    });
  });
}

// AOS
function initAOS() {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100,
  });
}

// Intersection Observer for counters and animations
function initIntersectionObservers() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => animateCounter(counter));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const increment = target / 100;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }
  }, 20);
}

// Charts (Projects page)
function initCharts() {
  const chartContainers = document.querySelectorAll('.impact-chart');
  if (chartContainers.length === 0) return;

  const ctx = chartContainers[0];
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: currentData.projects.map(p => p.name.slice(0, 15)),
      datasets: [{
        label: 'People Impacted',
        data: currentData.projects.map(p => p.impact.people),
        backgroundColor: 'rgba(255, 215, 0, 0.8)',
        borderColor: '#FFD700',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Event countdown
function startCountdown() {
  const upcoming = currentData.events.filter(e => e.status === 'upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  
  if (!upcoming) return;

  currentEventCountdown = setInterval(() => {
    const now = new Date().getTime();
    const eventDate = new Date(upcoming.date).getTime();
    const distance = eventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const countdownEl = document.querySelector('.event-countdown');
    if (countdownEl) {
      countdownEl.innerHTML = `
        <h3 class="text-2xl font-bold text-yellow-500">${upcoming.title}</h3>
        <div class="countdown-section mt-6">
          <div class="countdown-card">
            <div class="counter text-3xl md:text-4xl" data-target="${days}">${days}d</div>
            <div class="text-sm opacity-75 mt-1">Days</div>
          </div>
          <div class="countdown-card">
            <div class="counter text-3xl md:text-4xl" data-target="${hours}">${hours}h</div>
            <div class="text-sm opacity-75 mt-1">Hours</div>
          </div>
          <div class="countdown-card">
            <div class="counter text-3xl md:text-4xl" data-target="${minutes}">${minutes}m</div>
            <div class="text-sm opacity-75 mt-1">Minutes</div>
          </div>
          <div class="countdown-card">
            <div class="counter text-3xl md:text-4xl" data-target="${seconds}">${seconds}s</div>
            <div class="text-sm opacity-75 mt-1">Seconds</div>
          </div>
        </div>
      `;
      animateCounter(document.querySelector('.counter'));
    }

    if (distance < 0) {
      clearInterval(currentEventCountdown);
    }
  }, 1000);
}

// Project filters and modal
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectGrid = document.querySelector('.project-grid');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.dataset.filter;
      renderProjects(category);
    });
  });
}

function renderProjects(category = 'All') {
  const filtered = category === 'All' 
    ? currentData.projects 
    : currentData.projects.filter(p => p.category === category);
  
  const container = document.querySelector('.project-grid') || document.querySelector('.featured-projects');
  if (!container) return;

  container.innerHTML = filtered.map(project => `
    <article class="project-card cursor-pointer" data-project-id="${project.id}">
      <div class="project-image" style="background-image: url(${project.images[0] || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'})"></div>
      <div class="p-8">
        <span class="status-badge px-3 py-1 rounded-full text-sm font-semibold">${project.status}</span>
        <h3 class="text-2xl font-bold mt-4 mb-2">${project.name}</h3>
        <p class="text-gray-600 mb-4">${project.shortDescription}</p>
        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold text-yellow-500">${project.impact.people.toLocaleString()}</div>
          <span class="text-sm font-medium text-gray-500">People Impacted</span>
        </div>
      </div>
    </article>
  `).join('');

  // Bind modals
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openProjectModal(card.dataset.projectId));
  });
}

function openProjectModal(projectId) {
  const project = currentData.projects.find(p => p.id === projectId);
  if (!project) return;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="project-modal" role="dialog" aria-labelledby="modal-title" tabindex="-1">
      <div class="modal-content">
        <div class="p-8">
          <button class="float-right text-2xl" onclick="closeModal()" aria-label="Close">&times;</button>
          <h2 id="modal-title" class="text-4xl font-bold mb-8">${project.name}</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <img src="${project.images[0]}" alt="${project.name}" class="w-full rounded-2xl shadow-2xl">
              <div class="mt-6 space-y-3">
                ${project.testimonials.map(t => `
                  <blockquote class="italic text-gray-700 p-4 bg-gray-100 rounded-xl">
                    "${t.quote}"
                    <cite class="not-italic font-semibold block mt-2">${t.name}</cite>
                  </blockquote>
                `).join('')}
              </div>
            </div>
            <div>
              <h4 class="text-2xl font-bold mb-4">The Challenge</h4>
              <p class="text-lg mb-8">${project.problem}</p>
              <h4 class="text-2xl font-bold mb-4">Our Solution</h4>
              <p class="text-lg mb-8">${project.solution}</p>
              <div class="grid grid-cols-2 gap-4 mb-8">
                <div class="text-center p-4 bg-yellow-50 rounded-xl">
                  <div class="text-3xl font-bold text-yellow-600">${project.impact.people.toLocaleString()}</div>
                  <div>People Reached</div>
                </div>
                <div class="text-center p-4 bg-blue-50 rounded-xl">
                  <div class="text-3xl font-bold text-blue-600">KES ${project.impact.revenue}</div>
                  <div>Revenue Generated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);

  document.getElementById('project-modal').focus();
}

function closeModal() {
  document.getElementById('project-modal')?.remove();
}

// Page-specific renders
function renderFeaturedProjects() {
  const featured = currentData.projects.slice(0, 6);
  // Already handled by renderProjects('All') for featured
  renderProjects();
}

function renderTeamSpotlight() {
  const spotlight = currentData.team.filter(m => m.era === 'current');
  const container = document.querySelector('.team-spotlight-images');
  if (container) {
    container.innerHTML = spotlight.map(member => `
      <div class="team-member" style="background-image: url(${member.photo})" 
           alt="${member.name}" title="${member.name} - ${member.role}">
      </div>
    `).join('');
  }
}

function renderPartners() {
  const container = document.querySelector('.partners-strip');
  if (container) {
    container.innerHTML = currentData.partners.map(p => `
      <a href="${p.website}" target="_blank" class="partner-logo mx-8">
        <img src="${p.logo}" alt="${p.name}" class="h-16 w-auto">
      </a>
    `).join('');
  }
}

function renderEventCountdown() {
  // Countdown already rendered via startCountdown()
}

function renderLeadership() {
  const executives = currentData.team.filter(m => m.era === 'current' && m.type === 'executive');
  const container = document.querySelector('.leadership-grid');
  if (container) {
    container.innerHTML = executives.map(member => `
      <div class="text-center group">
        <div class="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-2xl group-hover:scale-110 transition-transform mb-6"
             style="background-image: url(${member.photo})">
        </div>
        <h4 class="text-2xl font-bold mb-2">${member.name}</h4>
        <p class="text-yellow-500 font-semibold">${member.role}</p>
        ${member.linkedin ? `<a href="${member.linkedin}" class="text-sm text-gray-500 hover:text-yellow-500 mt-2 inline-block">LinkedIn</a>` : ''}
      </div>
    `).join('');
  }
}

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Skip to content
document.querySelector('.skip-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#main-content')?.focus();
});

// Stats from projects (global)
document.querySelectorAll('.stats-bar').forEach(bar => {
  const totalPeople = currentData.projects.reduce((sum, p) => sum + p.impact.people, 0);
  const totalProjects = currentData.projects.length;
  const totalRevenue = currentData.projects.reduce((sum, p) => sum + parseInt(p.impact.revenue.replace(/[^0-9]/g, '')), 0);
  
  bar.innerHTML = `
    <div class="text-center">
      <div class="counter text-4xl md:text-6xl font-black" data-target="${totalProjects}">${totalProjects}</div>
      <div class="text-sm opacity-75">Projects</div>
    </div>
    <div class="text-center">
      <div class="counter text-4xl md:text-6xl font-black" data-target="${totalPeople}">${totalPeople.toLocaleString()}</div>
      <div class="text-sm opacity-75">People Impacted</div>
    </div>
    <div class="text-center">
      <div class="counter text-4xl md:text-6xl font-black" data-target="${Math.floor(totalRevenue / 1000)}">KES ${Math.floor(totalRevenue / 1000).toLocaleString()}</div>
      <div class="text-sm opacity-75 mt-1">Revenue (Ksh 000s)</div>
    </div>
  `;
});

console.log('Enactus JOOUST loaded successfully! 🚀');
