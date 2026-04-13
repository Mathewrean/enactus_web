'use strict';

// Fallback data for file:// use
const FALLBACK = {
  projects: [
    {
      id: 'proj-001',
      name: 'Smart Farming Initiative',
      category: 'Agriculture',
      status: 'Ongoing',
      shortDescription: 'IoT sensors for smallholder farmers to optimize irrigation.',
      problem: 'Water scarcity and inefficient farming practices affecting yields.',
      solution: 'Solar-powered soil moisture sensors with mobile alerts.',
      impact: { people: 150, revenue: 'KES 120,000' },
      images: ['assets/images/project-1.jpg'],
      testimonials: [{ name: 'Mary Atieno', quote: 'Yields increased with real-time water alerts.' }]
    }
  ],
  events: [
    {
      id: 'evt-001',
      title: 'Annual Impact Showcase',
      date: '2025-11-15T10:00:00',
      venue: 'JOOUST Main Auditorium, Bondo',
      status: 'upcoming',
      description: 'Celebrating our projects with demos and awards.',
      registrationLink: 'https://forms.gle/demo123',
      gallery: []
    }
  ],
  team: [
    {
      id: 'tm-001',
      name: 'Alice Otieno',
      role: 'President',
      type: 'executive',
      era: 'current',
      yearServed: '2024-2025',
      photo: 'assets/images/team-1.jpg',
      bio: 'Passionate about social tech solutions.',
      linkedin: '',
      department: null
    }
  ],
  partners: [
    {
      name: 'Safaricom Foundation',
      logo: 'assets/images/partner-1.png',
      tier: 'Gold',
      testimonial: 'Proud to empower Kenyan youth through Enactus.',
      website: 'https://safaricomfoundation.org'
    }
  ]
};

const state = { projects: [], events: [], team: [], partners: [] };

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAOS();
  loadAllData().then(() => {
    renderAll();
    initSwipers();
    initCounters();
    initProjectFilters();
    startCountdown();
  });
});

async function loadData(key, path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();
    return Array.isArray(data) ? data : FALLBACK[key];
  } catch (err) {
    console.warn(`Using fallback for ${path}`);
    return FALLBACK[key];
  }
}

async function loadAllData() {
  const pairs = [
    ['projects', './data/projects.json'],
    ['events', './data/events.json'],
    ['team', './data/team.json'],
    ['partners', './data/partners.json']
  ];

  const results = await Promise.all(
    pairs.map(([key, path]) => loadData(key, path).then(data => [key, data]))
  );

  results.forEach(([key, data]) => { state[key] = data; });
}

function renderAll() {
  if (document.querySelector('[data-featured-projects]')) renderFeaturedProjects();
  if (document.querySelector('[data-project-grid]')) renderProjectGrid('All');
  if (document.querySelector('[data-team-spotlight]')) renderTeamSpotlight();
  if (document.querySelector('[data-partners-strip]')) renderPartnersStrip();
  if (document.querySelector('[data-partners-grid]')) renderPartnersGrid();
  if (document.querySelector('[data-partner-testimonials]')) renderPartnerTestimonials();
  if (document.querySelector('[data-events-upcoming]')) renderEvents();
  if (document.querySelector('[data-team-page]')) renderTeamPage();
  if (document.querySelector('[data-stats-bar]')) renderStatsBar();
  if (document.querySelector('[data-impact-counters]')) renderImpactCounters();
  if (document.querySelector('[data-join-projects]')) renderJoinProjects();
}

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
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      hamburger?.classList.remove('active');
      mobileMenu?.classList.remove('active');
    });
  });

  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('nav');
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('navbar-scrolled');
    else navbar.classList.remove('navbar-scrolled');
  });

  // Active link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    if (link.getAttribute('href') === path) link.classList.add('font-bold', 'text-yellow-500');
  });
}

function initAOS() {
  if (window.AOS) {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });
  }
}

