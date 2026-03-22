import { join } from "path";
import { mkdirSync, existsSync } from "fs";

const GENERATED_DIR = join(import.meta.dir, "..", "..", "generated-images");

// Ensure the directory exists on startup
if (!existsSync(GENERATED_DIR)) {
  mkdirSync(GENERATED_DIR, { recursive: true });
}

const PROMPT_TEMPLATE = (race: string, cls: string, background?: string) => {
  const bgClause = background
    ? ` The character has a ${background} background, so incorporate visual cues that hint at their ${background} origins.`
    : "";
  return `Generate a generic dnd ${race} ${cls} character.${bgClause} Make it look more like a traditional DND ${race} ${cls} character. The character must facing the camera. And most of his body should be visible. Three quarters angle. In the art style of Jean Giraud (Moebius). Clean, precise linework with uniform ink outlines and no sketchy or rough edges. Stippled and hatched shading built from fine dots and thin parallel lines rather than smooth gradients. A muted, dreamlike pastel color palette with soft pinks, pale blues, warm sand tones, faded oranges, and subtle lavenders. Flat, open color fills with minimal blending, giving a hand-colored watercolor feel. High detail in textures — fabric weave, leather grain, metal rivets, cracked earth — all rendered through linework rather than painterly rendering. Compositions with vast negative space, wide horizon lines, and a sense of solitary scale. Retro-futuristic design sensibility blending medieval, organic, and sci-fi elements. Thin, elegant borders on panels if applicable. The overall mood should feel contemplative, surreal, and quietly epic, as if pulled from the pages of a 1970s Heavy Metal magazine illustration.`;
};

const REPLICATE_API = "https://api.replicate.com/v1/models/bytedance/seedream-4.5/predictions";

async function pollPrediction(url: string, token: string): Promise<string> {
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.status === "succeeded") {
      return data.output?.[0] ?? data.output;
    }
    if (data.status === "failed" || data.status === "canceled") {
      throw new Error(data.error || "Image generation failed");
    }
  }
  throw new Error("Image generation timed out");
}

async function getReplicateImageUrl(token: string, prompt: string): Promise<string> {
  const res = await fetch(REPLICATE_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: "3:4",
        num_outputs: 1,
      },
    }),
  });

  const data = await res.json();

  if (res.status === 200 || res.status === 201) {
    if (data.status === "succeeded") {
      const url = data.output?.[0] ?? data.output;
      if (!url) throw new Error("No image URL in response");
      return url;
    }
    if (data.status === "processing" || data.status === "starting") {
      return await pollPrediction(data.urls.get, token);
    }
  }

  if (res.status === 202) {
    return await pollPrediction(data.urls.get, token);
  }

  throw new Error(data.detail || data.error || "Replicate API error");
}

async function downloadAndSave(remoteUrl: string, filename: string): Promise<string> {
  const res = await fetch(remoteUrl);
  if (!res.ok) throw new Error("Failed to download generated image");
  const buffer = await res.arrayBuffer();
  const filePath = join(GENERATED_DIR, filename);
  await Bun.write(filePath, buffer);
  return `/api/generated-images/${filename}`;
}

export const generateImageRoutes = {
  "/api/generate-image": {
    async POST(req: Request) {
      try {
        const token = process.env.REPLICATE_API_TOKEN;
        if (!token) {
          return Response.json(
            { error: "REPLICATE_API_TOKEN not configured" },
            { status: 500 },
          );
        }

        const body = await req.json().catch(() => null);
        if (!body?.race || !body?.class) {
          return Response.json(
            { error: "Both race and class are required" },
            { status: 400 },
          );
        }

        const prompt = PROMPT_TEMPLATE(body.race, body.class, body.background);
        const remoteUrl = await getReplicateImageUrl(token, prompt);

        // Download and save locally
        const filename = `${Date.now()}-${body.race}-${body.class}.webp`;
        const localPath = await downloadAndSave(remoteUrl, filename);

        return Response.json({ imageUrl: localPath });
      } catch (e: any) {
        console.error("Image generation error:", e);
        return Response.json(
          { error: e.message || "Internal server error" },
          { status: 500 },
        );
      }
    },
  },

  "/api/generated-images/:filename": {
    async GET(req: Request) {
      const { filename } = (req as any).params;
      const filePath = join(GENERATED_DIR, filename);
      const file = Bun.file(filePath);
      if (!(await file.exists())) {
        return new Response("Not found", { status: 404 });
      }
      return new Response(file, {
        headers: { "Content-Type": file.type || "image/webp", "Cache-Control": "public, max-age=31536000, immutable" },
      });
    },
  },
};
