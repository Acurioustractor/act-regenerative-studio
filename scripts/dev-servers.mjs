#!/usr/bin/env node
/**
 * ACT Development Hub - Multi-Project Server Orchestrator
 *
 * Starts all ACT projects simultaneously with:
 * - Unique ports for each project
 * - Shared NAS services (Redis, ChromaDB)
 * - Live reload for all projects
 * - Auto-restart on crashes
 * - Visual status dashboard
 *
 * Usage: npm start
 */

import { spawn } from 'child_process';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CODE_DIR = path.resolve(__dirname, '..');

// Project configuration
const PROJECTS = [
  {
    name: 'ACT Main Website',
    dir: path.join(CODE_DIR, 'ACT Farm and Regenerative Innovation Studio'),
    port: 3000,
    color: '\x1b[92m', // Bright Green
    enabled: true,
  },
  {
    name: 'Admin Wiki',
    dir: path.join(CODE_DIR, 'ACT Farm and Regenerative Innovation Studio/admin-wiki'),
    port: 4000,
    color: '\x1b[36m', // Cyan
    enabled: true,
  },
  {
    name: 'ACT Farm',
    dir: path.join(CODE_DIR, 'ACT Farm/act-farm'),
    port: 3001,
    color: '\x1b[32m', // Green
    enabled: true,
  },
  {
    name: 'JusticeHub',
    dir: path.join(CODE_DIR, 'JusticeHub'),
    port: 3002,
    color: '\x1b[34m', // Blue
    enabled: true,
  },
  {
    name: 'Empathy Ledger',
    dir: path.join(CODE_DIR, 'empathy-ledger-v2'),
    port: 3003,
    color: '\x1b[35m', // Magenta
    enabled: true,
  },
  {
    name: 'The Harvest',
    dir: '/Users/benknight/Downloads/witta-swot-analysis',
    port: 3004,
    color: '\x1b[33m', // Yellow
    enabled: true,
  },
  // ACT Placemat (Monorepo - 3 apps)
  {
    name: 'ACT Placemat - Backend',
    dir: path.join(CODE_DIR, 'ACT Placemat/apps/backend'),
    port: 4000,
    color: '\x1b[95m', // Bright Magenta
    enabled: true,
    tier: 'shared-services',
    command: 'npm',
    args: ['start'],
  },
  {
    name: 'ACT Dashboard',
    dir: path.join(CODE_DIR, 'ACT Placemat/apps/frontend'),
    port: 3006,
    color: '\x1b[96m', // Bright Cyan
    enabled: true,
  },
  {
    name: 'Year in Review',
    dir: path.join(CODE_DIR, 'ACT Placemat/apps/webflow-portfolio'),
    port: 3007,
    color: '\x1b[93m', // Bright Yellow
    enabled: true,
  },
];

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

// Server state
const servers = new Map();
const startTime = Date.now();

