import { useState } from "react";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToHex, type HsvaColor } from "@uiw/color-convert";
import type { ProductFormField } from "../types";

type ColorListFieldProps = {
    field: ProductFormField;
    /** Comma-separated hex codes, e.g. "#FF0000, #000000" — same convention as TextList. */
    value: string;
    onChange: (value: string) => void;
};

const DEFAULT_DRAFT: HsvaColor = { h: 0, s: 100, v: 100, a: 1 };

/**
 * Renders the "colors" field as swatches plus a wheel picker, instead of free text.
 * The wheel only drags hue/saturation, so brightness gets its own slider underneath
 * — without it, near-black and near-white shades would be unreachable.
 */
const ColorListField = ({ field, value, onChange }: ColorListFieldProps) => {
    const colors = value.split(",").map((c) => c.trim()).filter(Boolean);
    const [isPicking, setIsPicking] = useState(false);
    const [draft, setDraft] = useState<HsvaColor>(DEFAULT_DRAFT);

    const draftHex = hsvaToHex(draft).toUpperCase();

    const removeColor = (hex: string) => {
        onChange(colors.filter((c) => c !== hex).join(", "));
    };

    const addColor = () => {
        if (!colors.includes(draftHex)) {
            onChange([...colors, draftHex].join(", "));
        }
        setIsPicking(false);
        setDraft(DEFAULT_DRAFT);
    };

    return (
        <div className="business-dashboard-form-field">
            <label className="business-dashboard-form-label">
                {field.label}
                <span className="business-dashboard-form-optional"> (optional)</span>
            </label>

            <div className="color-list-field">
                {colors.map((hex) => (
                    <button
                        key={hex}
                        type="button"
                        className="color-swatch"
                        style={{ backgroundColor: hex }}
                        onClick={() => removeColor(hex)}
                        title={`${hex} — click to remove`}
                        aria-label={`Remove ${hex}`}
                    >
                        <span className="color-swatch__remove" aria-hidden="true">×</span>
                    </button>
                ))}

                <button
                    type="button"
                    className={`color-swatch color-swatch--add${isPicking ? " color-swatch--active" : ""}`}
                    onClick={() => setIsPicking((open) => !open)}
                    aria-label="Add a color"
                    title="Add a color"
                >
                    +
                </button>
            </div>

            {isPicking && (
                <div className="color-picker-popover">
                    <Wheel color={draft} width={160} height={160} onChange={(res) => setDraft({ ...draft, ...res.hsva })} />

                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={draft.v}
                        onChange={(e) => setDraft({ ...draft, v: Number(e.target.value) })}
                        className="color-picker-popover__brightness"
                        aria-label="Brightness"
                    />

                    <div className="color-picker-popover__footer">
                        <span className="color-picker-popover__preview" style={{ backgroundColor: draftHex }} aria-hidden="true" />
                        <span className="color-picker-popover__hex">{draftHex}</span>

                        <button type="button" className="business-dashboard-button-primary" onClick={addColor}>
                            Add
                        </button>
                        <button type="button" className="business-dashboard-button-ghost" onClick={() => setIsPicking(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <span className="business-dashboard-form-hint">Drag the wheel to pick a color, then add it.</span>
        </div>
    );
};

export default ColorListField;
