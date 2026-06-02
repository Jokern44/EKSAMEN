(function () {
  const SUPABASE_URL = "https://gebtcnziczaayzwuiztk.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYnRjbnppY3phYXl6d3VpenRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTIxNTAsImV4cCI6MjA5NTg4ODE1MH0.RZGOF0jzgDJQfda8N6dDBJPYUa87Hz9PZtuxgAH8ALU";

  if (window._supabaseClient) return;
  // hvis ikke browser-wide supabase finnes, eller window.supabase.createclient ikke er en funksjon, så gjør det under
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("Supabase CDN not loaded before supabase-client.js");
    return;
  }

  try {
    window._supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
    );
  } catch (e) {
    console.error("Failed to create Supabase client", e);
  }
})();
