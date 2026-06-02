async function sok() {
  const reg = document.getElementById("reg").value.trim().toUpperCase();
  const out = document.getElementById("out");
  const supabaseUrl = "https://gebtcnziczaayzwuiztk.supabase.co";
  const anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYnRjbnppY3phYXl6d3VpenRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTIxNTAsImV4cCI6MjA5NTg4ODE1MH0.RZGOF0jzgDJQfda8N6dDBJPYUa87Hz9PZtuxgAH8ALU";

  if (!reg) {
    out.textContent = "Skriv inn regnummer først.";
    return;
  }

  out.textContent = "Henter...";

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/bil`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reg }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      out.textContent = `Feil: ${res.status}\n${errorText}`;
      return;
    }

    const data = await res.json();

    out.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    out.textContent =
      "Klarte ikke å hente regnummer. Sjekk at Supabase-funksjonen er deployet.";
  }
}
