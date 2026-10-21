import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getClientIdentifier,
  rateLimitRequest,
  getRateLimitHeaders,
} from "@/lib/ratelimit";

// Secure-by-Design: Explicit CORS origin whitelist (No wildcard allowed)
const ALLOWED_ORIGINS = new Set([
  "https://prepsmart.tech",
  "https://www.prepsmart.tech",
  ...(process.env.NODE_ENV !== "production"
    ? ["http://localhost:3000", "http://127.0.0.1:3000"]
    : []),
]);

function getCorsHeaders(origin: string | null): Record<string, string> {
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With, Sentry-Trace, Baggage",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    };
  }
  return {};
}

// Routes that require authentication (only accessible to signed-in users)
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/profile(.*)",
  "/progress(.*)",
  "/roster(.*)",
  "/quiz(.*)",
  "/users(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Reject unsafe HTTP methods at the perimeter
  if (["TRACE", "TRACK"].includes(req.method.toUpperCase())) {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // 1. Identify client (authenticated user or IP address)
  const { userId } = await auth();
  const identifier = getClientIdentifier(req.headers, userId);

  // 2. Enforce tiered rate limiting based on route and HTTP method
  const rateLimitResult = await rateLimitRequest(
    req.nextUrl.pathname,
    req.method,
    identifier
  );

  // 3. Block if rate limit exceeded (HTTP 429)
  if (!rateLimitResult.success) {
    const headers = getRateLimitHeaders(rateLimitResult);
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");
    const acceptsJson = req.headers.get("accept")?.includes("application/json");

    if (isApiRoute || acceptsJson) {
      return NextResponse.json(
        {
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please slow down and try again.",
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers,
        }
      );
    }

    // Modern, responsive 429 error page for web visitors
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>429 Too Many Requests - Prepsmart</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: radial-gradient(circle at 50% 20%, #1e1b4b 0%, #09090b 100%);
      color: #f4f4f5;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      background: rgba(24, 24, 27, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(16px);
      border-radius: 1rem;
      padding: 2.5rem;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .badge {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
      margin-bottom: 1.25rem;
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin-bottom: 0.75rem;
      color: #fafafa;
    }
    p {
      color: #a1a1aa;
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 1.75rem;
    }
    .cooldown {
      background: rgba(39, 39, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0.75rem;
      padding: 1rem;
      margin-bottom: 1.75rem;
    }
    .cooldown-text {
      font-size: 0.85rem;
      color: #71717a;
      margin-bottom: 0.25rem;
    }
    .timer {
      font-size: 1.5rem;
      font-weight: 700;
      color: #38bdf8;
      font-variant-numeric: tabular-nums;
    }
    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #4f46e5;
      color: #ffffff;
      font-weight: 600;
      font-size: 0.9rem;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: background 0.2s;
      cursor: pointer;
      border: none;
    }
    .btn:hover { background: #4338ca; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Rate Limit Exceeded</div>
    <h1>Too Many Requests</h1>
    <p>We detected unusual activity or high request volume from your network. To protect our service, please pause momentarily.</p>
    <div class="cooldown">
      <div class="cooldown-text">Cooldown duration</div>
      <div class="timer" id="seconds">${rateLimitResult.retryAfter}s</div>
    </div>
    <button class="btn" onclick="window.location.reload()">Try Again</button>
  </div>
  <script>
    let remaining = ${rateLimitResult.retryAfter};
    const timerEl = document.getElementById("seconds");
    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(interval);
        timerEl.textContent = "Ready!";
        timerEl.style.color = "#4ade80";
      } else {
        timerEl.textContent = remaining + "s";
      }
    }, 1000);
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      status: 429,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        ...headers,
      },
    });
  }

  // 4. Authenticate protected routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // 5. Attach Rate Limit metrics and CORS headers to the response
  const response = NextResponse.next();
  const headers = getRateLimitHeaders(rateLimitResult);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
