// The running header every section opens with: index, name, a hairline, and a count.
export default function SectionHead({ index, name, total = "06", aside }: { index: string; name: string; total?: string; aside?: string }) {
  return (
    <div className="mb-[clamp(40px,6vw,96px)]">
      <div className="grid-12 micro mb-3 text-muted" data-reveal="fade">
        <p className="col-span-6 md:col-span-4">
          ({index}) <span className="text-paper">{name}</span>
        </p>
        <p className="hidden md:col-span-5 md:block">{aside}</p>
        <p className="col-span-6 text-right md:col-span-3">
          {index} / {total}
        </p>
      </div>
      <div className="rule" data-reveal="rule" />
    </div>
  );
}
