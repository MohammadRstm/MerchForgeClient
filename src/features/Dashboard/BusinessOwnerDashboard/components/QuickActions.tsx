import { useNavigate } from "react-router";
import { FiPlus, FiShoppingBag, FiPackage, FiGlobe } from "react-icons/fi";
import { routes } from "../../../../config/routes";

/** Every action here already exists as a real page/flow — this is navigation shorthand, not new functionality. */
const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        { key: "add-product", icon: <FiPlus />, label: "Add Product", onClick: () => navigate(routes.DASHBOARD_PRODUCTS) },
        { key: "orders", icon: <FiShoppingBag />, label: "View Orders", onClick: () => navigate(routes.DASHBOARD_ORDERS) },
        { key: "inventory", icon: <FiPackage />, label: "Manage Inventory", onClick: () => navigate(routes.DASHBOARD_INVENTORY) },
        { key: "storefront", icon: <FiGlobe />, label: "Customize Store", onClick: () => navigate(routes.DASHBOARD_WEBSITE) },
    ];

    return (
        <section className="overview-quick-actions">
            {actions.map((action) => (
                <button key={action.key} type="button" className="overview-quick-action" onClick={action.onClick}>
                    <span className="overview-quick-action__icon">{action.icon}</span>
                    {action.label}
                </button>
            ))}
        </section>
    );
};

export default QuickActions;
