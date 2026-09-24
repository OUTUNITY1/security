// SecureX Admin JS - with Firebase Auth protection

function logout() {
  doLogout();
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(e) {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = e.target.closest('.icon-btn');
  if (sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggleBtn) {
    if (window.innerWidth <= 900) {
      sidebar.classList.remove('open');
    }
  }
});

// Close modals on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
  }
});

// Close modal when clicking overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('show');
    }
  });
});

// On every admin page: require admin auth and update user UI
document.addEventListener('DOMContentLoaded', function() {
  // Only run if firebase is loaded (pages that include the scripts)
  if (typeof auth === 'undefined') return;

  requireAdminAuth().then((user) => {
    // Update sidebar user info if present
    const nameEl = document.querySelector('.user-details h5');
    const roleEl = document.querySelector('.user-details span');
    const avatarEl = document.querySelector('.user-avatar');
    if (nameEl) nameEl.textContent = user.displayName || 'Admin SecureX';
    if (roleEl) roleEl.textContent = 'Super Admin';
    if (avatarEl) {
      const initials = (user.displayName || 'AD').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      avatarEl.textContent = initials;
    }
  }).catch(() => {
    // redirect already handled
  });
});
