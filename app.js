// App UI helpers: show logged-in email and handle logout, wire search button
document.addEventListener('DOMContentLoaded', () => {
  const userInfo = document.getElementById('user-info');
  const email = localStorage.getItem('user_email');

  if (userInfo) {
    if (email) {
      userInfo.innerHTML = `<span class="user-email">${email}</span> <button id="logout-btn">Logg ut</button>`;
      const logoutBtn = document.getElementById('logout-btn');
      logoutBtn.addEventListener('click', async () => {
        if (window._supabaseClient && window._supabaseClient.auth) {
          try { await window._supabaseClient.auth.signOut(); } catch(e) { console.warn(e); }
        }
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_id');
        window.location.href = 'index.html';
      });
    } else {
      userInfo.innerHTML = `<a href="login.html">Logg inn</a>`;
    }
  }

  // Wire search button if present
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      if (typeof sok === 'function') sok();
    });
  }
});
