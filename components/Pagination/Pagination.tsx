"use client";

import ReactPaginate from "react-paginate";

export interface PaginationProps {
  pageCount: number;              // скільки всього сторінок
  forcePage: number;              // поточна сторінка (0-based для ReactPaginate)
  onPageChange: (page: number) => void; // повертаємо 0-based сторінку
}

export default function Pagination({
  pageCount,
  forcePage,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={forcePage}
      onPageChange={(e) => onPageChange(e.selected)}
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      renderOnZeroPageCount={null}
    />
  );
}