async function sok() {
  const reg = document.getElementById("reg").value;
  const out = document.getElementById("out");

  if (!reg) {
    out.textContent = "Skriv inn regnummer først.";
    return;
  }

  out.textContent = "Henter...";

  try {
    const res = await fetch(
      `http://localhost:3000/bil?reg=${encodeURIComponent(reg)}`,
    );

    if (!res.ok) {
      const errorText = await res.text();
      out.textContent = `Feil: ${res.status}\n${errorText}`;
      return;
    }

    const data = await res.json();

    out.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    out.textContent =
      "Klarte ikke å hente regnummer. Sjekk at serveren kjører.";
  }
}
