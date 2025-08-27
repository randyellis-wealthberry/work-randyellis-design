/**
 * Mock Service Worker Server Setup
 * Test server configuration for API mocking
 */

import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Setup the mock server
export const server = setupServer(...handlers);

// Server lifecycle helpers
export const startServer = () =>
  server.listen({
    onUnhandledRequest: "warn",
  });

export const stopServer = () => server.close();

export const resetHandlers = () => server.resetHandlers();

// Custom handler helpers for testing
export const addHandler = (handler: any) => {
  server.use(handler);
};

export const addHandlers = (newHandlers: any[]) => {
  server.use(...newHandlers);
};
