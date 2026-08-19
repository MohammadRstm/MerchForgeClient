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
        <th
            className={`sortable-header${isActive ? " sortable-header--active" : ""}`}
            onClick={() => onSort(field)}
        >
            {label}
            {isActive && (
                <span className="sortable-header-arrow">
                    {sortDescending ? " ▼" : " ▲"}
                </span>
            )}
        </th>
    );
}

export default SortableHeader;
