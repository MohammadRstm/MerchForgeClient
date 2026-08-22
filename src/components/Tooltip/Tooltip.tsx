import { useState, type ReactNode } from "react";
import "./Tooltip.css";

type TooltipProps = {
    content: string;
    children: ReactNode;
    /**
     * Which side the bubble opens toward. Defaults to below: several call sites
     * (like the AI chat header's credit ring) sit right under a modal's top edge,
     * and modals clip overflow, so opening upward would get cut off.
     */
    placement?: "top" | "bottom";
};

/**
 * A styled replacement for the native `title` attribute, which renders as a plain
 * OS tooltip with a multi-second delay and no control over its look. This shows
 * instantly on hover/focus, dismisses on blur/mouse-leave, and matches the app's
 * own visual language instead of the browser's.
 */
const Tooltip = ({ content, children, placement = "bottom" }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <span
            className="tooltip-wrapper"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}

            {isVisible && (
                <span className={`tooltip-bubble tooltip-bubble--${placement}`} role="tooltip">
                    {content}
                </span>
            )}
        </span>
    );
};

export default Tooltip;
