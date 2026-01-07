export interface ProductDetailCardProps {
  Event: {
    ProductId: string;
    CreatedOn: string;
    CreatedBy: string;
    Name: string;
    VenueName: string;
    Description: string;
    AdultCost: number;
    ChildrenCost: number;
    LastModified: string;
    ModifiedBy: string;
    Active: boolean;
    LocationName: string;
    ProductTypeId: number;
    ProductType: string;
    Categories: { CategoryId: number; Name: string }[];
    Amenities: { AmenityId: number; Name: string }[];
  };
}
interface TableHeader {
  key: string;
  label: string;
  dataClassName?: string;
  tooltip?: boolean;
  tooltipTriggerClassName?: string;
  render?: (rowData: any) => React.ReactNode;
}
export interface TopItemsCardProps {
  title: string;
  iconClass: string;
  buttonLabel: string;
  buttonClick: () => void;
  tableData: any[];
  tableHeaders: TableHeader[];
  bgClass?: string;
}
