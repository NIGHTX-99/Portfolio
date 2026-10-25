import { NextResponse } from "next/server";

import { getSiteConfig, isSiteConfig, saveSiteConfig } from "@/lib/site";

export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: "Failed to read site config" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!isSiteConfig(body)) {
      return NextResponse.json({ error: "Invalid site config" }, { status: 400 });
    }
    await saveSiteConfig(body);
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: "Failed to save site config" }, { status: 500 });
  }
}
