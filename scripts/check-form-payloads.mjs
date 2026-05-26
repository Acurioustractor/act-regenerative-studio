#!/usr/bin/env node

const baseUrl = (process.env.FORM_CHECK_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

const cases = [
  {
    name: 'footer newsletter',
    body: {
      dryRun: true,
      projectCode: 'ACT-IN',
      formType: 'newsletter',
      fields: { email: 'launch-check@example.test' },
      additionalTags: [
        'Newsletter',
        'Context: Footer newsletter signup',
        'Route: /',
        'Source: footer',
      ],
    },
    requiredTags: [
      'Newsletter',
      'Context: Footer newsletter signup',
      'Route: /',
      'Source: footer',
      'act-regenerative-studio',
    ],
  },
  {
    name: 'project newsletter',
    body: {
      dryRun: true,
      projectCode: 'ACT-GD',
      formType: 'newsletter',
      fields: { email: 'launch-check@example.test' },
      additionalTags: [
        'Newsletter',
        'Context: Follow Goods on Country field notes',
        'Route: /projects/goods',
        'Source: project-goods',
        'Project: goods',
        'Audience: project-reader',
        'Project title: Goods on Country',
      ],
    },
    requiredTags: [
      'Newsletter',
      'Route: /projects/goods',
      'Source: project-goods',
      'Project: goods',
      'Audience: project-reader',
      'act-regenerative-studio',
    ],
  },
  {
    name: 'story newsletter',
    body: {
      dryRun: true,
      projectCode: 'ACT-GD',
      formType: 'newsletter',
      fields: { email: 'launch-check@example.test' },
      additionalTags: [
        'Newsletter',
        'Context: Follow the field notes as consent clears',
        'Route: /stories/utopia-may-2026',
        'Source: story-utopia-may-2026',
        'Project: goods',
        'Story: utopia-may-2026',
        'Audience: story-reader',
        'Story tag: Goods',
      ],
    },
    requiredTags: [
      'Newsletter',
      'Route: /stories/utopia-may-2026',
      'Source: story-utopia-may-2026',
      'Project: goods',
      'Story: utopia-may-2026',
      'Audience: story-reader',
      'act-regenerative-studio',
    ],
  },
  {
    name: 'contact with route context',
    body: {
      dryRun: true,
      projectCode: 'ACT-IN',
      formType: 'contact',
      fields: {
        firstName: 'Launch',
        lastName: 'Check',
        email: 'launch-check@example.test',
        inquiryType: 'share-your-story',
        message: 'Local dry-run only.',
      },
      additionalTags: [
        'Contact Form',
        'Website Inquiry',
        'Context: General studio contact',
        'Route: /contact',
        'Source: stories',
        'Requested context: utopia-may-2026',
        'Public contact route',
      ],
    },
    requiredTags: [
      'Contact Form',
      'Website Inquiry',
      'Route: /contact',
      'Source: stories',
      'Requested context: utopia-may-2026',
      'act-regenerative-studio',
    ],
  },
];

const failures = [];
let productionDryRunBlocked = false;

async function postJson(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await response.text();

  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    failures.push(`${path}: response was not JSON: ${text.slice(0, 160)}`);
  }

  return { response, json, text };
}

for (const formCase of cases) {
  try {
    const { response, json, text } = await postJson('/api/forms/submit', formCase.body);

    if (response.status === 403 && json?.error === 'Dry run is unavailable in production') {
      productionDryRunBlocked = true;
      continue;
    }

    if (response.status !== 200) {
      failures.push(`${formCase.name}: expected 200, got ${response.status}: ${text.slice(0, 160)}`);
      continue;
    }

    if (!json?.success || json?.dryRun !== true) {
      failures.push(`${formCase.name}: expected successful dryRun response`);
      continue;
    }

    if (!json?.wouldForwardTo || json.wouldForwardTo.includes('example.test')) {
      failures.push(`${formCase.name}: missing safe forwarding target metadata`);
    }

    const submission = json.submission || {};
    const tags = submission.additionalTags || [];

    if (submission.formType !== formCase.body.formType) {
      failures.push(`${formCase.name}: expected formType ${formCase.body.formType}, got ${submission.formType}`);
    }

    if (submission.projectCode !== formCase.body.projectCode) {
      failures.push(`${formCase.name}: expected projectCode ${formCase.body.projectCode}, got ${submission.projectCode}`);
    }

    for (const tag of formCase.requiredTags) {
      if (!tags.includes(tag)) {
        failures.push(`${formCase.name}: missing tag "${tag}"`);
      }
    }
  } catch (error) {
    failures.push(`${formCase.name}: request failed: ${error.message}`);
  }
}

try {
  const { response } = await postJson('/api/forms/submit', {
    dryRun: true,
    formType: 'newsletter',
    fields: {},
    additionalTags: ['Newsletter'],
  });

  if (response.status !== 400) {
    failures.push(`invalid payload: expected 400 for missing email/phone, got ${response.status}`);
  }
} catch (error) {
  failures.push(`invalid payload: request failed: ${error.message}`);
}

if (failures.length > 0) {
  console.error(`Form payload check failed against ${baseUrl}`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Form payload check passed against ${baseUrl}`);
if (productionDryRunBlocked) {
  console.log('Verified production server blocks dry-run form submissions without sending a CRM lead.');
} else {
  console.log('Verified dry-run newsletter and contact payload tags without sending a CRM lead.');
}
