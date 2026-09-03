/**
 * Marks a value this document does not actually know yet (legal entity name,
 * business address, governing jurisdiction, etc.) — visually distinct so it can
 * never be mistaken for a confirmed fact while reading. Every one of these must be
 * filled in, by a lawyer/founder with the real answer, before this document is
 * treated as final. See the implementation report for the full list.
 */
const Placeholder = ({ children }: { children: string }) => (
    <span className="legal-page__placeholder">{children}</span>
);

export default Placeholder;
