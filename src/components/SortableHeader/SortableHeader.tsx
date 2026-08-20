import "./SortableHeader.css";

type SortableHeaderProps<TField extends string> = {
    label: string;
    field: TField;
    sortBy: TField;
    sortDescending: boolean;
    onSort: (field: TField) => void;
};

function SortableHeader<TField extends string>({
    label,
    field,
    sortBy,
    sortDescending,
    onSort,
}: SortableHeaderProps<TField>) {
    const isActive = sortBy === field;

    return (
        // aria-sort belongs on the cell; the control inside it is a real button so
        // the column can be sorted by keyboard and is announced as actionable. A
        // bare <th onClick> was reachable by mouse only.
        <th
            className={`sortable-header${isActive ? " sortable-header--active" : ""}`}
            aria-sort={isActive ? (sortDescending ? "descending" : "ascending") : "none"}
        >
            <button
                type="button"
                className="sortable-header-button"
                onClick={() => onSort(field)}
            >
                {label}
                {isActive && (
                    <span className="sortable-header-arrow" aria-hidden="true">
                        {sortDescending ? " ▼" : " ▲"}
                    </span>
                )}
            </button>
        </th>
    );
}

export default SortableHeader;
