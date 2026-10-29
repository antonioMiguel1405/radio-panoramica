import { ImageResponse } from "next/og";
import { meta } from "@/content/meta";

export const alt = `${meta.titulo} — ${meta.subtitulo}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem Open Graph original (gerada no build). */
export default function OpenGraphImage() {
  const teeth = Array.from({ length: 14 }, (_, i) => i);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "radial-gradient(circle at 70% 40%, #0f3b40 0%, #041015 70%)",
          color: "#e6fffb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#5eead4" }}>
          {meta.disciplina} · {meta.instituicao}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 800, lineHeight: 1.05 }}>{meta.titulo}</div>
          <div style={{ display: "flex", fontSize: 40, color: "#a7c4cb", marginTop: 16 }}>{meta.subtitulo}</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {teeth.map((i) => (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 54 + (i % 7 === 3 ? 16 : 0),
                  borderRadius: 12,
                  background: "#e6fffb",
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#8fb3bb", whiteSpace: "nowrap" }}>
            Mapa mental · Roteiro · Quiz · Simuladores
          </div>
        </div>
      </div>
    ),
    size,
  );
}
