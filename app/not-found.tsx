import AnchorLink from "@/components/ui/AnchorLink";

export default function NotFound() {
  return (
    <section data-section="Not found" data-index="404" className="shell flex min-h-[100svh] flex-col justify-end pb-[clamp(48px,8vw,128px)]">
      <p className="micro mb-3 text-muted">(404) Not found</p>
      <div className="rule" />
      <h1 className="display mt-6 text-[clamp(4rem,1rem+14vw,18rem)] leading-[0.84]">
        Not <em>measured.</em>
      </h1>
      <p className="lead mt-8 max-w-[28ch] text-muted">This page doesn&apos;t exist, or nothing ever cited it.</p>
      <p className="mt-10">
        <AnchorLink hash="top" className="micro ulink text-paper">
          ← Back to the index
        </AnchorLink>
      </p>
    </section>
  );
}
