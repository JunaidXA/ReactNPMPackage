import React, { useMemo, useState, useEffect } from "react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components";
import { PaginationProps } from "../types";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
} from "lucide-react";

const Pagination: React.FC<PaginationProps> = ({
  onPageChange,
  onLimitChange,
  totalRecords = 0,
  isLoading = false,
  offset = 0,
  limit: initialLimit = 5,
}) => {
  // Initialize limit based on initialLimit
  const [limit, setLimit] = useState<string>(() => {
    if (initialLimit === totalRecords && totalRecords > 0) return "50";
    return initialLimit.toString();
  });

  const rowOptions = useMemo(() => {
    let results: string[];

    if (totalRecords > 50) {
      results = ["5", "10", "25", "50"];
    } else if (totalRecords > 25) {
      results = ["5", "10", "25"];
    } else if (totalRecords > 10) {
      results = ["5", "10"];
    } else if (totalRecords > 5) {
      results = ["5"];
    } else {
      results = ["50"];
    }

    return results;
  }, [totalRecords]);

  // Sync limit with initialLimit changes, mapping totalRecords to "50"
  useEffect(() => {
    if (initialLimit === totalRecords && totalRecords > 0) {
      setLimit("50");
    } else if (rowOptions.includes(initialLimit.toString())) {
      setLimit(initialLimit.toString());
    }
  }, [initialLimit, totalRecords, rowOptions]);

  // Calculate effective limit (number) for pagination calculations
  const effectiveLimit = useMemo(() => {
    return limit === "50" ? totalRecords : Number(limit);
  }, [limit, totalRecords]);

  // Calculate total pages based on the effective limit
  const totalPages = useMemo(() => {
    return Math.ceil(totalRecords / (effectiveLimit || 1));
  }, [totalRecords, effectiveLimit]);

  // Ensure offset and currentPage are in sync
  const derivedCurrentPage = Math.floor(offset / effectiveLimit) + 1;

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const newOffset = (page - 1) * effectiveLimit;
    onPageChange(page, newOffset);
  };

  // Handle limit change
  const handleLimitChange = (value: string) => {
    setLimit(value);
    const newLimit = value === "50" ? totalRecords : Number(value);
    onLimitChange?.(newLimit);
    // Reset to first page when limit changes
    handlePageChange(1);
  };

  // Calculate the row range for display
  // const getRange = (
  //   offset: number,
  //   limit: string,
  //   totalRecords: number
  // ): string => {
  //   const start = offset + 1;
  //   const end =
  //     limit === "50"
  //       ? totalRecords
  //       : Math.min(offset + Number(limit), totalRecords);
  //   return `${start} - ${end} of ${totalRecords}`;
  // };
  return (
    <div className="sm:flex sm:justify-between items-center block  gap-2 font-nunito">
      <div className="flex items-center text-md text-text-secondary sm:justify-start justify-center px-[15px] py-[10px]">
        {/* Rows per page label */}

        <p className="">Rows per page</p>

        {/* Dropdown for rows per page */}
        <Select value={limit} onValueChange={(e) => handleLimitChange(e)}>
          <SelectTrigger className=" border border-border-gray rounded-lg !h-7 pr-6 pl-[10px] text-xs mx-2">
            {limit}
          </SelectTrigger>
          <SelectContent className=" rounded-lg border-gray-200 bg-white !p-0">
            {rowOptions.map((option, index) => (
              <SelectItem
                key={index}
                value={option}
                className="w-fit h-6 text-xs text-gray-500 hover:text-white focus:bg-primary focus:text-white"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p>Entries</p>
      </div>
      <div className="flex items-center sm:justify-start justify-center sm:mt-0 mt-4">
        {/* Row range display */}
        {/* <div className="w-auto sm:px-3 px-1">
          <p className="text-sm leading-3 font-semibold">
            {getRange(offset, limit, totalRecords)}
          </p>
        </div> */}

        {/* Navigation buttons */}
        <div className="w-auto sm:px-3 px-1 flex space-x-2">
          {/* First page button */}
          <Button
            onClick={() => handlePageChange(1)}
            disabled={
              derivedCurrentPage === 1 || isLoading || totalRecords <= 0
            }
            className="has-[>svg]:!px-2 mx-1 my-1 px-2 py-1 bg-primary-600 text-white rounded-md disabled:opacity-50 focus:outline-none"
            aria-label="First page"
          >
            <ChevronFirstIcon className="w-4 h-4" />
          </Button>

          {/* Previous page button */}
          <Button
            onClick={() => handlePageChange(derivedCurrentPage - 1)}
            disabled={
              derivedCurrentPage === 1 || isLoading || totalRecords <= 0
            }
            className="has-[>svg]:!px-2 mx-1 my-1 px-2 py-1 bg-primary-600 text-white rounded-md disabled:opacity-50 focus:outline-none"
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>

          {/* Next page button */}
          <Button
            onClick={() => handlePageChange(derivedCurrentPage + 1)}
            disabled={
              derivedCurrentPage === totalPages ||
              isLoading ||
              totalRecords <= 0
            }
            className="has-[>svg]:!px-2 mx-1 my-1 px-2 py-1 bg-primary-600 text-white rounded-md disabled:opacity-50 focus:outline-none"
            aria-label="Next page"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>

          {/* Last page button */}
          <Button
            onClick={() => handlePageChange(totalPages)}
            disabled={
              derivedCurrentPage === totalPages ||
              isLoading ||
              totalRecords <= 0
            }
            className="has-[>svg]:!px-2 mx-1 my-1 px-2 py-1 bg-primary-600 text-white rounded-md disabled:opacity-50 focus:outline-none"
            aria-label="Last page"
          >
            <ChevronLastIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
