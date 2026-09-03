// `server-only` throws when imported outside a React Server Components
// build, which Jest is not. Tests exercise the modules that import it
// (`lib/stripe.ts` and the routes above it) as plain Node code, so the guard
// is a no-op here and stays real in the app.
module.exports = {};
