import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  ChevronFirstIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronLastIcon,
} from "lucide-react";
import { useIsMobile } from "@/helper";

interface PaginationProps {
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
  pageSizeOptions?: number[];
  showPageInfo?: boolean;
  showPageSizeSelector?: boolean;
  // Add these optional props to support better display messages
  filteredRecords?: number;
}

const TablePagination: React.FC<PaginationProps> = ({
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  pageSizeOptions = [10, 25, 50],
  showPageInfo = true,
  showPageSizeSelector = true,
  filteredRecords,
}) => {
  // Calculate total pages based on the records being paginated
  const isMobile = useIsMobile();

  const totalPages = useMemo(() => {
    const count =
      filteredRecords && filteredRecords > 0 ? filteredRecords : totalRecords;
    return Math.ceil(count / pageSize);
  }, [filteredRecords, totalRecords, pageSize]);

  // Calculate current range
  const { startRecord, endRecord } = useMemo(() => {
    const start = (currentPage - 1) * pageSize + 1;
    // If filteredRecords is provided, use it for the end-of-range
    const end = Math.min(
      currentPage * pageSize,
      filteredRecords !== undefined ? filteredRecords : totalRecords
    );
    return { startRecord: start, endRecord: end };
  }, [currentPage, pageSize, totalRecords, filteredRecords]);

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];

    if (isMobile) {
      if (totalPages <= 2) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 1) {
        // At the end: show last two pages
        pages.push(totalPages - 1);
        pages.push(totalPages);
      } else {
        // Else: show current and next page
        pages.push(currentPage);
        pages.push(currentPage + 1);
      }

      return pages;
    }

    // Desktop - original logic
    const showPages = 5;
    const sidePages = Math.floor((showPages - 1) / 2);

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - sidePages);
      let endPage = Math.min(totalPages - 1, currentPage + sidePages);

      if (currentPage <= sidePages + 1) {
        startPage = 2;
        endPage = showPages - 1;
      }

      if (currentPage >= totalPages - sidePages) {
        startPage = totalPages - (showPages - 2);
        endPage = totalPages - 1;
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, isMobile]);

  // Filter page size options based on total records
  const availablePageSizes = useMemo(() => {
    if (totalRecords === 0) return pageSizeOptions;

    // Include page sizes that are smaller than total records
    // AND always include the next larger page size option
    const validSizes = [];
    let foundLarger = false;

    for (const size of pageSizeOptions) {
      if (size <= totalRecords) {
        validSizes.push(size);
      } else if (!foundLarger) {
        // Include the first page size that's larger than total records
        validSizes.push(size);
        foundLarger = true;
      }
    }

    return validSizes;
  }, [pageSizeOptions, totalRecords]);

  // Handle page navigation
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !isLoading) {
      onPageChange(page);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: string) => {
    const size = parseInt(newSize);
    if (size !== pageSize) {
      onPageSizeChange(size);
      // Reset to first page when page size changes
      if (currentPage > 1) {
        onPageChange(1);
      }
    }
  };

  // Don't render if no data
  if (totalRecords === 0) {
    return null;
  }

  return (
    <div className="flex items-center flex-wrap gap-2 justify-center sm:justify-between px-4 py-3 border-t border-border-gray bg-white font-nunito">
      {/* Page size selector */}
      {showPageSizeSelector && (
        <div className="flex items-center gap-1 text-sm text-text-secondary">
          <span>Show</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="border border-border-gray rounded-lg !h-7 pr-6 pl-[10px] text-xs mx-2">
              <span>{pageSize}</span>
            </SelectTrigger>
            <SelectContent>
              {availablePageSizes.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>Entries</span>
        </div>
      )}

      {/* Page info */}
      {showPageInfo && (
        <div className="hidden lg:flex items-center gap-4 text-sm text-text-secondary">
          <span>
            {filteredRecords && filteredRecords < totalRecords
              ? `Showing (${startRecord} to ${endRecord}) of ${totalRecords} records`
              : `Showing ${startRecord} to ${endRecord} of ${totalRecords} records`}
          </span>
        </div>
      )}

      {/* Navigation controls */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1 || isLoading}
          className="h-8 w-8 p-0 border-border-gray "
          aria-label="First page"
        >
          <ChevronFirstIcon className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="h-8 w-8 p-0 border-border-gray"
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-2">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-2 py-1 text-text-secondary">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageClick(page as number)}
                  disabled={isLoading}
                  className={`h-8 w-8 p-0 border-border-gray font-light  ${
                    currentPage === page ? "text-white" : "text-black"
                  }`}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="h-8 w-8 p-0 border-border-gray"
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          className="h-8 w-8 p-0 border-border-gray"
          aria-label="Last page"
        >
          <ChevronLastIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
