import AnchorLink from "@/components/ui/AnchorLink";
import LocalTime from "@/components/ui/LocalTime";
import Magnetic from "@/components/ui/Magnetic";
import { site } from "@/content/site";

export default function Colophon() {
  return (
    <footer className="shell pb-[var(--margin)]">
      <div className="rule" />
      <div className="grid-12 micro gap-y-3 pt-5 text-muted">
        <p className="col-span-6 md:col-span-3">© {new Date().getFullYear()} {site.name}</p>
        <p className="col-span-6 md:col-span-3">
          {site.location} · <LocalTime seconds={false} />
        </p>
        <p className="col-span-8 md:col-span-4">Set in Fraunces &amp; Geist. Built with Next.js, GSAP &amp; Lenis.</p>
        <p className="col-span-4 text-right md:col-span-2">
          <Magnetic>
            <AnchorLink hash="top" className="ulink inline-block text-paper">
              Back to top ↑
            </AnchorLink>
          </Magnetic>
        </p>
      </div>
    </footer>
  );
}
