// Kleine CORS-proxy voor de ERPSC games-API (alleen deze ene API, geen open proxy)
const express = require("express");
const app = express();

const TARGET = "https://a03p.ucc.cloud/sap/opu/odata/sap/ZAS_IGDB_GAMES_GW_SRV";
const PORT = process.env.PORT || 3000;

app.use(express.text({ type: "*/*" }));

app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, x-requested-with",
  });
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", (_req, res) => res.send("ERPSC proxy OK"));

app.all("/odata/*", async (req, res) => {
  const path = req.originalUrl.replace(/^\/odata/, "");
  try {
    const upstream = await fetch(TARGET + path, {
      method: req.method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-requested-with": "X",
      },
      body: ["POST", "PUT", "PATCH"].includes(req.method) ? req.body : undefined,
    });
    const text = await upstream.text();
    res.status(upstream.status);
    const ct = upstream.headers.get("content-type");
    if (ct) res.set("Content-Type", ct);
    res.send(text);
  } catch (err) {
    res.status(502).json({ error: "Upstream niet bereikbaar", detail: String(err) });
  }
});

app.listen(PORT, () => console.log("Proxy luistert op poort " + PORT));