function initSwipers() {
  if (!window.Swiper) return;

  if (document.querySelector('.swiper-hero')) {
    new Swiper('.swiper-hero', {
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      effect: 'fade',
      speed: 900
    });
  }

  if (document.querySelector('.projects-swiper')) {
    new Swiper('.projects-swiper', {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      autoplay: { delay: 3500 },
      pagination: { el: '.projects-pagination', clickable: true },
      breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
  }

  if (document.querySelector('.team-spotlight-swiper')) {
    new Swiper('.team-spotlight-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 16,
      loop: true,
      autoplay: { delay: 2800 },
      centeredSlides: true,
      breakpoints: { 640: { slidesPerView: 4 }, 1024: { slidesPerView: 6 } }
    });
  }

  document.querySelectorAll('.event-gallery').forEach((el, idx) => {
    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      pagination: { el: `.event-gallery-pagination-${idx}`, clickable: true }
    });
  });
}

function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(el => animateCounter(el));
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (Number.isNaN(target)) return;
  let current = 0;
  const step = Math.max(1, Math.floor(target / 100));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = current.toLocaleString();
    }
  }, 18);
}

function renderStatsBar() {
  const totalPeople = state.projects.reduce((sum, p) => sum + (p.impact?.people || 0), 0);
  const completedProjects = state.projects.filter(p => p.status === 'Completed').length;
  const studentsInvolved = state.team.filter(m => m.era === 'current').length;

  document.querySelectorAll('[data-stats-bar]').forEach(bar => {
    bar.innerHTML = `
      <div class="text-center">
        <div class="counter text-4xl md:text-6xl font-black" data-target="${completedProjects}">${completedProjects}</div>
        <div class="text-sm text-gray-600">Projects Completed</div>
      </div>
      <div class="text-center">
        <div class="counter text-4xl md:text-6xl font-black" data-target="${studentsInvolved}">${studentsInvolved}</div>
        <div class="text-sm text-gray-600">Students Involved</div>
      </div>
      <div class="text-center">
        <div class="counter text-4xl md:text-6xl font-black" data-target="${totalPeople}">${totalPeople.toLocaleString()}</div>
        <div class="text-sm text-gray-600">Communities Impacted</div>
      </div>
    `;
  });
}

function renderImpactCounters() {
  const totalPeople = state.projects.reduce((sum, p) => sum + (p.impact?.people || 0), 0);
  const totalRevenue = state.projects.reduce((sum, p) => {
    const raw = p.impact?.revenue || '0';
    const num = parseInt(String(raw).replace(/[^0-9]/g, ''), 10);
    return sum + (Number.isNaN(num) ? 0 : num);
  }, 0);
  const running = state.projects.filter(p => p.status === 'Ongoing').length;

  document.querySelectorAll('[data-impact-counters]').forEach(container => {
    container.innerHTML = `
      <div class="text-center">
        <div class="counter text-4xl md:text-5xl font-black" data-target="${totalPeople}">${totalPeople.toLocaleString()}</div>
        <div class="text-sm text-gray-600">People Impacted</div>
      </div>
      <div class="text-center">
        <div class="counter text-4xl md:text-5xl font-black" data-target="${Math.floor(totalRevenue / 1000)}">${Math.floor(totalRevenue / 1000).toLocaleString()}</div>
        <div class="text-sm text-gray-600">Funds Raised (KES '000)</div>
      </div>
      <div class="text-center">
        <div class="counter text-4xl md:text-5xl font-black" data-target="${running}">${running}</div>
        <div class="text-sm text-gray-600">Projects Running</div>
      </div>
    `;
  });
}

function renderFeaturedProjects() {
  const container = document.querySelector('[data-featured-projects]');
  if (!container) return;
  const featured = state.projects.slice(0, 6);
  container.innerHTML = featured.map(project => `
    <div class="swiper-slide">${projectCard(project)}</div>
  `).join('');
  bindProjectCards();
}

function renderProjectGrid(category) {
  const container = document.querySelector('[data-project-grid]');
  if (!container) return;
  const filtered = category === 'All' ? state.projects : state.projects.filter(p => p.category === category);
  container.innerHTML = filtered.map(projectCard).join('');
  bindProjectCards();
  renderImpactChart();
}

