import { createServer } from "node:http";

const server = createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ message: "Route not found" }));
});

server.listen(3001, "127.0.0.1", () => {
  console.log("Workout API: http://127.0.0.1:3001");
});
