const baseUrl = process.env.ACT_PREVIEW_URL || "http://localhost:3001";

const routes = [
  "/",
  "/stories",
  "/questions",
  "/questions/when-should-the-work-no-longer-need-us",
  "/fields/art",
  "/fields/empathy",
  "/fields/justice",
  "/fields/goods",
  "/fields/harvest",
  "/prototypes/living-field",
  "/prototypes/living-field/art",
  "/prototypes/living-field/empathy",
  "/prototypes/living-field/justice",
  "/prototypes/living-field/goods",
  "/prototypes/living-field/harvest",
  "/prototypes/art-field",
  "/prototypes/story-remains",
  "/prototypes/justice-field",
  "/prototypes/goods-field",
  "/prototypes/harvest-field",
  "/prototypes/material-remembers",
  "/prototypes/field-history",
  "/prototypes/history-media",
  "/prototypes/story-atlas",
  "/prototypes/brand-guide",
  "/prototypes/field-notes",
  "/prototypes/field-notes/when-should-the-work-no-longer-need-us",
  "/prototypes/stories",
  "/art",
  "/blog",
  "/contact",
];

const requiredHomepageText = [
  "Make the",
  "system felt",
  "Choose a way into the work",
  "Enter the field story",
  "Receive the next field letter",
  "The gate is open",
];

const forbiddenCopy = [
  "Programme coming soon",
  "Travelling Women’s Car",
  "Travelling Women's Car",
  "CivicGraph",
];

const brandedPrototypeRoutes = routes.filter((route) => route.startsWith("/prototypes/"));

let failed = false;

for (const route of routes) {
  try {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
    if (!response.ok) {
      failed = true;
      console.error(`FAIL ${response.status} ${route}`);
    } else {
      console.log(`PASS ${response.status} ${route}`);
    }
  } catch (error) {
    failed = true;
    console.error(`FAIL connection ${route}: ${error instanceof Error ? error.message : error}`);
  }
}

for (const route of brandedPrototypeRoutes) {
  try {
    const html = await (await fetch(`${baseUrl}${route}`)).text();
    if (!html.includes("/branding/act-place-logo.png")) {
      failed = true;
      console.error(`FAIL shared ACT mark missing ${route}`);
    } else {
      console.log(`PASS shared ACT mark ${route}`);
    }
  } catch (error) {
    failed = true;
    console.error(`FAIL brand check ${route}: ${error instanceof Error ? error.message : error}`);
  }
}

try {
  const homepage = await (await fetch(`${baseUrl}/prototypes/living-field`)).text();
  for (const text of requiredHomepageText) {
    if (!homepage.includes(text)) {
      failed = true;
      console.error(`FAIL homepage missing: ${text}`);
    }
  }
  for (const text of forbiddenCopy) {
    if (homepage.includes(text)) {
      failed = true;
      console.error(`FAIL forbidden homepage copy: ${text}`);
    }
  }
} catch (error) {
  failed = true;
  console.error(`FAIL homepage content check: ${error instanceof Error ? error.message : error}`);
}

try {
  const response = await fetch(`${baseUrl}/api/forms/submit`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      projectCode: "ACT-IN",
      formType: "newsletter",
      fields: { email: "living-field-qa@example.invalid", signupContext: "Automated dry run" },
      additionalTags: ["source:website-living-field"],
      dryRun: true,
    }),
  });
  const result = await response.json();
  if (!response.ok || result.success !== true || result.dryRun !== true) {
    failed = true;
    console.error("FAIL newsletter dry-run validation", result);
  } else {
    console.log("PASS newsletter dry-run validation (no CRM submission)");
  }
} catch (error) {
  failed = true;
  console.error(`FAIL newsletter dry run: ${error instanceof Error ? error.message : error}`);
}

if (failed) process.exit(1);
console.log("Living Field QA passed.");
