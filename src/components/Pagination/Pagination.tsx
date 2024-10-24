import React from "react";
import './Pagination.sass';

interface PaginationProps {
    page: number;
    totalPages: number;
    handlePreviousPage: () => void;
    handleNextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
    page,
    totalPages,
    handlePreviousPage,
    handleNextPage,
}) => {
    return (
        <div className="pagination">
            {page > 1 && (
                <button
                    className="pagination__button"
                    onClick={handlePreviousPage}
                >
                    {page - 1}
                </button>
            )}
            <span className="pagination__button current">
                {page}
            </span>
            {page < totalPages && (
                <button
                    className="pagination__button"
                    onClick={handleNextPage}
                >
                    {page + 1}
                </button>
            )}
        </div>
    );
};

export default Pagination;