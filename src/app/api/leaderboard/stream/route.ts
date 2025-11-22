// SSE endpoint for leaderboard updates
import { NextResponse } from 'next/server';

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Store controller so POST route can broadcast
      // @ts-ignore
      if (!globalThis.__leaderboard_sse_controllers) globalThis.__leaderboard_sse_controllers = [];
      // @ts-ignore
      globalThis.__leaderboard_sse_controllers.push(controller);

      // Send initial comment to establish connection
      controller.enqueue(encoder.encode(':ok\n\n'));

      // Keep-alive ping every 20s
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(':ping\n\n'));
        } catch (e) {
          // noop
        }
      }, 20000);

      // When closed, remove controller
      // Note: no cancellation signal available here cross-env; we provide a simple close handler
      // The consumer can close the connection; when they do, we attempt cleanup by setting a timer
      controller.byobRequest; // no-op to avoid unused
      // store cleanup reference
      // Attach a close handler via a microtask to check later
      (controller as any).__keepAlive = keepAlive;
    },
    cancel() {
      // cleanup when consumer disconnects
      try {
        // @ts-ignore
        const ctrs = globalThis.__leaderboard_sse_controllers || [];
        // best-effort filter out controllers that are closed
        globalThis.__leaderboard_sse_controllers = ctrs.filter((c: any) => c.desiredSize !== 0);
      } catch (e) {}
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
