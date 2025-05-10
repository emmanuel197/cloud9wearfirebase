# TypeScript Safety Fixes for Vercel Deployment

To fix the TypeScript errors shown in your deployment logs, you need to add null/undefined checks for all instances of `req.user`. Here are the main patterns to find and replace:

## Pattern 1: Direct req.user Access

Find:
```typescript
if (req.user.role === "role") {
```

Replace with:
```typescript
if (req.user && req.user.role === "role") {
```

## Pattern 2: req.user.id in Queries

Find:
```typescript
customerId: req.user.id
```

Replace with:
```typescript
customerId: req.user?.id
```

## Pattern 3: Fix Type Assertion for Numeric Values

Find:
```typescript
if (Number(productId) === null) {
```

Replace with:
```typescript
if (productId === null || isNaN(Number(productId))) {
```

## Specific Line Fixes

Based on your error logs, here are the specific line numbers to fix:

1. Lines 226-227: Add `req.user &&` before `req.user.role`
2. Line 251: Change to `supplierId: req.user?.id`
3. Lines 291-292: Add `req.user &&` before checks
4. Lines 304-306: Use optional chaining with `req.user?.id`
5. Line 349: Add null check `req.user &&`
6. Lines 357-359: Add null checks
7. Line 390: Change to `customerId: req.user?.id`
8. Line 416: Add null check
9. Lines 489-490: Add null checks
10. Line 500: Use optional chaining
11. Line 511: Use optional chaining
12. Lines 535-539: Add null checks
13. Line 921: Add null check
14. Lines 953 and 986: Add null coalescing, e.g., `Number(customerId ?? 0)`

## Example Route Fix

```typescript
app.get("/api/cart", (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  // Then safely use req.user
  const userId = req.user.id;
  
  // Rest of the function...
});
```

This should resolve all the TypeScript errors in your deployment.