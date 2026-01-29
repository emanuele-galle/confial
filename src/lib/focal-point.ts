import Anthropic from "@anthropic-ai/sdk";

interface FocalPoint {
  x: number; // Percentage 0-100 from left
  y: number; // Percentage 0-100 from top
  confidence: number; // 0-1
}

/**
 * Analyzes an image using Claude's vision capability to detect the focal point
 * (face, subject, or main point of interest)
 */
export async function analyzeImageFocalPoint(imageBuffer: Buffer): Promise<FocalPoint> {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn("ANTHROPIC_API_KEY not set, returning center focal point");
      return { x: 50, y: 50, confidence: 0 };
    }

    const anthropic = new Anthropic({ apiKey });

    // Convert buffer to base64
    const base64Image = imageBuffer.toString("base64");

    // Detect image type from buffer
    const mimeType = detectMimeType(imageBuffer);

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: base64Image,
              },
            },
            {
              type: "text",
              text: `Analyze this image and identify the main focal point (face, subject, or point of interest).

Return ONLY a JSON object with x and y as percentages (0-100) from top-left, and confidence (0-1).

Example: {"x": 45, "y": 30, "confidence": 0.9}

Rules:
- x: horizontal position from left edge (0 = left, 100 = right)
- y: vertical position from top edge (0 = top, 100 = bottom)
- confidence: 0.0 to 1.0 (how certain you are about the focal point)
- If multiple subjects, choose the most prominent one
- If no clear subject, return center (x: 50, y: 50) with low confidence`,
            },
          ],
        },
      ],
    });

    // Parse response
    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Extract JSON from response (handle markdown code blocks if present)
    const text = textContent.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const result = JSON.parse(jsonMatch[0]) as FocalPoint;

    // Validate response
    if (
      typeof result.x !== "number" ||
      typeof result.y !== "number" ||
      typeof result.confidence !== "number"
    ) {
      throw new Error("Invalid focal point format");
    }

    // Clamp values to valid ranges
    return {
      x: Math.max(0, Math.min(100, result.x)),
      y: Math.max(0, Math.min(100, result.y)),
      confidence: Math.max(0, Math.min(1, result.confidence)),
    };
  } catch (error) {
    console.error("Focal point analysis error:", error);
    // Return center on error
    return { x: 50, y: 50, confidence: 0 };
  }
}

/**
 * Detect MIME type from buffer magic bytes
 */
function detectMimeType(buffer: Buffer): "image/jpeg" | "image/png" | "image/gif" | "image/webp" {
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return "image/png";
  }

  // GIF: 47 49 46
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return "image/gif";
  }

  // WebP: RIFF....WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  // Default to JPEG
  return "image/jpeg";
}
