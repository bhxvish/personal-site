import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };

const font = (name: string) => readFile(join(process.cwd(), "assets/fonts", name));

/** The designed share card: name, statement and citation, set like the hero. */
export async function renderOg({ title, eyebrow }: { title: string; eyebrow: string }) {
  const [serif, italic, mono] = await Promise.all([
    font("fraunces.woff"),
    font("fraunces-italic.woff"),
    font("geist-mono.woff"),
  ]);
  const ink = "#0f0e0c";
  const paper = "#ece5d6";
  const muted = "#9a9385";
  const signal = "#ff5b1f";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: ink, color: paper, padding: 64, fontFamily: "Mono" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, letterSpacing: 2, color: muted, textTransform: "uppercase" }}>
          <span>{eyebrow}</span>
          <span>{site.location}</span>
        </div>
        <div style={{ height: 1, background: "#2b2823", marginTop: 18, display: "flex" }} />
        <div style={{ display: "flex", fontFamily: "Serif", fontSize: title.length > 10 ? 150 : 230, letterSpacing: "-0.045em", lineHeight: 1, marginTop: 40, marginLeft: -8 }}>
          {title}
        </div>
        <div style={{ display: "flex", flexGrow: 1 }} />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontFamily: "Serif", fontSize: 46, lineHeight: 1.15, maxWidth: 760, flexWrap: "wrap" }}>
            <span>{site.statement.before}&nbsp;</span>
            <span style={{ fontFamily: "Italic" }}>{site.statement.em}&nbsp;</span>
            <span>{site.statement.after}</span>
            <span style={{ fontFamily: "Mono", fontSize: 20, color: signal, marginLeft: 8 }}>[1]</span>
          </div>
          <div style={{ display: "flex", width: 22, height: 22, borderRadius: 11, background: signal }} />
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Serif", data: serif, style: "normal" },
        { name: "Italic", data: italic, style: "italic" },
        { name: "Mono", data: mono, style: "normal" },
      ],
    },
  );
}
