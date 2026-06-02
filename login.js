const supabaseUrl = "https://gebtcnziczaayzwuiztk.supabase.co";
const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYnRjbnppY3phYXl6d3VpenRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTIxNTAsImV4cCI6MjA5NTg4ODE1MH0.RZGOF0jzgDJQfda8N6dDBJPYUa87Hz9PZtuxgAH8ALU";

const supabase = window.supabase.createClient(supabaseUrl, anonKey);
const form = document.getElementById("login-form");
const statusEl = document.getElementById("status");
const profileEl = document.getElementById("profile");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Logger inn...";
  profileEl.textContent = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    statusEl.textContent = error.message;
    return;
  }

  const userId = data.user.id;
  const { data: profile, error: profileError } = await supabase
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
});
