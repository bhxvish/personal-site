import { Fragment, type ElementType, type ReactNode } from "react";

type Part = string | { em: string };

/**
 * Wraps each word in a clipping mask so it can rise into place.
 * Server-safe: the RevealController (or a parent timeline) does the animating.
 */
export default function SplitWords({
  parts,
  as: Tag = "span",
  className,
  id,
  reveal = true,
  after,
}: {
  id?: string;
  parts: Part[] | string;
  as?: ElementType;
  className?: string;
  reveal?: boolean;
  after?: ReactNode;
}) {
  const list = typeof parts === "string" ? [parts] : parts;
  const plain = list.map((p) => (typeof p === "string" ? p : p.em)).join(" ");

  return (
    <Tag id={id} className={className} data-reveal={reveal ? "words" : undefined}>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true">
        {list.map((part, i) => {
          const isEm = typeof part !== "string";
          const words = (isEm ? part.em : part).split(" ").filter(Boolean);
          return (
            <Fragment key={i}>
              {words.map((word, j) => (
                <Fragment key={j}>
                  <span className="w">
                    <span>{isEm ? <em>{word}</em> : word}</span>
                  </span>{" "}
                </Fragment>
              ))}
            </Fragment>
          );
        })}
        {after}
      </span>
    </Tag>
  );
}
