import { ImageResponse } from "next/og";
import { COLORS } from "./constants";
import { readFileSync } from "fs";
import { join } from "path";

interface OGImageOptions {
  width: number;
  height: number;
}

interface OGImageProps {
  title: string;
  subtitle?: string;
  punkIds?: number[];
  punkId?: number;
  projectCount?: number;
  twitter?: string;
}

interface ProjectOGImageProps {
  name: string;
  description: string;
  thumbnail?: string;
  punkId: number;
  tags?: string[];
}

function getPunkImageUrl(punkId: number) {
  return `https://punks.art/api/punks/${punkId}?format=png&size=240&background=v2`;
}

export function generateNotFoundImage(options: OGImageOptions): ImageResponse {
  const { width, height } = options;
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.punkBlue,
          color: "white",
          fontSize: 64,
          fontWeight: 900,
          textTransform: "uppercase",
        }}
      >
        Punk Not Found
      </div>
    ),
    { width, height }
  );
}

export async function generateOGImage(
  props: OGImageProps,
  options: OGImageOptions
): Promise<ImageResponse> {
  const { width, height } = options;
  const { title, subtitle, punkIds, punkId, projectCount, twitter } = props;

  // Single punk view - card style with punk on left, info on right
  if (punkId !== undefined) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: COLORS.punkBlue,
            padding: "40px",
          }}
        >
          {/* Punk avatar - large on the left */}
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              border: "8px solid #000",
              boxShadow: "8px 8px 0 0 rgba(0,0,0,0.4)",
              marginRight: "60px",
            }}
          >
            <img
              src={getPunkImageUrl(punkId)}
              width={400}
              height={400}
              style={{
                imageRendering: "pixelated",
              }}
            />
          </div>

          {/* Info on the right */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
            }}
          >
            {/* Name */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: "white",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                textShadow: "4px 4px 0 #000",
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>

            {/* Punk ID */}
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "white",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginTop: "16px",
                opacity: 0.7,
              }}
            >
              Punk #{punkId}
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "32px",
                marginTop: "32px",
              }}
            >
              {/* Project count badge */}
              {projectCount !== undefined && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    border: "4px solid #000",
                    padding: "12px 24px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 48,
                      fontWeight: 900,
                      color: COLORS.punkBlue,
                      marginRight: "12px",
                    }}
                  >
                    {projectCount}
                  </span>
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: COLORS.punkBlue,
                      textTransform: "uppercase",
                    }}
                  >
                    Work{projectCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {/* Twitter handle */}
              {twitter && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: COLORS.punkPink,
                    border: "4px solid #000",
                    padding: "12px 24px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    @{twitter}
                  </span>
                </div>
              )}
            </div>

            {/* Made by Punks branding */}
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "white",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginTop: "40px",
                opacity: 0.5,
              }}
            >
              Made by Punks
            </div>
          </div>
        </div>
      ),
      { width, height }
    );
  }

  // Multiple punks view (homepage)
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.punkBlue,
        }}
      >
        {/* Punk avatars */}
        {punkIds && punkIds.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginBottom: "48px",
            }}
          >
            {punkIds.slice(0, 6).map((id) => (
              <div
                key={id}
                style={{
                  display: "flex",
                  border: "6px solid #000",
                  boxShadow: "6px 6px 0 0 rgba(0,0,0,0.4)",
                }}
              >
                <img
                  src={getPunkImageUrl(id)}
                  width={100}
                  height={100}
                  style={{
                    imageRendering: "pixelated",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              textShadow: "6px 6px 0 #000",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "white",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginTop: "16px",
                opacity: 0.8,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    ),
    { width, height }
  );
}

export async function generateProjectOGImage(
  props: ProjectOGImageProps,
  options: OGImageOptions,
  siteUrl: string
): Promise<ImageResponse> {
  const { width, height } = options;
  const { name, description, thumbnail, punkId, tags } = props;

  // Only use local thumbnails (starting with /) to avoid external image loading issues
  // Skip GIFs as they're not supported by next/og ImageResponse
  const isLocalThumbnail = thumbnail?.startsWith("/");
  const isGif = thumbnail?.endsWith(".gif");
  const canUseThumbnail = isLocalThumbnail && !isGif;

  // If local thumbnail exists (and not a GIF), show it prominently
  if (canUseThumbnail && thumbnail) {
    // Read local file directly from filesystem during build
    let thumbnailUrl: string;
    try {
      const filePath = join(process.cwd(), "public", thumbnail);
      const fileBuffer = readFileSync(filePath);
      const base64 = fileBuffer.toString("base64");
      const mimeType = thumbnail.endsWith(".png") ? "image/png" : "image/jpeg";
      thumbnailUrl = `data:${mimeType};base64,${base64}`;
    } catch {
      // Fallback to URL if file read fails
      thumbnailUrl = `${siteUrl}${thumbnail}`;
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            backgroundColor: COLORS.punkBlue,
          }}
        >
          {/* Thumbnail - left side */}
          <div
            style={{
              width: "60%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <img
              src={thumbnailUrl}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                border: "8px solid #000",
                boxShadow: "8px 8px 0 0 rgba(0,0,0,0.4)",
              }}
            />
          </div>

          {/* Info - right side */}
          <div
            style={{
              width: "40%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "40px 40px 40px 0",
            }}
          >
            {/* Project name */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "white",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                textShadow: "4px 4px 0 #000",
                lineHeight: 1.1,
              }}
            >
              {name}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 24,
                fontWeight: 500,
                color: "white",
                marginTop: "16px",
                opacity: 0.8,
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "24px",
                }}
              >
                {tags.slice(0, 3).map((tag, i) => (
                  <div
                    key={tag}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#fff" : COLORS.punkPink,
                      color: i % 2 === 0 ? COLORS.punkBlue : "#fff",
                      border: "3px solid #000",
                      padding: "6px 12px",
                      fontSize: 14,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {/* Punk avatar + branding */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "32px",
                gap: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  border: "4px solid #000",
                }}
              >
                <img
                  src={getPunkImageUrl(punkId)}
                  width={60}
                  height={60}
                  style={{
                    imageRendering: "pixelated",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  opacity: 0.6,
                }}
              >
                Made by Punks
              </div>
            </div>
          </div>
        </div>
      ),
      { width, height }
    );
  }

  // Fallback: text-only with punk avatar
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.punkBlue,
          padding: "60px",
        }}
      >
        {/* Punk avatar */}
        <div
          style={{
            display: "flex",
            flexShrink: 0,
            border: "8px solid #000",
            boxShadow: "8px 8px 0 0 rgba(0,0,0,0.4)",
            marginRight: "60px",
          }}
        >
          <img
            src={getPunkImageUrl(punkId)}
            width={300}
            height={300}
            style={{
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* Info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          {/* Project name */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              textShadow: "4px 4px 0 #000",
              lineHeight: 1.1,
            }}
          >
            {name}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: "white",
              marginTop: "20px",
              opacity: 0.8,
              lineHeight: 1.4,
              maxWidth: "600px",
            }}
          >
            {description}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "32px",
              }}
            >
              {tags.slice(0, 4).map((tag, i) => (
                <div
                  key={tag}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#fff" : COLORS.punkPink,
                    color: i % 2 === 0 ? COLORS.punkBlue : "#fff",
                    border: "4px solid #000",
                    padding: "8px 16px",
                    fontSize: 18,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}

          {/* Branding */}
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginTop: "40px",
              opacity: 0.5,
            }}
          >
            Made by Punks
          </div>
        </div>
      </div>
    ),
    { width, height }
  );
}
