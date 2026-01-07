import React, { useState } from "react";
import { DepartmentCard, EmployeeCard, GridFilter } from "@/components/ui/card";
import { DataGridProps } from "../types";
const DataGrid: React.FC<DataGridProps> = ({
  data,
  filterConfig,
  onItemClick,
  onItemSelect,
  onFilter,
  title,
  bulkActions,
  actions,
  cardType,
}) => {
  const [selectedItems, setselectedItems] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = React.useState<{
    [key: string]: string;
  }>({});
  const handleSelect = (filterKey: string, item: string) => {
    const newFilters = {
      ...selectedFilters,
      [filterKey]: item,
    };

    setSelectedFilters(newFilters);

    if (onFilter) {
      onFilter(newFilters);
    }
  };

  const handleItemSelect = (employeeId: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedItems, employeeId]
      : selectedItems.filter((id) => id !== employeeId);

    setselectedItems(newSelected);
    onItemSelect?.(newSelected);
  };

  return (
    <>
      <GridFilter
        filterConfig={filterConfig}
        selectedFilters={selectedFilters}
        selectedData={selectedItems}
        onFilterSelect={handleSelect}
        title={title}
        actions={bulkActions}
      />

      {/* we can apply conditional statement to show the relevant data in grid in future*/}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cardType === "employee"
          ? data.map((item: any) => (
            <EmployeeCard
              key={item.id}
              employee={item}
              isSelected={selectedItems.includes(item.id)}
              onSelect={(checked) => handleItemSelect(item.id, checked)}
              onClick={() => onItemClick?.(item)}
              actions={actions}
            />
          ))
          : cardType === "department"
            ? data.map((item: any) => (
              <DepartmentCard
                key={item.id}
                department={item}
                isSelected={selectedItems.includes(item.id)}
                onSelect={(checked) => handleItemSelect(item.id, checked)}
                onClick={() => onItemClick?.(item)}
                actions={actions}
              />
            ))
            : null}
      </div>
    </>
  );
};

export default DataGrid;
