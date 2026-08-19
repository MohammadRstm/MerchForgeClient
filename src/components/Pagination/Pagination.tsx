import "./Pagination.css";

type PaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <button
                type="button"
                className="pagination-btn"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
            >
                Previous
            </button>

            <span className="pagination-status">
                Page {page} of {totalPages}
            </span>

            <button
                type="button"
                className="pagination-btn"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
