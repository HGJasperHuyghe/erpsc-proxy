# ERPSC CORS-proxy

Stuurt requests door naar de games-API en voegt CORS-headers toe, zodat de webpreview van SAP Build Apps werkt.

## Deploy op Render
1. Zet deze map in een (privé) GitHub-repo.
2. Render → New → Web Service → kies de repo.
3. Build command: `npm install` · Start command: `npm start` · Instance: Free.
4. Test: `https://<jouw-service>.onrender.com/odata/GamesSet?$format=json&$top=1`

## In SAP Build Apps
Zet bij **Games** en **FavoGames** de Base API URL op:
`https://<jouw-service>.onrender.com/odata`
De relatieve paden blijven hetzelfde.

Let op: de gratis Render-instance slaapt na inactiviteit; de eerste request duurt dan ~30-50 s.
