import React from "react";

export interface ChildrenPropsType {
    /**
     * ReactNode, not ReactElement: a header/body/footer is routinely given several
     * children, or plain text, and ReactElement admits only a single element — which
     * made every multi-child modal slot a type error and broke `npm run build`.
     */
    children: React.ReactNode;
}
