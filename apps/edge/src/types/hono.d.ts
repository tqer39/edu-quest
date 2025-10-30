// Type augmentation for Hono's jsxRenderer
// Using interface for declaration merging with Hono's existing type
declare module 'hono' {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      props?: { title?: string; description?: string; favicon?: string }
    ): Response | Promise<Response>;
  }
}

export {};
