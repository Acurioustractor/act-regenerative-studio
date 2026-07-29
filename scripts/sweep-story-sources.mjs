import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "src/data/story-source-index.generated.json");

const repositories = [
  {
    code: "ACT-CORE", name: "A Curious Tractor", field: "The whole field",
    repoPath: "/Users/benknight/Code/act-regenerative-studio", site: "https://act.place",
    governance: "hub", accent: "#2D5A3D",
    invitation: "Begin with the art. Follow the object, image or question into the wider field.",
    storyThread: "Two people learning what to build, what to hold and what to give away.",
    motionIdea: "A quiet aerial field gives way to objects, hands and unfinished work.",
  },
  {
    code: "ACT-EL", name: "Empathy Ledger", field: "Story",
    repoPath: "/Users/benknight/Code/empathy-ledger-v2", site: "https://www.empathyledger.com",
    governance: "authority", accent: "#96643A",
    invitation: "Hear a voice. See how permission travels with it.",
    storyThread: "The story remains with the storyteller after the camera leaves.",
    motionIdea: "Voice, breath and transcript move together. Consent remains visible at the edge.",
  },
  {
    code: "ACT-JH", name: "JusticeHub", field: "Justice",
    repoPath: "/Users/benknight/Code/JusticeHub", site: "https://www.justicehub.com.au",
    governance: "project-review", accent: "#4A2560",
    invitation: "Enter through CONTAINED. Leave through a community alternative.",
    storyThread: "The cell is expensive. The fire already holds another answer.",
    motionIdea: "A container opens into roads, programs, people and proof.",
  },
  {
    code: "ACT-GD", name: "Goods on Country", field: "Making",
    repoPath: "/Users/benknight/Code/Goods Asset Register", site: "https://www.goodsoncountry.com",
    governance: "project-review", accent: "#B75C3B",
    invitation: "Touch the object. Follow its materials, repair and value home.",
    storyThread: "A bed arrives. The harder question is what stays after the truck leaves.",
    motionIdea: "Assembly, testing and distance become a moving material story.",
  },
  {
    code: "ACT-HV", name: "The Harvest", field: "Hospitality",
    repoPath: "/Users/benknight/Code/The Harvest Website", site: "https://theharvestwitta.com.au",
    governance: "project-review", accent: "#A06A45",
    invitation: "Come to the table. Find the garden, kitchen and people holding it open.",
    storyThread: "A kettle, a plate and a garden lower the distance between strangers.",
    motionIdea: "Hands move from soil to table while the day changes around the place.",
  },
  {
    code: "ACT-FM", name: "Black Cockatoo Valley", field: "Place",
    repoPath: "/Users/benknight/Code/act-farm", site: "https://act.place/farm",
    governance: "project-review", accent: "#46664B",
    invitation: "Walk into the valley. Let place slow the rest of the website down.",
    storyThread: "Place is one of the ways the work thinks.",
    motionIdea: "Mist, creek, fence, bird and boots. No rush to explain.",
  },
  {
    code: "ACT-ART", name: "Art + CONTAINED", field: "Art",
    repoPath: "/Users/benknight/Code/Contained", site: "https://www.justicehub.com.au/contained",
    governance: "archive-reference", accent: "#C4845C",
    invitation: "Cross the threshold. Feel the system before reading about it.",
    storyThread: "Art keeps the contradiction in the room.",
    motionIdea: "Darkness, steel, light and voice turn a page into an encounter.",
  },
  {
    code: "ACT-OO", name: "Oonchiumpa", field: "Community authority",
    repoPath: "/Users/benknight/Code/Oochiumpa", site: null,
    governance: "partner-boundary", accent: "#8B5B3E",
    invitation: "A governed source. Nothing travels without community authority.",
    storyThread: "The kitchen table holds the decision before the platform does.",
    motionIdea: "Interaction pattern reference only until a media packet is approved.",
  },
  {
    code: "ACT-PI", name: "Palm Island Repository", field: "Community archive",
    repoPath: "/Users/benknight/Code/Palm Island Reposistory", site: null,
    governance: "client-boundary", accent: "#4C7180",
    invitation: "A community archive, not an ACT media library.",
    storyThread: "The story returns to the island and remains governed there.",
    motionIdea: "Study the archive pattern. Do not lift the archive material.",
  },
  {
    code: "ACT-VIDEO", name: "ACT video storytelling", field: "Movement",
    repoPath: "/Users/benknight/Code/act-video-storytelling", site: null,
    governance: "prototype-reference", accent: "#6E5A72",
    invitation: "Test how voice can move without becoming spectacle.",
    storyThread: "The edit follows breath before it follows brand.",
    motionIdea: "Voice Canvas, emotional arcs and photo reveals form the motion grammar.",
  },
  {
    code: "ACT-10Y", name: "Living story map", field: "Time",
    repoPath: "/Users/benknight/Code/10-years", site: null,
    governance: "partner-boundary", accent: "#817042",
    invitation: "A governed Oonchiumpa and Palm story system.",
    storyThread: "People move across time. Aspirations become milestones.",
    motionIdea: "Use the horizontal-time and vertical-people pattern, not its community media.",
  },
  {
    code: "ACT-RV", name: "Reciprocal Voices", field: "Participation",
    repoPath: "/Users/benknight/Code/reciprocal-voices-interactive", site: null,
    governance: "prototype-reference", accent: "#68735B",
    invitation: "Pick up the handset. A voice changes the space around it.",
    storyThread: "Listening is an action the visitor performs.",
    motionIdea: "Voice particles gather and separate around a physical gesture.",
  },
];

