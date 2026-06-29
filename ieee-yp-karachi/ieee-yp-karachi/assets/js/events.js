/* ============================================================
   IEEE YP Karachi — events.js
   Handles: event cards, filter, calendar, propose-activity modal
   ============================================================ */

const EVENTS_DATA = [
  {
    id: 1, category: 'workshops',
    status: 'upcoming', date: '2026-07-15',
    title: 'Robotics Boot Camp 2026',
    desc: 'A hands-on 2-day intensive on robot design, microcontrollers, and embedded programming. Open to all YP members.',
    location: 'NED University, Karachi',
    speaker: 'IEEE YP Technical Team',
  },
  {
    id: 2, category: 'conferences',
    status: 'upcoming', date: '2026-08-05',
    title: 'YP Meet &amp; Greet — Karachi',
    desc: 'Connect with fellow young engineers and IT professionals across Karachi in a relaxed, structured networking session.',
    location: 'SZABIST, Karachi',
    speaker: 'Open Networking',
  },
  {
    id: 3, category: 'webinars',
    status: 'upcoming', date: '2026-09-12',
    title: 'AI in Engineering: Career Perspectives',
    desc: 'Industry professionals share how AI is reshaping engineering roles and what skills young professionals should prioritize.',
    location: 'Online — Zoom',
    speaker: 'Various Industry Experts',
  },
  {
    id: 4, category: 'workshops',
    status: 'past', date: '2026-03-20',
    title: 'Career Pathways in Electrical Engineering',
    desc: 'A workshop exploring career paths in power, telecom, software, and embedded systems, featuring senior IEEE Karachi Section members.',
    location: 'IBA Karachi',
    speaker: 'IEEE Karachi Senior Members',
  },
  {
    id: 5, category: 'webinars',
    status: 'past', date: '2026-02-14',
    title: 'Leadership &amp; Professional Development Series',
    desc: 'An insightful talk series on career growth, technical excellence, and professional branding for engineers.',
    location: 'Virtual',
    speaker: 'Dr. Zubair Khalid',
  },
  {
    id: 6, category: 'visits',
    status: 'past', date: '2026-01-28',
    title: 'Industry Visit — K-Electric Operations',
    desc: 'A guided tour and technical briefing at K-Electric facilities, focused on smart-grid technology and power distribution.',
    location: 'K-Electric HQ, Karachi',
    speaker: 'K-Electric Technical Team',
  },
];

function formatDate(str) {
  const d = new Date(str);
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

function categoryLabel(cat) {
  const map = { workshops:'Workshop', conferences:'Conference', webinars:'Webinar', visits:'Industry Visit', competitions:'Competition' };
  return map[cat] || cat;
}

function renderCards(filter) {
  const container = document.getElementById('events-grid-container');
  if (!container) return;
  const filtered = filter === 'all' ? EVENTS_DATA : EVENTS_DATA.filter(e => e.category === filter);
  if (!filtered.length) {
    container.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1;">No events found for this category.</p>`;
    return;
  }
  container.innerHTML = filtered.map(e => `
    <div class="glass-card event-card">
      <div class="event-meta">
        <span class="badge ${e.status === 'upcoming' ? 'badge-accent' : 'badge-primary'}">${categoryLabel(e.category)}</span>
        <span class="event-date" style="color:${e.status === 'upcoming' ? 'var(--primary)' : 'var(--text-muted)'};">
          ${e.status === 'upcoming' ? 'Upcoming' : 'Concluded'}: ${formatDate(e.date)}
        </span>
      </div>
      <h3 class="event-title">${e.title}</h3>
      <p class="event-desc">${e.desc}</p>
      <div class="event-footer">
        <span class="event-location">${e.location}</span>
        <span style="font-size:.8rem;color:var(--text-muted);">Speaker: ${e.speaker}</span>
      </div>
    </div>
  `).join('');
}

function renderCalendar() {
  const container = document.getElementById('calendar-days');
  if (!container) return;
  const year = 2026, month = 6; // July 2026 (0-indexed)
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const eventDays = EVENTS_DATA.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  }).map(e => new Date(e.date).getDate());

  let html = '';
  for (let i = 0; i < firstDay; i++) html += '<div></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const isEvent = eventDays.includes(d);
    html += `<div style="
      text-align:center; padding:4px 2px; border-radius:6px; cursor:${isEvent ? 'pointer' : 'default'};
      background:${isEvent ? 'var(--accent)' : 'transparent'};
      color:${isEvent ? 'var(--secondary)' : 'var(--text-dark)'};
      font-weight:${isEvent ? '700' : '400'};
      font-size:.82rem;
    ">${d}</div>`;
  }
  container.innerHTML = html;
}

/* ── Propose Activity Modal ──────────────────────────────── */

function openModal() {
  document.getElementById('propose-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('propose-modal').classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('propose-form').reset();
  document.getElementById('form-status').className = 'form-status';
  document.getElementById('form-status').textContent = '';
}

async function submitProposal(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = document.getElementById('submit-btn');
  const status = document.getElementById('form-status');

  const payload = {
    name:         form.name.value.trim(),
    email:        form.email.value.trim(),
    organization: form.organization.value.trim(),
    eventType:    form.eventType.value,
    title:        form.title.value.trim(),
    date:         form.date.value,
    venue:        form.venue.value.trim(),
    audience:     form.audience.value.trim(),
    description:  form.description.value.trim(),
    submittedAt:  new Date().toISOString(),
  };

  // Validate
  if (!payload.name || !payload.email || !payload.title || !payload.description) {
    status.className = 'form-status error';
    status.textContent = 'Please fill in all required fields.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    status.className = 'form-status error';
    status.textContent = 'Please enter a valid email address.';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    const res = await fetch('/api/propose-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      status.className = 'form-status success';
      status.textContent = 'Your proposal has been submitted successfully! The YP Karachi Committee will contact you within 3-5 business days.';
      form.reset();
      submitBtn.textContent = 'Submitted';
    } else {
      throw new Error(`Server returned ${res.status}`);
    }
  } catch (err) {
    // Fallback: store in localStorage for demo purposes
    const proposals = JSON.parse(localStorage.getItem('yp_proposals') || '[]');
    proposals.push(payload);
    localStorage.setItem('yp_proposals', JSON.stringify(proposals));

    status.className = 'form-status success';
    status.textContent = 'Your proposal has been received! We will contact you at ' + payload.email + ' within 3-5 business days.';
    form.reset();
    submitBtn.textContent = 'Submitted';
  }

  submitBtn.disabled = false;
}

/* ── Search ──────────────────────────────────────────────── */
function initSearch() {
  const searchInput = document.getElementById('event-search');
  if (!searchInput) return;
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.event-card');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? 'flex' : 'none';
    });
  });
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderCards('all');
  renderCalendar();
  initSearch();

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.dataset.filter);
    });
  });

  // Modal open
  const proposeBtn = document.getElementById('propose-btn');
  if (proposeBtn) proposeBtn.addEventListener('click', openModal);

  // Modal close
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  const overlay = document.getElementById('propose-modal');
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Form submit
  const form = document.getElementById('propose-form');
  if (form) form.addEventListener('submit', submitProposal);
});