// Status dashboard server
function startDashboard() {
  const server = createServer((req, res) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const activeProjects = PROJECTS.filter(p => p.enabled);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>ACT Development Hub</title>
  <meta http-equiv="refresh" content="5">
  <style>
    body {
      font-family: 'SF Mono', Monaco, 'Courier New', monospace;
      background: #1a1a1a;
      color: #fff;
      padding: 40px;
      margin: 0;
    }
    h1 {
      color: #4ade80;
      margin-bottom: 10px;
    }
    .subtitle {
      color: #888;
      margin-bottom: 40px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .card {
      background: #2a2a2a;
      border: 1px solid #3a3a3a;
      border-radius: 8px;
      padding: 20px;
    }
    .card.running {
      border-left: 4px solid #4ade80;
    }
    .card.stopped {
      border-left: 4px solid #ef4444;
    }
    .project-name {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .status.running {
      background: #166534;
      color: #4ade80;
    }
    .status.stopped {
      background: #7f1d1d;
      color: #ef4444;
    }
    .info {
      color: #888;
      font-size: 14px;
      line-height: 1.8;
    }
    .link {
      color: #60a5fa;
      text-decoration: none;
      font-weight: bold;
    }
    .link:hover {
      text-decoration: underline;
    }
    .services {
      background: #2a2a2a;
      border: 1px solid #3a3a3a;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
    }
    .services h2 {
      color: #4ade80;
      margin-top: 0;
    }
    .service-item {
      padding: 10px;
      background: #1a1a1a;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .uptime {
      position: fixed;
      top: 20px;
      right: 40px;
      color: #888;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <h1>🚀 ACT Development Hub</h1>
  <div class="subtitle">All projects running with live reload</div>
  <div class="uptime">Uptime: ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${uptime % 60}s</div>

  <div class="grid">
    ${activeProjects.map(project => {
      const serverInfo = servers.get(project.name);
      const isRunning = serverInfo && !serverInfo.stopped;

      return `
        <div class="card ${isRunning ? 'running' : 'stopped'}">
          <div class="project-name">${project.name}</div>
          <div class="status ${isRunning ? 'running' : 'stopped'}">
            ${isRunning ? '● RUNNING' : '○ STOPPED'}
          </div>
          <div class="info">
            Port: <span style="color: #4ade80">${project.port}</span><br>
            URL: <a href="http://localhost:${project.port}" class="link" target="_blank">localhost:${project.port}</a><br>
            ${serverInfo ? `PID: ${serverInfo.pid}<br>` : ''}
            ${serverInfo ? `Restarts: ${serverInfo.restarts || 0}` : ''}
          </div>
        </div>
      `;
    }).join('')}
  </div>

  <div class="services">
    <h2>Shared NAS Services</h2>
    <div class="service-item">
      <strong>Redis:</strong> <a href="http://192.168.0.34:6379" class="link">192.168.0.34:6379</a>
      <span style="color: #888; margin-left: 10px">Caching for all projects</span>
    </div>
    <div class="service-item">
      <strong>ChromaDB:</strong> <a href="http://192.168.0.34:8000" class="link">192.168.0.34:8000</a>
      <span style="color: #888; margin-left: 10px">Vector search</span>
    </div>
    <div class="service-item">
      <strong>Portainer:</strong> <a href="http://192.168.0.34:9000" class="link">192.168.0.34:9000</a>
      <span style="color: #888; margin-left: 10px">Container management</span>
    </div>
  </div>

  <div style="margin-top: 40px; color: #666; font-size: 12px;">
    Auto-refreshes every 5 seconds | Press Ctrl+C in terminal to stop all servers
  </div>
</body>
</html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  });

  server.listen(3999, () => {
    console.log(`\n${BOLD}📊 Dashboard:${RESET} http://localhost:3999\n`);
  });
}

// Start a project server
function startProject(project) {
  if (!project.enabled) return;

  console.log(`${project.color}${BOLD}[${project.name}]${RESET} Starting on port ${project.port}...`);

  const env = {
    ...process.env,
    PORT: project.port.toString(),
    // Shared NAS services
    REDIS_URL: 'redis://192.168.0.34:6379',
    CHROMADB_URL: 'http://192.168.0.34:8000',
    PATH: process.env.PATH,
  };

  // Support custom commands (e.g., backend using 'npm start' instead of 'npm run dev')
  const command = project.command || '/Users/benknight/.nvm/versions/node/v20.19.3/bin/npm';
  const args = project.args || ['run', 'dev', '--', '-p', project.port.toString()];

  const child = spawn(command, args, {
    cwd: project.dir,
    env,
    stdio: 'pipe',
  });

  servers.set(project.name, {
    process: child,
    pid: child.pid,
    restarts: 0,
    stopped: false,
  });

  // Handle stdout
  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(l => l.trim());
    lines.forEach(line => {
      // Highlight important messages
      if (line.includes('Local:') || line.includes('localhost')) {
        console.log(`${project.color}${BOLD}[${project.name}]${RESET} ${line}`);
      } else if (line.includes('Ready') || line.includes('compiled')) {
        console.log(`${project.color}[${project.name}]${RESET} ${DIM}${line}${RESET}`);
      } else {
        // Suppress verbose output
        if (!line.includes('Compiling') && !line.includes('webpack')) {
          console.log(`${project.color}[${project.name}]${RESET} ${DIM}${line}${RESET}`);
        }
      }
    });
  });

  // Handle stderr
  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(l => l.trim());
    lines.forEach(line => {
      if (!line.includes('ExperimentalWarning') && !line.includes('webpack')) {
        console.log(`${project.color}[${project.name}]${RESET} ${line}`);
      }
    });
  });

  // Handle exit
  child.on('exit', (code) => {
    const serverInfo = servers.get(project.name);

    if (code !== 0 && !serverInfo.stopped) {
      serverInfo.restarts++;
      console.log(`${project.color}${BOLD}[${project.name}]${RESET} Crashed (code ${code}). Restarting in 3s...`);

      setTimeout(() => {
        if (!serverInfo.stopped) {
          startProject(project);
        }
      }, 3000);
    } else {
      console.log(`${project.color}[${project.name}]${RESET} Stopped`);
    }
  });
}

// Graceful shutdown
function shutdown() {
  console.log(`\n${BOLD}Shutting down all servers...${RESET}`);

  for (const [name, server] of servers.entries()) {
    server.stopped = true;
    console.log(`Stopping ${name}...`);
    server.process.kill();
  }

  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Main startup
console.log(`${BOLD}
╔════════════════════════════════════════╗
║   ACT Development Hub Starting...      ║
╚════════════════════════════════════════╝
${RESET}`);

console.log(`${DIM}Shared NAS Services:${RESET}`);
console.log(`  Redis:     redis://192.168.0.34:6379`);
console.log(`  ChromaDB:  http://192.168.0.34:8000`);
console.log(`  Portainer: http://192.168.0.34:9000\n`);

// Start dashboard first
startDashboard();

// Wait a moment, then start all projects
setTimeout(() => {
  PROJECTS.forEach(project => {
    if (project.enabled) {
      startProject(project);
    }
  });

  console.log(`\n${BOLD}All servers started!${RESET}`);
  console.log(`${DIM}View status at: http://localhost:3999${RESET}\n`);
}, 1000);
