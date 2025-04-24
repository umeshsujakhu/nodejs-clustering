// no-clustering.js
const express = require("express");
const app = express();
const PORT = 3000;

console.log(`Single process started with PID: ${process.pid}`);

app.get("/", (req, res) => {
  res.send("Hello! This is a non-clustered Node.js app.");
});

app.get("/api/nocluster", (req, res) => {
  console.time("HeavyComputation");
  const base = 8;
  let total = 0;

  for (let i = Math.pow(base, 7); i >= 0; i--) {
    total += i + Math.pow(i, 10);
  }

  console.timeEnd("HeavyComputation");

  console.log(`Computed result: ${total} on PID: ${process.pid}`);
  res.send(`Computed result: ${total}`);
});

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
