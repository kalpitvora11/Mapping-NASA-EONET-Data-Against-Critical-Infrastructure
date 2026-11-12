const DEFAULT_BASE = "http://127.0.0.1:8000";

export async function GET() {
  const base = process.env.AEGIS_API_URL ?? DEFAULT_BASE;

  try {
    const upstream = await fetch(`${base.replace(/\/$/, "")}/`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ?? "application/json",
        "cache-control": "no-store",
      },
    });
  } catch {
    return Response.json(
      { message: "Aegis upstream unavailable" },
      { status: 502 },
    );
  }
}
