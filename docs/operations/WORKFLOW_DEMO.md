/**
 * Vercel API Client
 *
 * Fetches real deployment data from Vercel API
 * Issue #32: Integrate with Vercel API
 */

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: 'BUILDING' | 'ERROR' | 'READY' | 'CANCELED';
  ready: number;
  target: 'production' | 'preview';
}

/**
 * Fetch deployments for a project
 */
export async function getDeployments(projectName: string, limit = 10): Promise<VercelDeployment[]> {
  if (!VERCEL_TOKEN) {
    throw new Error('VERCEL_TOKEN not configured');
  }

  const url = `https://api.vercel.com/v6/deployments?projectId=${projectName}&limit=${limit}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Vercel API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.deployments;
}

/**
 * Get latest production deployment
 */
export async function getLatestProduction(projectName: string): Promise<VercelDeployment | null> {
  const deployments = await getDeployments(projectName, 50);
  const production = deployments.find(d => d.target === 'production' && d.state === 'READY');
  return production || null;
}

/**
 * Check deployment status
 */
export async function getDeploymentStatus(deploymentId: string): Promise<string> {
  if (!VERCEL_TOKEN) {
    throw new Error('VERCEL_TOKEN not configured');
  }

  const url = `https://api.vercel.com/v13/deployments/${deploymentId}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Vercel API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.state;
}
