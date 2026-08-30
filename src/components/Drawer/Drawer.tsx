import "../Modal/Modal.css";
import "./Drawer.css";
import type React from "react";
import { useRef } from "react";
import ModalBody from "../Modal/compounds/ModalBody";
import ModalFooter from "../Modal/compounds/ModalFooter";
import ModalHeader from "../Modal/compounds/ModalHeader";
import useClickOutside from "../../hooks/useClickOutsideElementToClose";

export type DrawerPropsType = {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
};

/**
 * Same open/close contract and Header/Body/Footer compound API as Modal, but slides
 * in from the right edge of the screen instead of centering — for content the owner
 * inspects alongside the page behind it (e.g. an order's full detail) rather than a
 * focused single decision (e.g. a delete confirmation), which stays a Modal.
 */
const Drawer = ({ children, isOpen, onClose }: DrawerPropsType) => {
    const drawerRef = useRef<HTMLDivElement>(null);

    useClickOutside(drawerRef, onClose);

    if (!isOpen) return;

    return (
        <div className="drawer-backdrop">
            <div ref={drawerRef} className="drawer-container">
                <button className="modal-cancel-button drawer-cancel-button" onClick={onClose} aria-label="Close">
                    ×
                </button>

                {children}
            </div>
        </div>
    );
};

Drawer.Header = ModalHeader;
Drawer.Body = ModalBody;
Drawer.Footer = ModalFooter;

export default Drawer;
