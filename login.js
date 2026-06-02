// Use shared client initialized in supabase-client.js
const supabaseClient = window._supabaseClient || null;
const form = document.getElementById("login-form");
const statusEl = document.getElementById("status");
const profileEl = document.getElementById("profile");

// Diagnostic: check that the Supabase script loaded
if (!window.supabase || typeof window.supabase.createClient !== "function") {
  console.error(
    "Supabase library not found. Check that the CDN script loaded.",
  );
  if (statusEl)
    statusEl.textContent = "Feil: Supabase-biblioteket er ikke lastet.";
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusEl.textContent = "Logger inn...";
    profileEl.textContent = "";

    if (!supabaseClient) {
      statusEl.textContent = "Kan ikke logge inn: Supabase-klienten mangler.";
      return;
    }

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      statusEl.textContent = error.message;
      return;
    }
    const userId = data.user.id;
    // store email and user id for the app
    try {
      const userEmail = data.user.email || email;
      localStorage.setItem("user_email", userEmail);
      localStorage.setItem("user_id", userId);
    } catch (e) {
      console.warn("Could not store user info locally", e);
    }
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      statusEl.textContent = "Logget inn, men fant ikke profil.";
      profileEl.textContent = profileError.message;
      return;
    }

    statusEl.textContent = "Logget inn.";
    profileEl.textContent = JSON.stringify(profile, null, 2);
    // redirect to home page after successful login
    setTimeout(() => {
      window.location.href = "index.html";
    }, 600);
  });
} else {
  console.error("Login form not found in DOM.");
  if (statusEl && !statusEl.textContent)
    statusEl.textContent = "Feil: Login-skjema ikke funnet.";
}
