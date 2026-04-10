# Hook: Post-Deploy

Verification steps to run after every successful Vercel deployment.

## Purpose

Confirm the production deployment is healthy and all critical paths are functional before considering a release complete.

## Trigger

Runs automatically after Vercel deployment succeeds (via GitHub Actions webhook or Vercel deploy hook).

## Verification Checklist

### Smoke Tests (automated)

```bash
# Check home page returns 200
curl -s -o /dev/null -w "%{http_code}" $NEXT_PUBLIC_APP_URL
# Expected: 200

# Check doctors page returns 200
curl -s -o /dev/null -w "%{http_code}" $NEXT_PUBLIC_APP_URL/doctors
# Expected: 200

# Check API health endpoint
curl -s $NEXT_PUBLIC_APP_URL/api/health
# Expected: {"status":"ok"}
```

### Manual Verification (per deploy)

- [ ] Home page loads and renders correctly in both vi and en
- [ ] Doctor list displays (mock data Phase 1, or Contentful/DB Phase 2+)
- [ ] Booking form is accessible and submits without error
- [ ] Language switcher toggles between Vietnamese and English
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive layout intact (test at 375px width)

### Phase 2+ Additional Checks

- [ ] Patient registration flow works end-to-end
- [ ] Login/logout cycle completes without error
- [ ] Portal page loads with correct appointment data
- [ ] Confirmation email received after test booking

## Rollback Procedure

If post-deploy checks fail:

1. Go to Vercel dashboard → Deployments
2. Find the previous successful deployment
3. Click "Promote to Production" to instantly rollback
4. Investigate root cause before re-deploying

## Notifications

Post-deploy status should be logged to the deployment commit in GitHub:
- Green check → all smoke tests passed
- Red X → smoke test failed, rollback initiated

## Claude Behavior

When `/deploy` is invoked, Claude should walk through this checklist and ask the user to confirm each item before marking a deployment as successful.