function projectCard(project) {
  const image = project.images && project.images[0] ? project.images[0] : 'assets/images/project-1.jpg';
  const statusClass = project.status === 'Completed' ? 'completed' : 'ongoing';
  return `
    <article class="card overflow-hidden cursor-pointer" data-project-id="${project.id}">
      <div class="h-56 bg-cover bg-center" style="background-image: url('${image}')"></div>
      <div class="p-6">
        <span class="badge ${statusClass}">${project.status}</span>
        <h3 class="text-xl font-bold mt-3">${project.name}</h3>
        <p class="text-gray-600 mt-2">${project.shortDescription}</p>
        <div class="mt-4 flex items-center justify-between">
          <div class="text-2xl font-bold text-yellow-500">${(project.impact?.people || 0).toLocaleString()}</div>
          <div class="text-sm text-gray-500">People Impacted</div>
        </div>
      </div>
    </article>
  `;
}

function bindProjectCards() {
  document.querySelectorAll('[data-project-id]').forEach(card => {
    card.addEventListener('click', () => openProjectModal(card.dataset.projectId));
  });
}

function openProjectModal(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;

  const gallery = (project.images || []).map(img => `<img src="${img}" alt="${project.name}" class="w-full rounded-xl">`).join('');
  const testimonials = (project.testimonials || []).map(t => `
    <blockquote class="bg-gray-100 p-4 rounded-xl text-gray-700">
      "${t.quote}"
      <cite class="block mt-2 font-semibold text-gray-900">${t.name}</cite>
    </blockquote>
  `).join('');

  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="project-modal" role="dialog" aria-labelledby="project-title" tabindex="-1">
      <div class="modal-content">
        <div class="p-8">
          <button class="float-right text-2xl" aria-label="Close" onclick="closeModal()">&times;</button>
          <h2 id="project-title" class="text-3xl font-bold">${project.name}</h2>
          <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-4">
              ${gallery || ''}
              ${testimonials ? `<div class="space-y-3">${testimonials}</div>` : ''}
            </div>
            <div>
              <h3 class="text-xl font-bold">The Challenge</h3>
              <p class="text-gray-700 mt-2">${project.problem || ''}</p>
              <h3 class="text-xl font-bold mt-6">Our Solution</h3>
              <p class="text-gray-700 mt-2">${project.solution || ''}</p>
              <div class="grid grid-cols-2 gap-4 mt-6">
                <div class="countdown-card">
                  <div class="text-2xl font-bold text-yellow-600">${(project.impact?.people || 0).toLocaleString()}</div>
                  <div class="text-sm text-gray-600">People Reached</div>
                </div>
                <div class="countdown-card">
                  <div class="text-2xl font-bold text-yellow-600">${project.impact?.revenue || 'KES 0'}</div>
                  <div class="text-sm text-gray-600">Revenue Generated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);

  document.getElementById('project-modal')?.focus();
}

function closeModal() {
  document.getElementById('project-modal')?.remove();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function initProjectFilters() {
  const buttons = document.querySelectorAll('[data-filter]');
  if (!buttons.length) return;
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('bg-yellow-400', 'text-black'));
      btn.classList.add('bg-yellow-400', 'text-black');
      renderProjectGrid(btn.dataset.filter);
    });
  });
}

