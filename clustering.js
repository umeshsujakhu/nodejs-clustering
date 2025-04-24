// with-clustering.js
const cluster = require("cluster");
const os = require("os");
const express = require("express");

const PORT = 3001;
const NUM_CPUS = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master PID: ${process.pid}`);
  console.log(`Spawning ${NUM_CPUS} workers...`);

  for (let i = 0; i < NUM_CPUS; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.warn(`Worker ${worker.process.pid} crashed. Restarting...`);
    cluster.fork();
  });
} else {
  startCluster();
}

function startCluster() {
  const app = express();
  console.log(`Worker PID ${process.pid} is online`);

  app.get("/", (req, res) => {
    res.send("Hello! This Node.js app uses clustering.");
  });

  app.get("/api/cluster", (req, res) => {
    console.time("ClusteredComputation");
    const base = 8;
    let total = 0;

    for (let i = Math.pow(base, 7); i >= 0; i--) {
      total += i + Math.pow(i, 10);
    }

    console.timeEnd("ClusteredComputation");
    console.log(`Worker ${process.pid} completed the computation.`);
    res.send(`Clustered result: ${total}`);
  });

  app.get("/crash", () => {
    console.log(`Simulating crash for worker ${process.pid}`);
    process.exit(1);
  });

  setInterval(() => {
    console.log(`Heartbeat from worker ${process.pid}`);
  }, 10000);

  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is listening on port ${PORT}`);
  });
}
