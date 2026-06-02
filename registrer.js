const supabaseUrl = "https://gebtcnziczaayzwuiztk.supabase.co";
// Do NOT put service role keys here. This is the anon key used by the site.
const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYnRjbnppY3phYXl6d3VpenRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTIxNTAsImV4cCI6MjA5NTg4ODE1MH0.RZGOF0jzgDJQfda8N6dDBJPYUa87Hz9PZtuxgAH8ALU";

const supabaseClient =
  window.supabase && typeof window.supabase.createClient === "function"
    ? window.supabase.createClient(supabaseUrl, anonKey)
    : null;
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
});
