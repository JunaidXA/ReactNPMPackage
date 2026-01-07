import React, { useState, useCallback, memo } from "react";
import { IconButton } from "./miscellaneous";
import { ExcelSVG, PDFSvg } from "../svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/api/store";
import { toggleNavbar } from "@/api/CommonSlice";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  IListingCardsProps,
  IListingHeaderProps,
  IListingTableProps,
  IPageListingProps,
} from "../types";
import { SimpleTable } from "./table";
import { Card } from "./card";
import { debounce, useMediaQuery } from "@/helper";

// Memoized ListingHeader component
export const ListingHeader = memo<IListingHeaderProps>(
  ({
    heading,
    subTitle,
    handlePDFClick,
    handleExcelClick,
    handleRefreshClick,
    navbarToggle,
    headerActionButtons,
    handleHeaderActionButtonClick,
    isGridAllowed,
    isKanbanAllowed,
    listView,
    setListView,
    customViewToggleButtons,
    handleBackButtonWithHeading,
  }) => {
    const dispatch = useDispatch();
    const isNavbarVisible = useSelector(
      (state: RootState) => state.common.isNavbarVisible
    );

    // Memoize handleListView to prevent re-creation
    const handleListView = useCallback(
      debounce((view: "list" | "grid" | "kanban") => {
        setListView?.(view);
      }, 100),
      [setListView]
    );

    return (
      <div className="font-nunito flex items-center justify-between">
        <div className="flex items-center">
          {handleBackButtonWithHeading && (
            <IconButton
              icon={<i className="ti ti-arrow-left"></i>}
              type="button"
              onClick={handleBackButtonWithHeading}
            />
          )}
          <div>
            {(heading || subTitle) && (
              <>
                {heading && (
                  <h1 className="font-bold text-[20px] text-text-black">
                    {heading}
                  </h1>
                )}
                {subTitle && (
                  <p className="text-md text-text-secondary">{subTitle}</p>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex space-x-2 items-center text-[#646b72] text-md">
          {customViewToggleButtons ? (
            <div className="flex items-center gap-2">
              {customViewToggleButtons.map((btn, idx) => (
                <IconButton
                  key={idx}
                  className={cn(
                    "w-[35px] h-[35px] flex items-center justify-center border rounded-md transition-colors duration-300",
                    btn.isActive
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-border-gray hover:bg-[#e3e3e3]"
                  )}
                  icon={btn.icon}
                  tooltipContent={btn.tooltip}
                  tooltipSide="left"
                  onClick={btn.onClick}
                />
              ))}
              <div className="h-9 border border-border-gray mx-2" />
            </div>
          ) : (
            isGridAllowed && (
              <div className="flex items-center justify-center space-x-2">
                {isKanbanAllowed && (
                  <IconButton
                    className={cn(
                      "w-[35px] h-[35px] flex items-center justify-center border rounded-md transition-colors duration-300",
                      listView === "kanban"
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-border-gray hover:bg-[#e3e3e3]"
                    )}
                    icon={<i className="ti ti-layout-kanban" />}
                    onClick={() => handleListView("kanban")}
                  />
                )}
                <IconButton
                  className={cn(
                    "w-[35px] h-[35px] flex items-center justify-center border rounded-md transition-colors duration-300",
                    listView === "list"
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-border-gray hover:bg-[#e3e3e3]"
                  )}
                  icon={<i className="ti ti-list" />}
                  onClick={() => handleListView("list")}
                />
                <IconButton
                  className={cn(
                    "w-[35px] h-[35px] flex items-center justify-center border rounded-md transition-colors duration-300",
                    listView === "grid"
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-border-gray hover:bg-[#e3e3e3]"
                  )}
                  icon={<i className="ti ti-layout-grid" />}
                  onClick={() => handleListView("grid")}
                />
                <div className="h-9 border border-border-gray mx-2" />
              </div>
            )
          )}
          {/* {isGridAllowed && (
            <div className="flex items-center justify-center space-x-2">
              {isKanbanAllowed && (
                <IconButton
                  className={cn(
                    "w-[35px] h-[35px] flex items-center justify-center border rounded-md transition-colors duration-300",
                    listView === "kanban"
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-border-gray hover:bg-[#e3e3e3]"
                  )}
                  icon={<i className="ti ti-layout-kanban" />}
                  onClick={() => handleListView("kanban")}
                />
              )}
              <IconButton
                className={cn(
                  "w-[35px] h-[35px] flex items-center justify-center border rounded-md transition-colors duration-300",
                  listView === "list"
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-border-gray hover:bg-[#e3e3e3]"
                )}
                icon={<i className="ti ti-list" />}
                onClick={() => handleListView("list")}
              />
              <IconButton
                className={cn(
                  "w-[35px] h-[35px] flex items-center justify-center border rounded-md transition-colors duration-300",
                  listView === "grid"
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-border-gray hover:bg-[#e3e3e3]"
                )}
                icon={<i className="ti ti-layout-grid" />}
                onClick={() => handleListView("grid")}
              />
              <div className="h-9 border border-border-gray mx-2" />
            </div>
          )} */}
          {handlePDFClick && (
            <IconButton
              className="w-[35px] h-[35px] bg-white flex items-center justify-center border border-border-gray rounded-md hover:bg-[#e3e3e3] transition-colors duration-300"
              icon={<PDFSvg />}
              tooltipContent="Pdf"
              tooltipSide="left"
              onClick={handlePDFClick}
            />
          )}
          {handleExcelClick && (
            <IconButton
              className="w-[35px] h-[35px] bg-white flex items-center justify-center border border-border-gray rounded-md hover:bg-[#e3e3e3] transition-colors duration-300"
              icon={<ExcelSVG />}
              tooltipContent="Excel"
              tooltipSide="left"
              onClick={handleExcelClick} // Fixed: Use handleExcelClick instead of handlePDFClick
            />
          )}
          {handleRefreshClick && (
            <IconButton
              className="w-[35px] h-[35px] bg-white flex items-center justify-center border border-border-gray rounded-md hover:bg-[#e3e3e3] transition-colors duration-300"
              icon={<i className="ti ti-refresh" />}
              tooltipContent="Refresh"
              tooltipSide="left"
              onClick={handleRefreshClick}
            />
          )}
          {navbarToggle && window.innerWidth >= 768 && (
            <IconButton
              className={cn(
                "w-[35px] h-[35px] flex items-center justify-center border border-border-gray rounded-md transition-colors duration-300",
                isNavbarVisible
                  ? "bg-primary text-white"
                  : "bg-white hover:bg-[#e3e3e3] hover:text-primary"
              )}
              icon={
                <i
                  className={
                    !isNavbarVisible ? "ti ti-chevron-up" : "ti ti-chevron-down"
                  }
                />
              }
              tooltipContent="Collapse"
              tooltipSide="left"
              onClick={() => dispatch(toggleNavbar(!isNavbarVisible))}
            />
          )}
          {headerActionButtons?.map((item, index) => (
            <Button
              key={index}
              pre={item.preIcon}
              post={item.postIcon}
              className={item.className}
              onClick={() => handleHeaderActionButtonClick?.(item.action)}
              variant={item.variant}
              type={item.type ?? "button"}
            >
              {item.buttonText}
            </Button>
          ))}
        </div>
      </div>
    );
  }
);

// Memoized ListingCards component
export const ListingCards = memo<IListingCardsProps>(
  ({ cards, mainClassName }) => {
    const isDesktopBreakdown = useMediaQuery(
      "(min-width: 769px) and (max-width: 1200px)"
    );
    const isTabletBreakdown = useMediaQuery("(max-width: 768px)");

    return (
      <div
        className={cn(
          "grid gap-6",
          isDesktopBreakdown
            ? "grid-cols-2 grid-rows-2"
            : isTabletBreakdown
            ? "grid-cols-1 grid-rows-4"
            : "grid-cols-4 grid-rows-1",
          mainClassName
        )}
      >
        {cards.map((card, index) => (
          <Card
            className={cn(
              card.cardClassName,
              "flex flex-row items-center rounded-lg justify-between p-5 text-white w-full"
            )}
            key={index}
          >
            <div className="flex flex-col">
              <h1 className="text-md mb-1">{card.title}</h1>
              <p className="text-lg">{card.subTitle} </p>
            </div>
            <div className="w-12 h-12 text-base leading-12 flex rounded-sm items-center justify-center bg-white/20">
              {card.icon}
            </div>
          </Card>
        ))}
      </div>
    );
  }
);

// Memoized ListingTable component
export const ListingTable = memo<IListingTableProps>(
  ({
    type = "default",
    data,
    headers,
    actions,
    className,
    currentPage,
    defaultSort,
    filterConfig,
    headingtitle,
    heightClassName,
    isMenuLoading,
    isPagingAllowed,
    loading,
    loadingRowId,
    mainClassName,
    onFilter,
    onLimitChange,
    onPageChange,
    onRowClick,
    onSearch,
    onSelectionChange,
    onSort,
    onViewMoreClick,
    pagination,
    scrollClassName,
    searchValue,
    selectedIds,
    tbodyClassName,
    thClassName,
    totalRecords,
    totalTableRows,
    filteredRecords,
    filterSearchButtonText,
    onFilterSearch,
    showFilterSearchButton,
  }) => {
    return (
      <div className={cn("overflow-x-auto overflow-y-auto scrollbar-hide")}>
        {type === "default" ? (
          <SimpleTable
            thClassName={thClassName}
            onSearch={onSearch}
            onFilter={onFilter}
            headers={headers}
            data={data}
            filterConfig={filterConfig}
            actions={actions}
            className={className}
            currentPage={currentPage}
            defaultSort={defaultSort}
            headingtitle={headingtitle}
            heightClassName={heightClassName}
            isMenuLoading={isMenuLoading}
            isPagingAllowed={isPagingAllowed}
            loading={loading}
            loadingRowId={loadingRowId}
            mainClassName={mainClassName}
            onLimitChange={onLimitChange}
            onPageChange={onPageChange}
            onRowClick={onRowClick}
            onSelectionChange={onSelectionChange}
            onSort={onSort}
            onViewMoreClick={onViewMoreClick}
            pagination={pagination}
            scrollClassName={scrollClassName}
            searchValue={searchValue}
            selectedIds={selectedIds}
            tbodyClassName={tbodyClassName}
            totalRecords={totalRecords}
            totalTableRows={totalTableRows}
            filteredRecords={filteredRecords}
            filterSearchButtonText={filterSearchButtonText}
            onFilterSearch={onFilterSearch}
            showFilterSearchButton={showFilterSearchButton}
          />
        ) : (
          <>Tabbed list</>
        )}
      </div>
    );
  }
);

// Lazy-load DataGrid to reduce initial load time
const LazyDataGrid = React.lazy(() => import("./data-grid"));

// Main PageListing component
const PageListing: React.FC<IPageListingProps> = ({
  data,
  handleHeaderActionButtonClick,
  headers,
  actions,
  className,
  currentPage,
  defaultSort,
  filterConfig,
  handleExcelClick,
  handlePDFClick,
  handleRefreshClick,
  headerActionButtons,
  heading,
  headingtitle,
  heightClassName,
  isMenuLoading,
  isPagingAllowed,
  loading,
  loadingRowId,
  mainClassName,
  navbarToggle,
  onFilter,
  onLimitChange,
  onPageChange,
  onRowClick,
  onSearch,
  onSelectionChange,
  onSort,
  onViewMoreClick,
  pagination,
  scrollClassName,
  searchValue,
  selectedIds,
  subTitle,
  tbodyClassName,
  thClassName,
  totalRecords,
  totalTableRows,
  type,
  isGridAllowed,
  isKanbanAllowed,
  listingCards,
  listingCardsMainClass,
  gridCardActions,
  gridBulkActions,
  cardType,
  onGridItemClick,
  onGridActionSelect,
  gridTitle,
  filteredRecords,
  filterSearchButtonText,
  onFilterSearch,
  showFilterSearchButton,
}) => {
  const [listView, setListView] = useState<"list" | "grid" | "kanban">("list");

  // Memoize handleHeaderActionButtonClick
  const memoizedHandleHeaderActionButtonClick = useCallback(
    (action: string) => handleHeaderActionButtonClick?.(action),
    [handleHeaderActionButtonClick]
  );

  return (
    <div className="space-y-6">
      <ListingHeader
        handleHeaderActionButtonClick={memoizedHandleHeaderActionButtonClick}
        handleExcelClick={handleExcelClick}
        handlePDFClick={handlePDFClick}
        handleRefreshClick={handleRefreshClick}
        headerActionButtons={headerActionButtons}
        heading={heading}
        navbarToggle={navbarToggle}
        subTitle={subTitle}
        isGridAllowed={isGridAllowed}
        isKanbanAllowed={isKanbanAllowed}
        listView={listView}
        setListView={setListView}
      />
      {listingCards && (
        <ListingCards
          cards={listingCards}
          mainClassName={listingCardsMainClass}
        />
      )}
      {listView === "kanban" && isKanbanAllowed ? (
        <>Kanban</>
      ) : listView === "grid" && isGridAllowed ? (
        <React.Suspense fallback={<div>Loading grid...</div>}>
          <LazyDataGrid
            actions={gridCardActions}
            bulkActions={gridBulkActions}
            cardType={cardType}
            data={data}
            filterConfig={filterConfig}
            onFilter={onFilter}
            onItemClick={onGridItemClick}
            onItemSelect={onGridActionSelect}
            title={gridTitle}
          />
        </React.Suspense>
      ) : listView === "list" ? (
        <ListingTable
          data={data}
          headers={headers}
          actions={actions}
          className={className}
          currentPage={currentPage}
          defaultSort={defaultSort}
          filterConfig={filterConfig}
          headingtitle={headingtitle}
          heightClassName={heightClassName}
          isMenuLoading={isMenuLoading}
          isPagingAllowed={isPagingAllowed}
          loading={loading}
          loadingRowId={loadingRowId}
          mainClassName={mainClassName}
          onFilter={onFilter}
          onLimitChange={onLimitChange}
          onPageChange={onPageChange}
          onRowClick={onRowClick}
          onSearch={onSearch}
          onSelectionChange={onSelectionChange}
          onSort={onSort}
          onViewMoreClick={onViewMoreClick}
          pagination={pagination}
          scrollClassName={scrollClassName}
          searchValue={searchValue}
          selectedIds={selectedIds}
          tbodyClassName={tbodyClassName}
          thClassName={thClassName}
          totalRecords={totalRecords}
          totalTableRows={totalTableRows}
          type={type}
          filteredRecords={filteredRecords}
          filterSearchButtonText={filterSearchButtonText}
          onFilterSearch={onFilterSearch}
          showFilterSearchButton={showFilterSearchButton}
        />
      ) : null}
    </div>
  );
};

export default memo(PageListing);
