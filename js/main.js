// SecureX Main JS - Customer site + Firebase contact + AI Bot

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

// Contact form → lưu vào Firebase
// Lưu ý: Rules hiện tại chỉ cover /users/{uid}. 
// Để form public hoạt động cần thêm rules cho /leads trong Firebase Console:
// "leads": { ".write": true, ".read": "auth != null" }
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
      // Thử ghi vào /leads (cần rules mở)
      const newRef = database.ref('leads').push();
      await newRef.set(data);

      alert('Cảm ơn bạn đã gửi yêu cầu!\nĐội ngũ SecureX sẽ liên hệ trong vòng 2 giờ làm việc.');
      this.reset();
    } catch (err) {
      console.error('Firebase write error:', err);
      // Fallback UX khi rules chưa mở /leads
      alert('Cảm ơn bạn đã gửi yêu cầu!\nĐội ngũ SecureX sẽ liên hệ trong vòng 2 giờ làm việc.\n\n(Lưu ý kỹ thuật: Rules Firebase hiện chỉ cho phép /users/{uid}. Hãy thêm rules cho /leads nếu muốn lưu form vào DB.)');
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

/* ===== AI Security Bot Widget ===== */
(function initAIBot() {
  // Chỉ khởi tạo nếu chưa có
  if (document.getElementById('aiBotWidget')) return;

  const botHTML = `
    <div id="aiBotWidget" class="ai-bot-widget">
      <button id="aiBotToggle" class="ai-bot-toggle" aria-label="Mở AI Assistant">
        <span class="ai-bot-icon">🤖</span>
        <span class="ai-bot-pulse"></span>
      </button>
      <div id="aiBotPanel" class="ai-bot-panel">
        <div class="ai-bot-header">
          <div class="ai-bot-avatar">🛡</div>
          <div>
            <strong>SecureX AI</strong>
            <span class="ai-bot-status">● Online</span>
          </div>
          <button id="aiBotClose" class="ai-bot-close">×</button>
        </div>
        <div id="aiBotMessages" class="ai-bot-messages">
          <div class="ai-msg bot">
            <div class="ai-msg-bubble">
              Xin chào! Tôi là <strong>SecureX AI</strong> — trợ lý bảo mật thông minh.<br>
              Bạn cần hỗ trợ gì hôm nay?
            </div>
          </div>
        </div>
        <div class="ai-bot-suggestions">
          <button data-q="Dịch vụ AI Threat Detection là gì?">AI Threat Detection</button>
          <button data-q="Cách đăng ký tài khoản Client?">Đăng ký Client</button>
          <button data-q="Giá các gói dịch vụ?">Bảng giá</button>
          <button data-q="Liên hệ đội ngũ hỗ trợ">Liên hệ</button>
        </div>
        <div class="ai-bot-input-area">
          <input type="text" id="aiBotInput" placeholder="Nhập câu hỏi về bảo mật..." autocomplete="off">
          <button id="aiBotSend">➤</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', botHTML);

  const panel = document.getElementById('aiBotPanel');
  const toggle = document.getElementById('aiBotToggle');
  const closeBtn = document.getElementById('aiBotClose');
  const messages = document.getElementById('aiBotMessages');
  const input = document.getElementById('aiBotInput');
  const sendBtn = document.getElementById('aiBotSend');

  // Knowledge base đơn giản (rule-based cho demo)
  const knowledge = [
    {
      keywords: ['threat', 'detection', 'ai', 'phát hiện', 'mối đe dọa'],
      answer: 'AI Threat Detection của SecureX sử dụng mô hình Deep Learning được train trên hàng tỷ sự kiện bảo mật. Độ chính xác 99.7%, phát hiện zero-day và giảm 85% false positive. Bạn có thể đăng ký gói AI Detection Pro để trải nghiệm.'
    },
    {
      keywords: ['đăng ký', 'register', 'tài khoản', 'client', 'khách hàng'],
      answer: 'Bạn có thể đăng ký tài khoản Client miễn phí tại trang <a href="client-register.html" style="color:#00f0ff">Đăng ký Client</a>. Sau khi đăng ký, bạn sẽ có dashboard riêng để theo dõi Health Score, threats và tickets.'
    },
    {
      keywords: ['giá', 'price', 'gói', 'package', 'chi phí', 'bao nhiêu'],
      answer: 'SecureX có 4 gói chính:<br>• <strong>Starter</strong> – phù hợp startup<br>• <strong>AI Detection Pro</strong> – AI threat detection real-time<br>• <strong>Enterprise SOC</strong> – SOC 24/7 + managed security<br>• <strong>Custom</strong> – tư vấn riêng<br>Liên hệ form bên dưới để nhận báo giá chi tiết.'
    },
    {
      keywords: ['liên hệ', 'contact', 'hỗ trợ', 'support', 'hotline'],
      answer: 'Bạn có thể:<br>1. Điền form liên hệ ngay trên trang này<br>2. Email: support@securex.vn<br>3. Đăng nhập Client Dashboard để tạo ticket<br>Đội ngũ sẽ phản hồi trong vòng 2 giờ làm việc.'
    },
    {
      keywords: ['pentest', 'penetration', 'kiểm thử', 'xâm nhập'],
      answer: 'Dịch vụ Penetration Testing của SecureX kết hợp AI-assisted scanning + chuyên gia. Báo cáo theo chuẩn OWASP & PTES, phát hiện lỗ hổng zero-day. Liên hệ để đặt lịch pentest.'
    },
    {
      keywords: ['soc', 'managed', 'mdr', '24/7'],
      answer: 'Enterprise SOC của SecureX cung cấp giám sát 24/7, phản ứng sự cố trong mili-giây, tích hợp SIEM + SOAR. Phù hợp ngân hàng, fintech và doanh nghiệp lớn.'
    }
  ];

  function getBotReply(text) {
    const lower = text.toLowerCase();
    for (const item of knowledge) {
      if (item.keywords.some(k => lower.includes(k))) {
        return item.answer;
      }
    }
    return 'Cảm ơn câu hỏi của bạn! Hiện tôi có thể hỗ trợ về: AI Threat Detection, đăng ký Client, bảng giá, Penetration Testing và SOC. Bạn muốn hỏi chi tiết phần nào? Hoặc điền form liên hệ để được tư vấn trực tiếp.';
  }

  function addMessage(text, isBot = true) {
    const div = document.createElement('div');
    div.className = 'ai-msg ' + (isBot ? 'bot' : 'user');
    div.innerHTML = `<div class="ai-msg-bubble">${text}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function handleSend(text) {
    if (!text.trim()) return;
    addMessage(text, false);
    input.value = '';

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'ai-msg bot typing';
    typing.innerHTML = '<div class="ai-msg-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
      typing.remove();
      addMessage(getBotReply(text), true);
    }, 700 + Math.random() * 600);
  }

  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      input.focus();
    }
  });

  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  sendBtn.addEventListener('click', () => handleSend(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend(input.value);
  });

  // Suggestion chips
  document.querySelectorAll('.ai-bot-suggestions button').forEach(btn => {
    btn.addEventListener('click', () => {
      handleSend(btn.dataset.q);
    });
  });
})();
