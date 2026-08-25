import type { ReactNode } from "react";
import { FiMessageSquare, FiRotateCw, FiDroplet, FiImage, FiSun, FiFileText } from "react-icons/fi";
import Modal from "../../../../components/Modal/Modal";
import type useImageEditChat from "../hooks/ui/useImageEditChat";
import type useMultiAngleImages from "../hooks/ui/useMultiAngleImages";
import type useColorImages from "../hooks/ui/useColorImages";
import type useQuickImageEdits from "../hooks/ui/useQuickImageEdits";
import type useSuggestProductDetails from "../hooks/ui/useSuggestProductDetails";

type ImageToolsMenuModalProps = {
    isOpen: boolean;
    onClose: () => void;
    imageEditChat: ReturnType<typeof useImageEditChat>;
    multiAngle: ReturnType<typeof useMultiAngleImages>;
    colorImages: ReturnType<typeof useColorImages>;
    quickImageEdits: ReturnType<typeof useQuickImageEdits>;
    suggestDetails: ReturnType<typeof useSuggestProductDetails>;
};

type MenuRow = {
    key: string;
    icon: ReactNode;
    label: string;
    description: string;
    onSelect: () => void;
    disabled?: boolean;
    disabledReason?: string;
};

/**
 * The single entry point for every AI image action — everything that used to be
 * its own button in ProductImagesField now lives one level deeper, behind this
 * menu. Picking an option closes the menu and opens that option's own flow
 * exactly as it worked before; nothing about those flows changes here.
 */
const ImageToolsMenuModal = ({
    isOpen,
    onClose,
    imageEditChat,
    multiAngle,
    colorImages,
    quickImageEdits,
    suggestDetails,
}: ImageToolsMenuModalProps) => {
    const select = (action: () => void) => () => {
        action();
        onClose();
    };

    const rows: MenuRow[] = [
        {
            key: "custom-edit",
            icon: <FiMessageSquare aria-hidden="true" />,
            label: "Custom edit",
            description: "Describe any change in your own words.",
            onSelect: select(imageEditChat.open),
        },
        {
            key: "angles",
            icon: <FiRotateCw aria-hidden="true" />,
            label: "Generate in multiple angles",
            description: "AI photos of your product from different angles.",
            onSelect: select(multiAngle.open),
        },
        {
            key: "colors",
            icon: <FiDroplet aria-hidden="true" />,
            label: "Add images with colors",
            description: "AI photos of your product in its other colors.",
            onSelect: select(colorImages.open),
            disabled: !colorImages.hasColors,
            disabledReason: "Pick at least one product color first",
        },
        {
            key: "remove-background",
            icon: <FiImage aria-hidden="true" />,
            label: "Remove background",
            description: "Replace the background with a clean white studio backdrop.",
            onSelect: select(() => quickImageEdits.open("remove-background")),
        },
        {
            key: "enhance-photo",
            icon: <FiSun aria-hidden="true" />,
            label: "Enhance photo",
            description: "Improve lighting, sharpness, and color balance.",
            onSelect: select(() => quickImageEdits.open("enhance-photo")),
        },
        {
            key: "suggest-details",
            icon: <FiFileText aria-hidden="true" />,
            label: "Suggest details from photo",
            description: "Let AI fill in the title, description, and more from your photo.",
            onSelect: select(suggestDetails.open),
        },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Header>
                <h2>Edit images</h2>
            </Modal.Header>

            <Modal.Body>
                <div className="image-tools-menu">
                    {rows.map((row) => (
                        <button
                            key={row.key}
                            type="button"
                            className="image-tools-menu__row"
                            onClick={row.onSelect}
                            disabled={row.disabled}
                            title={row.disabled ? row.disabledReason : undefined}
                        >
                            <span className="image-tools-menu__icon">{row.icon}</span>
                            <span className="image-tools-menu__text">
                                <span className="image-tools-menu__label">{row.label}</span>
                                <span className="image-tools-menu__description">{row.description}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ImageToolsMenuModal;