function renderImpactChart() {
  const canvas = document.querySelector('[data-impact-chart]');
  if (!canvas || !window.Chart) return;

  const labels = state.projects.map(p => p.name.slice(0, 14));
  const values = state.projects.map(p => p.impact?.people || 0);

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'People Impacted',
        data: values,
        backgroundColor: 'rgba(255, 215, 0, 0.7)',
        borderColor: '#FFD700',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function renderTeamSpotlight() {
  const container = document.querySelector('[data-team-spotlight]');
  if (!container) return;
  const current = state.team.filter(m => m.era === 'current');
  container.innerHTML = current.map(member => `
    <div class="swiper-slide text-center">
      <div class="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full bg-cover bg-center" style="background-image: url('${member.photo}')" title="${member.name}"></div>
      <p class="mt-3 text-sm font-semibold">${member.name}</p>
    </div>
  `).join('');
}

function renderTeamPage() {
  renderLeadership();
  renderDepartments();
  renderMemberSpotlight();
  renderPastLeadership();
}

function renderLeadership() {
  const container = document.querySelector('[data-leadership]');
  if (!container) return;
  const execs = state.team.filter(m => m.era === 'current' && m.type === 'executive');
  container.innerHTML = execs.map(member => `
    <div class="card p-6 text-center">
      <img src="${member.photo}" alt="${member.name}" class="w-32 h-32 rounded-full mx-auto object-cover">
      <h3 class="text-xl font-bold mt-4">${member.name}</h3>
      <p class="text-yellow-600 font-semibold">${member.role}</p>
      <p class="text-sm text-gray-600 mt-3">${member.bio || ''}</p>
      ${member.linkedin ? `<a class="text-sm text-gray-600 mt-3 inline-block" href="${member.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
    </div>
  `).join('');
}

function renderDepartments() {
  const container = document.querySelector('[data-departments]');
  if (!container) return;
  const departments = state.team.filter(m => m.era === 'current' && m.type === 'department');
  const grouped = departments.reduce((acc, member) => {
    const key = member.department || 'Department';
    acc[key] = acc[key] || [];
    acc[key].push(member);
    return acc;
  }, {});

  container.innerHTML = Object.entries(grouped).map(([name, members]) => `
    <div class="card p-6">
      <h3 class="text-xl font-bold">${name}</h3>
      <div class="mt-4 space-y-3">
        ${members.map(m => `
          <div class="flex items-center gap-3">
            <img src="${m.photo}" alt="${m.name}" class="w-12 h-12 rounded-full object-cover">
            <div>
              <div class="font-semibold">${m.name}</div>
              <div class="text-sm text-gray-600">${m.role}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderMemberSpotlight() {
  const container = document.querySelector('[data-member-spotlight]');
  if (!container) return;
  const current = state.team.filter(m => m.era === 'current');
  container.innerHTML = current.map(member => `
    <div class="swiper-slide text-center">
      <img src="${member.photo}" alt="${member.name}" class="w-20 h-20 rounded-full mx-auto object-cover">
      <p class="mt-2 text-sm font-semibold">${member.name}</p>
    </div>
  `).join('');
}

function renderPastLeadership() {
  const container = document.querySelector('[data-past-leadership]');
  if (!container) return;
  const past = state.team.filter(m => m.era === 'past');
  const grouped = past.reduce((acc, member) => {
    const key = member.yearServed || 'Past';
    acc[key] = acc[key] || [];
    acc[key].push(member);
    return acc;
  }, {});

  container.innerHTML = Object.entries(grouped).map(([year, members]) => `
    <div class="card p-6">
      <h3 class="text-lg font-bold">${year}</h3>
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${members.map(m => `
          <div class="flex items-center gap-3">
            <img src="${m.photo}" alt="${m.name}" class="w-12 h-12 rounded-full object-cover">
            <div>
              <div class="font-semibold">${m.name}</div>
              <div class="text-sm text-gray-600">${m.role}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderPartnersStrip() {
  const container = document.querySelector('[data-partners-strip]');
  if (!container) return;
  container.innerHTML = state.partners.map(p => `
    <a class="partner-logo" href="${p.website || '#'}" target="_blank" rel="noopener">
      <img src="${p.logo}" alt="${p.name}" class="h-12 md:h-14">
    </a>
  `).join('');
}

function renderPartnersGrid() {
  const container = document.querySelector('[data-partners-grid]');
  if (!container) return;
  container.innerHTML = state.partners.map(p => `
    <div class="card p-6 text-center">
      <img src="${p.logo}" alt="${p.name}" class="h-14 mx-auto">
      <h4 class="font-bold mt-3">${p.name}</h4>
      <span class="badge ${p.tier.toLowerCase()}">${p.tier}</span>
    </div>
  `).join('');
}

function renderPartnerTestimonials() {
  const container = document.querySelector('[data-partner-testimonials]');
  if (!container) return;
  container.innerHTML = state.partners.map(p => `
    <blockquote class="card p-6">
      <p class="text-gray-700">"${p.testimonial}"</p>
      <cite class="block mt-3 font-semibold">${p.name}</cite>
    </blockquote>
  `).join('');
}

function renderEvents() {
  const upcomingContainer = document.querySelector('[data-events-upcoming]');
  const pastContainer = document.querySelector('[data-events-past]');
  if (!upcomingContainer && !pastContainer) return;

  const upcoming = state.events.filter(e => e.status === 'upcoming').sort((a,b) => new Date(a.date) - new Date(b.date));
  const past = state.events.filter(e => e.status === 'past').sort((a,b) => new Date(b.date) - new Date(a.date));

  if (upcomingContainer) {
    upcomingContainer.innerHTML = upcoming.map(eventCard).join('');
  }

  if (pastContainer) {
    pastContainer.innerHTML = past.map((evt, idx) => pastEventCard(evt, idx)).join('');
  }
}

function eventCard(evt) {
  const date = new Date(evt.date).toLocaleDateString();
  return `
    <div class="card p-6">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-bold">${evt.title}</h3>
        <span class="text-sm text-gray-500">${date}</span>
      </div>
      <p class="text-gray-600 mt-2">${evt.description}</p>
      <div class="text-sm text-gray-500 mt-2">${evt.venue}</div>
      ${evt.registrationLink ? `<a class="btn-outline mt-4" href="${evt.registrationLink}" target="_blank" rel="noopener">Register</a>` : ''}
    </div>
  `;
}

function pastEventCard(evt, idx) {
  const date = new Date(evt.date).toLocaleDateString();
  const gallery = (evt.gallery || []).map(img => `
    <div class="swiper-slide"><img src="${img}" alt="${evt.title}" class="w-full h-48 object-cover rounded-xl"></div>
  `).join('');

  return `
    <div class="card p-6">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-bold">${evt.title}</h3>
        <span class="text-sm text-gray-500">${date}</span>
      </div>
      <p class="text-gray-600 mt-2">${evt.description}</p>
      ${gallery ? `
        <div class="swiper event-gallery mt-4">
          <div class="swiper-wrapper">${gallery}</div>
          <div class="swiper-pagination event-gallery-pagination-${idx}"></div>
        </div>
      ` : ''}
    </div>
  `;
}

function startCountdown() {
  const container = document.querySelector('[data-event-countdown]');
  if (!container) return;

  const upcoming = state.events.filter(e => e.status === 'upcoming')
    .sort((a,b) => new Date(a.date) - new Date(b.date))[0];

  if (!upcoming) {
    container.innerHTML = '<p class="text-gray-600">No upcoming events at the moment.</p>';
    return;
  }

  const tick = () => {
    const now = new Date().getTime();
    const eventDate = new Date(upcoming.date).getTime();
    const distance = eventDate - now;

    if (distance <= 0) {
      container.innerHTML = `<h3 class="text-xl font-bold">${upcoming.title}</h3><p class="mt-2 text-gray-600">Happening now.</p>`;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    container.innerHTML = `
      <h3 class="text-2xl font-bold">${upcoming.title}</h3>
      <p class="text-gray-600 mt-1">${upcoming.venue}</p>
      <div class="countdown-grid mt-4">
        <div class="countdown-card"><div class="text-2xl font-bold">${days}</div><div class="text-xs text-gray-600">Days</div></div>
        <div class="countdown-card"><div class="text-2xl font-bold">${hours}</div><div class="text-xs text-gray-600">Hours</div></div>
        <div class="countdown-card"><div class="text-2xl font-bold">${minutes}</div><div class="text-xs text-gray-600">Minutes</div></div>
        <div class="countdown-card"><div class="text-2xl font-bold">${seconds}</div><div class="text-xs text-gray-600">Seconds</div></div>
      </div>
    `;
  };

  tick();
  setInterval(tick, 1000);
}

function renderJoinProjects() {
  const container = document.querySelector('[data-join-projects]');
  if (!container) return;
  container.innerHTML = state.projects.slice(0, 5).map(p => `
    <li class="flex items-center justify-between border-b border-gray-200 py-2">
      <span class="font-medium">${p.name}</span>
      <span class="text-sm text-gray-500">${p.category}</span>
    </li>
  `).join('');
}

// Skip link focus support
const skipLink = document.querySelector('.skip-link');
if (skipLink) {
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector('#main-content');
    if (target) target.focus();
  });
}
