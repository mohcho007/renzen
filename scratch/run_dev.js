const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const lockPath = path.join(projectRoot, ".next", "dev-server.lock");

function isProcessRunning(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readLock() {
  if (!fs.existsSync(lockPath)) return null;
  const raw = fs.readFileSync(lockPath, "utf8").trim();
  const pid = Number.parseInt(raw, 10);
  return Number.isInteger(pid) ? pid : null;
}

function writeLock(pid) {
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  fs.writeFileSync(lockPath, String(pid));
}

function removeLock() {
  try {
    fs.unlinkSync(lockPath);
  } catch {
    /* ignore */
  }
}

const existingPid = readLock();
if (existingPid && isProcessRunning(existingPid)) {
  console.error(
    "\n❌ Another Next.js dev server is already running for this project.",
  );
  console.error(`   PID: ${existingPid}`);
  console.error(
    "   Running two dev servers shares .next and causes clientReferenceManifest errors.",
  );
  console.error("\n   Fix: stop the other server, then run:");
  console.error("   npm run dev:clean\n");
  process.exit(1);
}

if (existingPid) {
  removeLock();
}

const nextArgs = process.argv.slice(2);
const child = spawn("next", ["dev", ...nextArgs], {
  cwd: projectRoot,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: process.env,
});

writeLock(child.pid);

let cleanedUp = false;
function cleanup() {
  if (cleanedUp) return;
  cleanedUp = true;
  removeLock();
}

child.on("exit", (code, signal) => {
  cleanup();
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

process.on("SIGINT", () => {
  cleanup();
  child.kill("SIGINT");
});

process.on("SIGTERM", () => {
  cleanup();
  child.kill("SIGTERM");
});
