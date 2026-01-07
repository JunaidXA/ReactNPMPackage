import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ITableComponentProps } from "../types";
// import { MainSpinnerIcon } from "../svg";
import { ArrowDown, ArrowDownUp, ArrowUp, FilterIcon, X } from "lucide-react";
import { DateInput, FormInput } from "./input";
import { Checkbox } from "./checkbox";
import { format, isValid, parse } from "date-fns";
import { MyTooltip } from "./tooltip";
import { StyledDataCell } from "./common";
// import Pagination from "./pagination";
import { FilterMenu } from "./dropdown-menu";
import { IconButton, Loader } from "./miscellaneous";
import TablePagination from "./tablepagination";
import { CustomAutocompleteSelect } from "./select";
import { SimpleAccordion } from "./accordion";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

const SimpleTable: React.FC<ITableComponentProps> = ({
  mainClassName = "w-full",
  tbodyClassName = "text-start",
  headingtitle,
  headers,
  data = [],
  onSort,
  onRowClick,
  loading,
  defaultSort,
  thClassName,
  scrollClassName,
  heightClassName,
  pagination,
  onPageChange,
  onLimitChange,
  totalRecords,
  currentPage,
  onSearch,
  actions,
  selectedIds = [],
  onSelectionChange,
  searchValue,
  // isMenuLoading,
  // loadingRowId,
  isPagingAllowed,
  onFilter,
  filterConfig,
  // disableOnPremium = false,
  filteredRecords,
  configClassName,
  filterSearchButtonText,
  onFilterSearch,
  showFilterSearchButton,
}) => {
  const [selected, setSelected] = React.useState<any[]>(selectedIds);
  const [localSearch, setLocalSearch] = React.useState<string>(
    searchValue ?? ""
  );
  const [search, setSearch] = React.useState<string>(searchValue ?? "");
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "DESC" | "ASC";
  } | null>(defaultSort || null);

  const [validationErrors, setValidationErrors] = React.useState<{
    [key: string]: string;
  }>({});

  React.useEffect(() => {
    if (
      defaultSort &&
      (sortConfig?.key !== defaultSort.key ||
        sortConfig?.direction !== defaultSort.direction)
    ) {
      setSortConfig(defaultSort);
    }
  }, [defaultSort]);

  React.useEffect(() => {
    if (!arraysEqual(selected, selectedIds)) {
      setSelected(selectedIds);
    }
  }, [selectedIds]);

  const arraysEqual = (a: any[], b: any[]) =>
    a.length === b.length && a.every((val, idx) => val === b[idx]);

  const hasCheckboxColumn = headers.some((header) => header.checkbox);
  const allIds = data.map((row) => row.id).filter(Boolean);
  allIds.length > 0 && allIds.every((id) => selected.includes(id));
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selected.includes(id));

  const handleSelectRow = (checked: boolean, id: string) => {
    const newSelected = checked
      ? [...selected, id]
      : selected.filter((selectedId) => selectedId !== id);
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = Array.from(new Set([...selected, ...allIds]));
      setSelected(newSelected);
      onSelectionChange?.(newSelected);
    } else {
      const newSelected = selected.filter((id) => !allIds.includes(id));
      setSelected(newSelected);
      onSelectionChange?.(newSelected);
    }
  };

  const handleSort = (key: string) => {
    let direction: "DESC" | "ASC" = "DESC";
    if (
      sortConfig &&
      // sortConfig.key === key &&
      sortConfig.direction === "DESC"
    ) {
      direction = "ASC";
    } else {
      direction = "DESC";
    }
    const newSortConfig = {
      key: key === "CreatedOnBy" ? "CreatedOn" : key,
      direction,
    };
    setSortConfig(newSortConfig);

    if (onSort) onSort(key, direction);
  };

  const handleSearch = (e: any) => {
    if (e.key === "Backspace" && localSearch.length === 1) {
      onSearch?.("");
    } else {
      onSearch?.(localSearch.trim()); // Trigger onSearch only here
    }
  };

  React.useEffect(() => {
    if (searchValue !== undefined && searchValue !== search) {
      setSearch(searchValue ?? "");
    }
  }, [searchValue]);

  const validateFullName = (inputValue: string): string => {
    let formattedValue = inputValue.replace(/\s{2,}/g, " "); // Replace multiple spaces with a single space
    return formattedValue.trimStart(); // Allow spaces in between but prevent leading spaces
  };

  const handleSearchChange = (value: string) => {
    const validatedValue = validateFullName(value);
    setLocalSearch(validatedValue); // Only update local state, no onSearch call
  };

  const [selectedFilters, setSelectedFilters] = React.useState<{
    [key: string]: string;
  }>({});

  const handleFilterSearch = (filterKey: string, item: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };

      if (!item || item.trim() === "") {
        delete newFilters[filterKey];
      } else {
        newFilters[filterKey] = item;
      }

      if (onFilter && !onFilterSearch) {
        onFilter(newFilters);
      }

      return newFilters;
    });
  };

  React.useEffect(() => {
    const newErrors: { [key: string]: string } = {};

    // Validate CreatedOn date range
    if (selectedFilters.CreatedOnFrom && selectedFilters.CreatedOnTo) {
      const fromDate = new Date(selectedFilters.CreatedOnFrom);
      const toDate = new Date(selectedFilters.CreatedOnTo);

      if (fromDate > toDate) {
        newErrors.CreatedOnFrom = "From date cannot be after To date";
        newErrors.CreatedOnTo = "To date cannot be before From date";
      }
    }

    // Validate StartDate and EndDate range
    if (selectedFilters.StartDate && selectedFilters.EndDate) {
      const startDate = new Date(selectedFilters.StartDate);
      const endDate = new Date(selectedFilters.EndDate);

      if (startDate > endDate) {
        newErrors.StartDate = "Start date cannot be after End date";
        newErrors.EndDate = "End date cannot be before Start date";
      }
    }

    setValidationErrors(newErrors);
  }, [selectedFilters]);

  const handleSearchClick = () => {
    if (Object.keys(validationErrors).length === 0) {
      onFilterSearch?.(selectedFilters);
    }
  };
  const handlePageChange = (newPage: number) => {
    // Convert 1-based page to 0-based for parent component
    const newOffset = newPage - 1;
    onPageChange?.(newPage, newOffset);
  };

  const handlePageSizeChange = (newSize: number) => {
    onLimitChange?.(newSize);
  };

  const scrollRef = React.useRef<HTMLDivElement>(null);
  return (
    <div>
      <div
        className={cn(
          "h-full overflow-hidden rounded-lg border shadow-regular bg-white border-border-gray font-nunito",
          mainClassName
        )}
      >
        {headingtitle && (
          <h3 className="px-4 py-2 text-normal leading-sm text-text-primary font-medium">
            {headingtitle}
          </h3>
        )}
        {(onSearch || filterConfig) && (
          <div
            className={`flex w-full items-center px-5 py-4 border-b border-border-gray  flex-wrap gap-4 ${configClassName} `}
          >
            {onSearch && (
              <FormInput
                className="rounded-lg w-full md:w-auto"
                innerClassName="w-full px-3 py-2 text-md  focus-within:shadow-xs transition-all duration-200"
                inputClass="placeholder:text-[#A6AAAF] "
                placeholder="Search"
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e: any) => {
                  if (e.key === "Enter") {
                    handleSearch(e);
                  }
                  if (e.key === "Backspace" && localSearch.length === 1) {
                    handleSearch(e);
                  }
                }}
                pre={
                  <i
                    className="ti ti-search h-5 w-5 mr-2 text-md cursor-pointer text-[#A6AAAF]"
                    onClick={(e) => handleSearch(e)}
                  />
                }
                post={
                  localSearch && (
                    <X
                      className="w-3 h-3 cursor-pointer text-text-secondary"
                      onClick={() => {
                        setLocalSearch("");
                        onSearch?.("");
                      }}
                    />
                  )
                }
              />
            )}
            {filterConfig && (
              <div className="w-full">
                <SimpleAccordion
                  triggerClassName="py-3"
                  items={[
                    {
                      id: "filters",
                      title: "Filters",
                      icon: <FilterIcon className="w-4 h-4" />,
                      content: (
                        <div className="flex flex-col gap-4 w-full px-4 pb-4">
                          {/* Fields in equal grid rows */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                            {filterConfig.map((filter, index) => (
                              <div key={index} className="w-full">
                                {filter.type === "select" ? (
                                  <FilterMenu
                                    key={filter.key}
                                    filterKey={filter.key}
                                    label={filter.label}
                                    items={filter.items}
                                    selected={selectedFilters[filter.key]}
                                    onSelect={handleFilterSearch}
                                    triggerClassName="w-full"
                                    contentClassName={
                                      filter.key.toLowerCase() !== "status" ? "h-52" : ""
                                    }
                                    disabled={loading}
                                  />
                                ) : filter.type === "button" ? (
                                  <Button
                                    disabled={loading}
                                    variant={"filterBtn"}
                                    className={cn(
                                      selectedFilters[filter.label] &&
                                      "bg-primary text-white "
                                    )}
                                    onClick={() =>
                                      handleFilterSearch(filter.label, filter.key)
                                    }
                                    type="button"
                                  >
                                    {filter.label}
                                  </Button>
                                ) : filter.type === "text" ? (
                                  <FormInput
                                    disabled={loading}
                                    className="rounded-lg custom-shadow-lg w-full"
                                    innerClassName="w-full px-3 py-2 text-md focus-within:shadow-xs transition-all duration-200"
                                    inputClass="placeholder:text-[#A6AAAF]"
                                    placeholder={filter.placeholder || filter.label}
                                    value={selectedFilters[filter.key] || ""}
                                    onChange={(e) =>
                                      handleFilterSearch(filter.key, e.target.value)
                                    }
                                    onKeyDown={(e: any) => {
                                      if (e.key === "Enter") {
                                        onFilterSearch?.({
                                          ...selectedFilters,
                                          [filter.key]: e.currentTarget.value.trim(),
                                        });
                                      } else if (e.key === "Backspace") {
                                        const currentValue = e.currentTarget.value;
                                        if (currentValue.length === 1) {
                                          setTimeout(() => {
                                            const updatedFilters = { ...selectedFilters };
                                            delete updatedFilters[filter.key];
                                            onFilterSearch?.(updatedFilters);
                                          }, 0);
                                        }
                                      }
                                    }}
                                  />
                                ) : filter.type === "date" ? (
                                  <div className="w-full">
                                    <DateInput
                                      disabled={loading}
                                      className={cn(
                                        "rounded-lg custom-shadow-lg w-full",
                                        validationErrors[filter.key] && "border-red-500"
                                      )}
                                      inputClassName="placeholder:text-[#A6AAAF]"
                                      placeholder={filter.placeholder || filter.label}
                                      value={
                                        selectedFilters[filter.key]
                                          ? new Date(selectedFilters[filter.key])
                                          : undefined
                                      }
                                      onChange={(e) => {
                                        handleFilterSearch(
                                          filter.key,
                                          e ? format(e, "yyyy-MM-dd") : ""
                                        );
                                      }}
                                    />
                                    {validationErrors[filter.key] && (
                                      <p className="text-[12px] text-error-maindark">
                                        {validationErrors[filter.key]}
                                      </p>
                                    )}
                                  </div>
                                ) : filter.type === "auto-complete" ? (
                                  <CustomAutocompleteSelect
                                    isDisabled={loading}
                                    key={filter.key}
                                    placeholder={filter.placeholder}
                                    options={filter.items || []}
                                    value={selectedFilters[filter.key] || ""}
                                    onChange={(val) =>
                                      handleFilterSearch(filter.key, val as string)
                                    }
                                    className="!w-full"
                                    triggerClassName={cn(
                                      "w-full !py-[10px] px-[14px] shadow-lg"
                                    )}
                                  />
                                ) : null}
                              </div>
                            ))}
                          </div>

                          {/* Bottom row: buttons on the right */}
                          <div className="flex justify-start w-full">
                            <div className="flex items-center gap-2">
                              {showFilterSearchButton !== false && onFilterSearch && (
                                <IconButton
                                  className={cn(
                                    "bg-primary text-white hover:shadow-sm px-4 py-1.5 whitespace-nowrap",
                                    Object.keys(validationErrors).length > 0 &&
                                    "opacity-50 cursor-not-allowed"
                                  )}
                                  onClick={handleSearchClick}
                                  type="button"
                                  icon={<i className="ti ti-search h-5 w-5 text-md" />}
                                  text={filterSearchButtonText || ""}
                                  disabled={Object.keys(selectedFilters).length === 0}
                                />
                              )}
                              <IconButton
                                className="bg-gray-300 text-text-secondary hover:bg-gray-50 px-4 py-1.5 whitespace-nowrap"
                                onClick={() => {
                                  setSelectedFilters({});
                                  onFilterSearch?.({});
                                }}
                                type="button"
                                icon={<i className="ti ti-x h-5 w-5 text-md" />}
                              />
                            </div>
                          </div>
                        </div>
                      ),
                    },
                  ]}
                  defaultOpenId={Object.keys(selectedFilters).length > 0 ? "filters" : undefined}
                />
              </div>
            )}
            {/* {filterConfig && (
              <div className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {filterConfig.map((filter, index) => (
                    <div key={index} className="w-full">
                      {filter.type === "select" ? (
                        <FilterMenu
                          key={filter.key}
                          filterKey={filter.key}
                          label={filter.label}
                          items={filter.items}
                          selected={selectedFilters[filter.key]}
                          onSelect={handleFilterSearch}
                          triggerClassName="w-full"
                          contentClassName={
                            filter.key.toLowerCase() !== "status" ? "h-52" : ""
                          }
                          disabled={loading}
                        />
                      ) : filter.type === "button" ? (
                        <Button
                          disabled={loading}
                          variant={"filterBtn"}
                          className={cn(
                            selectedFilters[filter.label] &&
                              "bg-primary text-white "
                          )}
                          onClick={() =>
                            handleFilterSearch(filter.label, filter.key)
                          }
                          type="button"
                        >
                          {filter.label}
                        </Button>
                      ) : filter.type === "text" ? (
                        <FormInput
                          disabled={loading}
                          className="rounded-lg custom-shadow-lg w-full"
                          innerClassName="w-full px-3 py-2 text-md focus-within:shadow-xs transition-all duration-200"
                          inputClass="placeholder:text-[#A6AAAF]"
                          placeholder={filter.placeholder || filter.label}
                          value={selectedFilters[filter.key] || ""}
                          onChange={(e) =>
                            handleFilterSearch(filter.key, e.target.value)
                          }
                          onKeyDown={(e: any) => {
                            if (e.key === "Enter") {
                              onFilterSearch?.({
                                ...selectedFilters,
                                [filter.key]: e.currentTarget.value.trim(),
                              });
                            } else if (e.key === "Backspace") {
                              const currentValue = e.currentTarget.value;
                              if (currentValue.length === 1) {
                                setTimeout(() => {
                                  const updatedFilters = { ...selectedFilters };
                                  delete updatedFilters[filter.key];
                                  onFilterSearch?.(updatedFilters);
                                }, 0);
                              }
                            }
                          }}
                        />
                      ) : filter.type === "date" ? (
                        <div className="w-full">
                          <DateInput
                            disabled={loading}
                            className={cn(
                              "rounded-lg custom-shadow-lg w-full",
                              validationErrors[filter.key] && "border-red-500"
                            )}
                            inputClassName="placeholder:text-[#A6AAAF]"
                            placeholder={filter.placeholder || filter.label}
                            //dateRangeMode="fromStart"
                            value={
                              selectedFilters[filter.key]
                                ? new Date(selectedFilters[filter.key])
                                : undefined
                            }
                            onChange={(e) => {
                              handleFilterSearch(
                                filter.key,
                                e ? format(e, "yyyy-MM-dd") : ""
                              );
                            }}
                          />
                          {validationErrors[filter.key] && (
                            <p className="text-[12px] text-error-maindark">
                              {validationErrors[filter.key]}
                            </p>
                          )}
                        </div>
                      ) : filter.type === "auto-complete" ? (
                        <CustomAutocompleteSelect
                          isDisabled={loading}
                          key={filter.key}
                          placeholder={filter.placeholder}
                          options={filter.items || []}
                          value={selectedFilters[filter.key] || ""}
                          onChange={(val) =>
                            handleFilterSearch(filter.key, val as string)
                          }
                          className="!w-full"
                          triggerClassName={cn(
                            "w-full !py-[10px] px-[14px] shadow-lg"
                          )}
                        />
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="flex justify-start w-full">
                  <div className="flex items-center gap-2">
                    {showFilterSearchButton !== false && onFilterSearch && (
                      <IconButton
                        className={cn(
                          "bg-primary text-white hover:shadow-sm px-4 py-1.5 whitespace-nowrap",
                          Object.keys(validationErrors).length > 0 &&
                            "opacity-50 cursor-not-allowed"
                        )}
                        onClick={handleSearchClick}
                        type="button"
                        icon={<i className="ti ti-search h-5 w-5 text-md" />}
                        text={filterSearchButtonText || ""}
                        disabled={Object.keys(selectedFilters).length === 0}
                      />
                    )}
                    <IconButton
                      className="bg-gray-300 text-text-secondary hover:bg-gray-50 px-4 py-1.5 whitespace-nowrap"
                      onClick={() => {
                        setSelectedFilters({});
                        onFilterSearch?.({});
                      }}
                      type="button"
                      icon={<i className="ti ti-x h-5 w-5 text-md" />}
                    />
                  </div>
                </div>
              </div>
            )} */}
          </div>
        )}
        <div
          className={cn(
            "w-full overflow-hidden relative overflow-x-auto overflow-y-auto",
            scrollClassName,
            loading && "overflow-hidden"
          )}
          style={{ position: "relative" }}
          ref={scrollRef}
        >
          <table className={cn("h-full w-full table-auto tabular-nums mb-4")}>
            {data?.length > 0 && (
              <thead
                className={cn(
                  "h-10 border-border-gray border-y !border-t-0 bg-[#F9FAFB] text-md leading-[20px] !font-semibold text-[#1b2850]",
                  thClassName
                )}
              >
                <tr>
                  {headers.map((header, headerIndex) => (
                    <th key={headerIndex} className={cn("whitespace-nowrap")}>
                      <div
                        className={cn(
                          "flex items-center justify-start px-4 py-2",
                          header.key === "icon" && "w-3",
                          header.tableHeaderClassName
                        )}
                      >
                        {header.checkbox ? (
                          <div className="flex items-center ml-2">
                            <Checkbox
                              checked={allSelected}
                              onCheckedChange={handleSelectAll}
                            />
                          </div>
                        ) : (
                          <h4>{header.label}</h4>
                        )}
                        {header.sortable && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleSort(header.key)}
                          >
                            {sortConfig && sortConfig.key === header.key ? (
                              sortConfig.direction === "ASC" ? (
                                <ArrowUp className="" />
                              ) : (
                                <ArrowDown />
                              )
                            ) : (
                              <ArrowDownUp />
                            )}
                          </Button>
                        )}
                      </div>
                    </th>
                  ))}
                  {actions && (
                    <th>
                      <div className="flex items-center justify-center px-6 py-4">
                        <h4>Actions</h4>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
            )}
            {/* {!loading && ( */}
            <tbody className={cn(tbodyClassName, "")}>
              {data && data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={cn(
                      onRowClick && "cursor-pointer",
                      "border-b-[1px] border-border-gray hover:bg-[#eee] last:border-b-0",
                      selected.includes(row.id) && ""
                    )}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {hasCheckboxColumn && (
                      <td className="w-7">
                        <div className="ml-2 flex items-center justify-start">
                          <Checkbox
                            checked={selected.includes(row.id)}
                            onCheckedChange={(checked) =>
                              handleSelectRow(Boolean(checked), row.id)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </td>
                    )}
                    {headers
                      .filter((item) => item.checkbox !== true)
                      .map((header, headerIndex) => (
                        <td
                          key={headerIndex}
                          onClick={() =>
                            header.navigate && header.navigate(row)
                          }
                          className={cn(
                            header.navigate && "cursor-pointer",
                            header.dataClassName
                          )}
                        >
                          <div
                            className={cn(
                              "px-4 py-4 text-md leading-sm text-text-secondary font-nunito",
                              header.columnAlignClassName
                            )}
                          >
                            <span className="block overflow-hidden truncate text-ellipsis">
                              {header.render ? (
                                header.render(row)
                              ) : row[header.key] === null ||
                                row[header.key] === undefined ||
                                row[header.key] === "" ? (
                                header.key.toLowerCase() === "icon" ? (
                                  <div className="cursor-pointer text-red-500">
                                    {header.icon}
                                  </div>
                                ) : (
                                  <div className="text-center">--</div>
                                )
                              ) : header.key.toLowerCase() === "tag" ? (
                                <MyTooltip
                                  trigger={
                                    <div className="flex items-center justify-center gap-1">
                                      {row?.Tag?.split(",")
                                        .map((tag: string) => tag.trim())
                                        .slice(0, 2)
                                        .map((tag: string, index: number) => (
                                          <div
                                            key={index}
                                            className="rounded-lg border border-gray-300 p-2"
                                          >
                                            {tag.length > 10
                                              ? `${tag.slice(0, 10)}...`
                                              : tag || "--"}
                                          </div>
                                        ))}
                                    </div>
                                  }
                                  className="!bg-gray-200"
                                  tag={(() => {
                                    const tagsArray = row?.Tag
                                      ? row.Tag.split(",").map((tag: string) =>
                                        tag.trim()
                                      )
                                      : [];

                                    return tagsArray.length > 2 ||
                                      tagsArray.some(
                                        (tag: string) => tag.length > 10
                                      ) ? (
                                      <div className="flex max-w-96 flex-wrap gap-2 overflow-hidden overflow-y-auto">
                                        {tagsArray.map(
                                          (tag: string, index: number) => (
                                            <div
                                              key={index}
                                              className="rounded-lg border border-gray-300 p-2"
                                            >
                                              {tag || "--"}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    ) : null;
                                  })()}
                                  side="top"
                                />
                              ) : header.key.toLowerCase() === "createdon" &&
                                header.tooltip ? (
                                <StyledDataCell
                                  createdOn={row?.CreatedOn}
                                  // createdBy={row?.CreatedBy} // Show ellipsis in the cell
                                  className="max-w-[8rem] truncate"
                                />
                              ) : // <MyTooltip
                                //   trigger={

                                //   }
                                //   className="!bg-gray-200"
                                //   tag={row?.CreatedBy || "--"} // Full value in the tooltip
                                //   side="top"
                                // />
                                header.key.toLowerCase() === "recentlogtime" ? (
                                  <StyledDataCell
                                    createdOn={row?.RecentLogTime}
                                    createdBy={format(
                                      row?.RecentLogTime,
                                      "HH:mm:ss"
                                    )} // Show ellipsis in the cell
                                    className="max-w-[8rem] truncate"
                                  />
                                ) : header.key.toLowerCase() === "lastmodified" ||
                                  header.key.toLowerCase() === "startdate" ||
                                  header.key.toLowerCase() === "enddate" ? (
                                  <StyledDataCell
                                    dataAlignClassName="!items-start"
                                    // createdBy={
                                    //   header.key.toLowerCase() === "lastmodified"
                                    //     ? row?.ModifiedBy
                                    //     : ""
                                    // }
                                    createdOn={
                                      header.key.toLowerCase() === "enddate"
                                        ? row?.EndDate || "--"
                                        : header.key.toLowerCase() === "startdate"
                                          ? row?.StartDate
                                          : row?.LastModified || "--"
                                    }
                                  />
                                ) : header.key.toLowerCase() === "expirydate" ? (
                                  <StyledDataCell
                                    createdBy={""}
                                    createdOn={
                                      row?.ExpiryDate === "-" ||
                                        !isValid(
                                          parse(
                                            row?.ExpiryDate,
                                            "MMM dd yyyy hh:mma",
                                            new Date()
                                          )
                                        )
                                        ? "--"
                                        : format(
                                          parse(
                                            row?.ExpiryDate,
                                            "MMM dd yyyy hh:mma",
                                            new Date()
                                          ),
                                          "yyyy-MM-dd"
                                        )
                                    }
                                  />
                                ) : header.key.toLowerCase() === "packagename" ? (
                                  <div>
                                    <h1 className="text-4xs font-bold leading-none text-brand-600">
                                      {row.PackageName}
                                    </h1>
                                    <h4 className="mt-1 text-6xs font-normal uppercase">
                                      {row.PackageType}
                                    </h4>
                                  </div>
                                ) : (
                                  !header.tooltip && row[header.key]
                                )}
                            </span>
                            {header.tooltip &&
                              header.key.toLowerCase() !== "createdon" && (
                                <div>
                                  <MyTooltip
                                    trigger={row[header.key]}
                                    tag={row[header.key]}
                                    side="top"
                                    className={cn(
                                      "!bg-gray-300",
                                      header.tooltipClass
                                    )}
                                  />
                                </div>
                              )}
                          </div>
                        </td>
                      ))}
                    {actions && (
                      <td>
                        <div className="flex items-center justify-center gap-2 mx-6">
                          {actions
                            .filter((action) =>
                              action.condition ? action.condition(row) : true
                            )
                            .map((action, index) => (
                              <IconButton
                                tooltipContent={action.label}
                                disabled={
                                  action.isDisabled
                                    ? action.isDisabled(row)
                                    : false
                                }
                                key={index}
                                type="button"
                                icon={action.icon}
                                onClick={() => {
                                  action.onClick &&
                                    action.onClick(action.action, row);
                                }}
                                className="cursor-pointer border border-border-gray text-text-primary font-medium rounded-md w-8 h-8 flex items-center justify-center"
                              />
                            ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <>
                  {/* {!loading && ( */}
                  <tr>
                    <td
                      colSpan={headers.length + 2}
                      className={cn(
                        "h-80 px-6 py-4 text-center text-xl font-semibold",
                        heightClassName
                      )}
                    >
                      {!loading && "No records found"}
                    </td>
                  </tr>
                  {/* )} */}
                </>
              )}
            </tbody>
            {/* )} */}
          </table>
          {loading && (
            <div
              className={`absolute z-25 h-full top-0 left-0 bg-white/30 backdrop-blur-xs pointer-events-none `}
              style={{
                width:
                  window.innerWidth && window.innerWidth <= 768
                    ? window.innerWidth - 50
                    : "100%",
                transform: `translateX(${scrollRef.current?.scrollLeft ?? 0
                  }px)`,
              }}
            >
              <div className={`${data.length <= 2 ? "h-44" : "h-96"}`}>
                <Loader />
              </div>
            </div>
          )}
        </div>

        {isPagingAllowed && data.length > 0 && (
          <TablePagination
            currentPage={currentPage ?? 1}
            totalRecords={totalRecords}
            pageSize={pagination?.limit ?? 5}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={loading}
            pageSizeOptions={[10, 25, 50]}
            showPageInfo={true}
            showPageSizeSelector={true}
            filteredRecords={filteredRecords}
          />

          // <Pagination
          //   limit={limit}
          //   itemsPerPage={limit}
          //   onPageChange={onPageChange}
          //   totalRecords={totalRecords}
          //   offset={page}
          //   isLoading={loading}
          //   onLimitChange={onLimitChange}
          //   currentPage={currentPage ?? 1}
          // />
        )}
      </div>
    </div>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  SimpleTable,
};