const skipDirs = new Set([
  ".git", ".next", "node_modules", "dist", "build", ".turbo", ".vercel", "coverage", ".cache",
  ".claude", ".gstack", ".chrome-debug-profile", "artifacts", "test-artifacts", "venv", ".venv",
]);
const mediaExt = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg", ".mp4", ".mov", ".webm", ".mp3", ".wav", ".m4a"]);
const textExt = new Set([".md", ".mdx", ".html", ".tsx", ".jsx", ".json", ".csv"]);
const storyWords = /(story|stories|history|reflection|review|journal|newsletter|field.?note|article|blog|oral|interview|transcript|contained|art|case.?stud|year)/i;
const governanceWords = /(consent|permission|cultural|elder|family.?review|govern|protocol|approval|authority|syndicat|provenance|credit)/i;
const excludedMediaPath = /(^|\/)(qr_|qr-|qr\/|icons?\/|playwright|screenshots?|report-assets|test-results?|fixtures?)(\/|$)/i;
const sensitiveSourcePath = /(^|\/)(backup_original_names|filename_mapping\.txt)(\/|$)/i;
const mediaStoryWords = /(story|history|review|reflection|interview|portrait|community|country|contained|justice|empathy|goods|harvest|farm|valley|ceremony|campfire|dad.?lab|smart|bwgcolman|palm|oonchiumpa|kalgoorlie|kalkadoon|jinibara|witta|making|build|garden|creek|aerial|art)/i;

async function walk(repoPath) {
  const files = [];
  async function visit(dir) {
    let entries;
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      if (entry.name.startsWith(".env")) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!skipDirs.has(entry.name)) await visit(full);
      } else if (entry.isFile()) {
        files.push(full);
      }
    }
  }
  await visit(repoPath);
  return files;
}

function relative(repoPath, file) { return path.relative(repoPath, file); }
function sortCandidates(items) {
  return [...items].sort((a, b) => b.score - a.score || a.path.localeCompare(b.path)).slice(0, 18);
}

async function scan(repo) {
  const exists = await fs.stat(repo.repoPath).then(() => true).catch(() => false);
  if (!exists) return { ...repo, exists: false, counts: {}, candidates: [], mediaCandidates: [], governanceFiles: [], mediaDirectories: [] };
  const files = await walk(repo.repoPath);
  const media = [];
  const candidates = [];
  const governanceFiles = [];
  const mediaCandidates = [];
  const directoryCounts = new Map();

  for (const file of files) {
    const rel = relative(repo.repoPath, file);
    if (sensitiveSourcePath.test(rel)) continue;
    const ext = path.extname(file).toLowerCase();
    if (mediaExt.has(ext) && !excludedMediaPath.test(rel)) {
      const kind = [".mp4", ".mov", ".webm"].includes(ext) ? "video" : [".mp3", ".wav", ".m4a"].includes(ext) ? "audio" : "image";
      media.push({ path: rel, kind });
      let mediaScore = kind === "video" ? 5 : kind === "audio" ? 4 : 1;
      if (mediaStoryWords.test(rel)) mediaScore += 5;
      if (/(hero|feature|cover|opening|final|edit|documentary|episode|journey)/i.test(rel)) mediaScore += 3;
      if (/(public|media|assets|gallery|stories|projects)/i.test(rel)) mediaScore += 1;
      if (!/(logo|icon|favicon|placeholder|thumbnail|avatar|sprite|mockup|screenshot)/i.test(rel)) {
        mediaCandidates.push({ path: rel, score: mediaScore, kind });
      }
      const dir = path.dirname(rel).split(path.sep).slice(0, 3).join("/") || ".";
      directoryCounts.set(dir, (directoryCounts.get(dir) || 0) + 1);
    }
    if (textExt.has(ext) && storyWords.test(rel)) {
      let score = 1;
      if (/(history|reflection|year|review|journal)/i.test(rel)) score += 4;
      if (/(story|article|blog|newsletter|field.?note)/i.test(rel)) score += 3;
      if (/(public|src\/app|docs|thoughts\/wiki)/i.test(rel)) score += 1;
      candidates.push({ path: rel, score, kind: ext.slice(1) });
    }
    if (textExt.has(ext) && governanceWords.test(rel)) governanceFiles.push(rel);
  }

  const counts = {
    files: files.length,
    images: media.filter((item) => item.kind === "image").length,
    videos: media.filter((item) => item.kind === "video").length,
    audio: media.filter((item) => item.kind === "audio").length,
    storyCandidates: candidates.length,
    governanceFiles: governanceFiles.length,
  };

  return {
    ...repo,
    exists: true,
    counts,
    candidates: sortCandidates(candidates),
    mediaCandidates: sortCandidates(mediaCandidates),
    governanceFiles: governanceFiles.sort().slice(0, 18),
    mediaDirectories: [...directoryCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([directory, count]) => ({ directory, count })),
  };
}

const projects = [];
for (const repository of repositories) projects.push(await scan(repository));

const totals = projects.reduce((sum, project) => {
  for (const key of ["images", "videos", "audio", "storyCandidates", "governanceFiles"]) sum[key] += project.counts[key] || 0;
  return sum;
}, { images: 0, videos: 0, audio: 0, storyCandidates: 0, governanceFiles: 0 });

const result = {
  generatedAt: new Date().toISOString(),
  policy: "Discovery only. Files are not copied. Repository presence and public paths do not establish permission. Empathy Ledger authority records govern reuse.",
  publishingChain: ["canonical project", "Empathy Ledger record", "consent, credit and cultural review", "approved derivative packet", "ACT history"],
  totals,
  projects,
};

await fs.writeFile(OUTPUT, JSON.stringify(result, null, 2) + "\n");
console.log(`Story source index written: ${path.relative(ROOT, OUTPUT)}`);
console.log(JSON.stringify(totals));
