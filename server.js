const http = require("http");
const { URL } = require("url");

const PORT = 3000;
const API_KEY = "dfc8db2d-413c-4f72-bb39-8ea7b0588064";

const requestHandler = async (req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname !== "/bil") {
    res.writeHead(404, headers);
    res.end("Not found");
    return;
  }

  const reg = url.searchParams.get("reg") || "";
  if (!reg) {
    res.writeHead(400, { ...headers, "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Mangler reg" }));
    return;
  }

  try {
    const resp = await fetch(
      `https://akfell-datautlevering.atlas.vegvesen.no/enkeltoppslag/kjoretoydata?kjennemerke=${encodeURIComponent(
        reg,
      )}`,
      {
        headers: {
          "SVV-Authorization": `Apikey ${API_KEY}`,
        },
      },
    );

    const body = await resp.text();

    res.writeHead(resp.status, {
      ...headers,
      "Content-Type": "application/json; charset=utf-8",
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { ...headers, "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Klarte ikke hente data" }));
  }
};

const server = http.createServer((req, res) => {
  requestHandler(req, res).catch((e) => {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Server error" }));
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Usage: node server.js (requires Node 18+ for global fetch)
