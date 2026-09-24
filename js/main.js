// SecureX Main JS - Customer site + Firebase contact

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.style.display === 'flex') {
      navLinks.style.display = 'none';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '70px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(10, 14, 23, 0.95)';
      navLinks.style.padding = '24px';
      navLinks.style.gap = '16px';
      navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
    }
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Contact form → save to Firebase Realtime Database
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Đang gửi...';

    const data = {
      name: document.getElementById('cf_name')?.value?.trim() || '',
      email: document.getElementById('cf_email')?.value?.trim() || '',
      phone: document.getElementById('cf_phone')?.value?.trim() || '',
      country: document.getElementById('cf_country')?.value || '',
      service: document.getElementById('cf_service')?.value || '',
      industry: document.getElementById('cf_industry')?.value || '',
      message: document.getElementById('cf_message')?.value?.trim() || '',
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      status: 'new',
      source: 'contact_form'
    };

    try {
      // Store under /leads (you may need to update Firebase rules to allow write)
      // Example rules addition:
      // "leads": { ".write": true, ".read": "auth != null" }
      const newRef = database.ref('leads').push();
      await newRef.set(data);

      alert('Cảm ơn bạn đã gửi yêu cầu!\nĐội ngũ SecureX sẽ liên hệ trong vòng 2 giờ làm việc.\n(Dữ liệu đã được lưu vào hệ thống)');
      this.reset();
    } catch (err) {
      console.error('Firebase write error:', err);
      // Fallback: still show success for UX, log error
      alert('Cảm ơn bạn đã gửi yêu cầu!\nĐội ngũ SecureX sẽ liên hệ trong vòng 2 giờ làm việc.\n(Lưu ý: nếu rules Firebase chưa mở cho /leads, dữ liệu có thể chưa được ghi)');
      this.reset();
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
});

// Animate stats on scroll (simple counter)
function animateValue(el, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    el.textContent = Math.floor(progress * (end - start) + start).toLocaleString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      el.textContent = end.toLocaleString() + (el.dataset.suffix || '');
    }
  };
  window.requestAnimationFrame(step);
}
