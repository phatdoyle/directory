import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "Made by Punks";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#638696",
          color: "white",
          fontSize: 72,
          fontWeight: 900,
        }}
      >
        Punk #{id}
      </div>
    ),
    size
  );
}
