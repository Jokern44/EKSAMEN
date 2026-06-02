// Use shared client initialized in supabase-client.js
const supabaseClient = window._supabaseClient || null;
const form = document.getElementById("register-form");
const statusEl = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;

  if (!email || !password) {
    statusEl.textContent = "Fyll ut alle felt.";
    return;
  }
  if (password !== password2) {
    statusEl.textContent = "Passordene stemmer ikke overens.";
    return;
  }
  if (password.length < 6) {
    statusEl.textContent = "Passord må være minst 6 tegn.";
    return;
  }

  statusEl.textContent = "Oppretter...";

  if (!supabaseClient) {
    statusEl.textContent = "Feil: Supabase-klienten er ikke tilgjengelig.";
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({ email, password });

  if (error) {
    statusEl.textContent = `Feil: ${error.message}`;
    return;
  }

  // If user was created immediately, try to create a profiles row.
  if (data && data.user && data.user.id) {
    try {
      const { error: pError } = await supabaseClient
        .from("profiles")
        .insert([{ id: data.user.id }]);
      if (pError) console.warn("Kunne ikke opprette profil:", pError.message);
    } catch (e) {
      console.warn("Profil-insert feilet", e);
    }
  }

  statusEl.textContent = "Sjekk e-posten din for bekreftelse hvis nødvendig.";
  // Redirect to login after short delay
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
});
