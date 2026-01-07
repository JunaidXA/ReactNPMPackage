import React, { useState } from "react";
import { Button, FilterMenu, IconButton, ListingHeader, Loader } from "@/components";
import { FormInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DataGridListingProps } from "../types";

export const DataGridListing: React.FC<DataGridListingProps> = ({
  heading,
  subTitle,
  headerButtons,
  onHeaderButtonClick,
  data,
  loading = false,
  renderCard,
  filterConfig,
  onFilter,
  showMoreEnabled = false,
  onShowMore,
  gridCols = "2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1",
  containerClassName = "",
  cardClassName = "",
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (!value || value.trim() === "") {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  };

  const handleSearchClick = () => {
    onFilter?.(selectedFilters);
  };

  const handleResetClick = () => {
    setSelectedFilters({});
    onFilter?.({});
  };

  const handleRefresh = () => {
    onHeaderButtonClick("refresh");
  };

  return (
    <>
      <ListingHeader heading={heading} subTitle={subTitle} navbarToggle handleRefreshClick={handleRefresh} headerActionButtons={headerButtons} handleHeaderActionButtonClick={onHeaderButtonClick} />

      <div className={cn("mt-10 customBoxShadow rounded-md", containerClassName)}>
        {/* Filters Section */}
        {filterConfig && filterConfig.length > 0 && (
          <div className="flex w-full items-center justify-between px-5 py-3.5 border-b border-border-gray flex-wrap gap-4">
            <div className="flex flex-col gap-4 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {filterConfig.map((filter, index) => (
                  <div key={index} className="w-full">
                    {filter.type === "select" ? (
                      <FilterMenu
                        filterKey={filter.key}
                        label={filter.label}
                        items={filter.items || []}
                        selected={selectedFilters[filter.key]}
                        onSelect={handleFilterChange}
                        triggerClassName="w-full"
                        contentClassName={filter.key.toLowerCase() !== "status" ? "h-52" : ""}
                        disabled={loading}
                      />
                    ) : filter.type === "text" ? (
                      <FormInput
                        disabled={loading}
                        className="rounded-lg custom-shadow-lg w-full"
                        innerClassName="w-full px-3 py-3 text-md focus-within:shadow-xs transition-all duration-200"
                        inputClass="placeholder:text-[#A6AAAF]"
                        placeholder={filter.placeholder || filter.label}
                        value={selectedFilters[filter.key] || ""}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        onKeyDown={(e: any) => {
                          if (e.key === "Enter") {
                            handleSearchClick();
                          }
                        }}
                      />
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="flex justify-start w-full">
                <div className="flex items-center gap-2">
                  <IconButton
                    className="bg-primary text-white hover:shadow-sm px-4 py-1.5 whitespace-nowrap"
                    onClick={handleSearchClick}
                    type="button"
                    icon={<i className="ti ti-search h-5 w-5 text-md" />}
                    disabled={Object.keys(selectedFilters).length === 0}
                  />
                  <IconButton
                    className="bg-gray-300 text-text-secondary hover:bg-gray-50 px-4 py-1.5 whitespace-nowrap"
                    onClick={handleResetClick}
                    type="button"
                    icon={<i className="ti ti-x h-5 w-5 text-md" />}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cards Grid and Show More with Loader */}
        <div className="relative min-h-28">
          {loading && (
            <div className="absolute inset-0 z-10 glassEffect flex justify-center items-center">
              <Loader />
            </div>
          )}

          {/* Cards Grid */}
          <div className={cn("grid gap-5 max-h-[calc(100vh-387px)] overflow-hidden overflow-y-auto p-5", gridCols)}>
            {data.length > 0
              ? data.map((item, index) => (
                  <div key={index} className={cardClassName}>
                    {renderCard(item)}
                  </div>
                ))
              : !loading && (
                  <div className="col-span-full flex justify-center items-center text-gray-500 h-40">
                    <p>No records found</p>
                  </div>
                )}
          </div>

          {/* Show More Button */}
          {showMoreEnabled && (
            <div className="w-full flex justify-end px-5 pb-4">
              <Button variant="showMoreBtn" onClick={onShowMore} disabled={loading}>
                {loading ? "Loading..." : "Show More"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DataGridListing;
