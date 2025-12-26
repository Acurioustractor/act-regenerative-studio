# Caching Strategy

**Purpose**: Optimize API performance and reduce rate limit impact

**Last Updated**: 2025-12-26

---

## Overview

The ACT Ecosystem dashboards fetch data from multiple sources:
- GitHub API (repo stats, issues, PRs, events)
- Vercel API (deployment status)

To optimize performance and avoid rate limits, we implement multi-layer caching.

---

## Caching Layers

### 1. Next.js Fetch Cache (Built-in)

All `fetch()` calls in Next.js use automatic HTTP caching:

```typescript
// Automatically cached for 60 seconds
const response = await fetch('https://api.github.com/repos/...', {
  next: { revalidate: 60 }
});
```

**Benefits**:
- Zero configuration needed
- Works server-side and client-side
- Respects HTTP cache headers

**Configuration**:
- GitHub API calls: 60-second revalidation
- Vercel API calls: 60-second revalidation
- Static data: 3600-second revalidation

---

### 2. Client-Side In-Memory Cache

For components that fetch client-side (useEffect), we use an in-memory cache utility:

**Location**: `src/lib/cache.ts`

**Usage**:
```typescript
import { cachedFetch } from '@/lib/cache';

// Cached for 60 seconds by default
const data = await cachedFetch('https://api.github.com/...');

// Custom TTL
const data = await cachedFetch('https://api.github.com/...', {}, 300000); // 5 minutes
```

**Benefits**:
- Reduces redundant API calls
- Configurable TTL per endpoint
- Simple cache invalidation

---

## Cache TTL Guidelines

| Data Type | TTL | Reasoning |
|-----------|-----|-----------|
| GitHub repo stats | 60s | Changes frequently, needs to be fresh |
| GitHub events | 60s | Real-time activity feed |
| GitHub issues/PRs | 120s | Don't change as frequently |
| Vercel deployments | 60s | Deployment status changes often |
| Project metadata | 1h | Rarely changes |
| Ecosystem stats | 60s | Aggregated from multiple sources |

---

## Rate Limiting

**GitHub API Limits**:
- Unauthenticated: 60 requests/hour
- Authenticated: 5000 requests/hour

**Current Usage** (per dashboard load):
- Team Dashboard: ~21 requests (7 projects × 3 endpoints each)
- Public Showcase: 0 requests (static data)
- Activity Feed: ~7 requests (7 projects × 1 endpoint each)

**Total**: ~28 requests per full dashboard load

**With 60s cache**: Max 60 loads/hour = 1680 requests/hour (well within limits)

---

## Optimization Strategies

### 1. Batch Requests

Instead of fetching repos one-by-one, batch where possible:

```typescript
// ❌ Bad: 7 separate requests
for (const repo of repos) {
  await fetch(`/repos/${repo}`);
}

// ✅ Good: 1 request for multiple repos
const data = await fetch(`/orgs/Acurioustractor/repos`);
```

### 2. Parallel Fetching

Use `Promise.all()` for independent requests:

```typescript
const [issues, prs, commits] = await Promise.all([
  fetch(`/repos/${repo}/issues`),
  fetch(`/repos/${repo}/pulls`),
  fetch(`/repos/${repo}/commits`),
]);
```

### 3. Stale-While-Revalidate

Show cached data immediately, refresh in background:

```typescript
const cached = apiCache.get(key);
if (cached) {
  setData(cached); // Show immediately

  // Revalidate in background
  fetch(url).then(fresh => {
    apiCache.set(key, fresh);
    setData(fresh);
  });
}
```

---

## Cache Invalidation

### Automatic
- TTL expiration (handled automatically)
- Component unmount (useEffect cleanup)

### Manual
```typescript
import { apiCache } from '@/lib/cache';

// Clear entire cache
apiCache.clear();

// Clear specific entry
apiCache.delete(key);
```

---

## Monitoring

Check cache performance in browser console:

```typescript
import { getCacheStats } from '@/lib/cache';

console.log(getCacheStats());
// { size: 42, keys: [...] }
```

---

## Future Enhancements

**Supabase Cache Layer** (planned for Sprint 4):
- Store aggregated stats in database
- Update via cron job every 5 minutes
- Eliminates GitHub API dependency for dashboard loads

**Redis Cache** (future consideration):
- For production deployments
- Shared cache across instances
- Persistent cache across restarts

---

## Best Practices

✅ **Do**:
- Use built-in Next.js caching where possible
- Set appropriate TTL based on data volatility
- Monitor cache hit rates
- Handle cache misses gracefully

❌ **Don't**:
- Cache error responses
- Set TTL too high for dynamic data
- Assume cache will always be populated
- Store sensitive data in client cache

---

**Related Documentation**:
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [GitHub API Rate Limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)

---

**Maintained By**: ACT Ecosystem Team
**Last Review**: 2025-12-26
