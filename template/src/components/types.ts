import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./ui/button";
import type { MouseEventHandler, ReactNode, SetStateAction } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ApexOptions } from "apexcharts";

export interface IInputProps {
  name?: string;
  placeholder?: string;
  required?: boolean;
  error?: string | React.ReactNode;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: string;
  value?: string | number | undefined | any;
  label?: string;
  className?: string;
  inputClass?: string;
  readOnly?: boolean;
  labelClassName?: string;
  disabled?: boolean;
  pre?: React.ReactNode;
  post?: React.ReactNode;
  innerClassName?: string;
  minLength?: number;
  maxLength?: number;
  subTitle?: string;
  onKeyDown?: any;
  onSearch?: any;
  inputType?: string;
  btnClassName?: string;
  onButtonClick?: any;
  buttonDisabled?: boolean;
  minDate?: string;
  pattern?: string;
}

export interface OTPInputProps {
  onChange: (otp: string) => void;
  className?: string;
  postClass?: string;
  preClass?: string;
}
export interface SVGProps {
  onClick?: (event: React.MouseEvent<HTMLOrSVGElement>) => void;
  className?: string;
  parentClassName?: string;
}

export interface FormSwitchProps {
  name?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  error?: string;
  switchClassName?: string;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  pre?: ReactNode;
  post?: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
}

export interface DashboardCardProps {
  icon?: ReactNode;
  title?: string;
  subTitle?: string | number;
  chart?: ReactNode;
  items?: { label: string; value: string | number }[];
}

export interface ITableHeader {
  label: string;
  key: string;
  type?: "date";
  sortable?: boolean;
  navigate?: (e: string | number) => void;
  headerClassName?: string;
  dataClassName?: string;
  columnAlignClassName?: string;
  tooltip?: boolean;
  tooltipClass?: string;
  icon?: ReactNode;
  checkbox?: boolean;
  tableHeaderClassName?: string;
  render?: (row: any) => ReactNode;
  tooltipTriggerClassName?: string;
}

export interface SortConfig {
  key: string;
  direction: "DESC" | "ASC";
}

export interface ITableComponentProps {
  mainClassName?: string;
  tbodyClassName?: string;
  headingtitle?: string;
  headers: ITableHeader[];
  data: any[];
  onRowClick?: (data: any) => void;
  onSort?: (key: string, direction: "DESC" | "ASC") => void;
  className?: string;
  thClassName?: string;
  heightClassName?: string;
  scrollClassName?: string;
  loading?: boolean;
  defaultSort?: SortConfig | null;
  isPagingAllowed?: boolean;
  onViewMoreClick?: (e: React.MouseEvent) => void;
  pagination?: { page: number; limit: number };
  onPageChange?: any;
  onLimitChange?: any;
  totalRecords?: any;
  onSearch?: (e: string) => void;
  actions?: Actions[];
  selectedIds?: string[] | number[];
  onSelectionChange?: (selectedIds: string[]) => void;
  searchValue?: string;
  isMenuLoading?: boolean;
  loadingRowId?: string;
  currentPage?: number;
  totalTableRows?: number;
  // disableOnPremium?: boolean;
  onFilter?: (filters: Record<string, string>) => void;
  filterConfig?: FilterConfig[];
  filteredRecords?: number;
  configClassName?: string;
  onFilterSearch?: (filters: { [key: string]: string }) => void; // New prop
  showFilterSearchButton?: boolean; // Optional prop to show/hide search button
  filterSearchButtonText?: string;
}

export interface TooltipProps {
  trigger: React.ReactNode;
  tag?: React.ReactNode;
  card?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  clickToOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
}
export interface PaginationProps {
  //new interface
  itemsPerPage?: number;
  totalRecords: number;
  currentPage: number;
  onPageChange: (page: number | null, newOffset: number) => void;
  className?: string;
  offset: number;
  limit: number;
  isLoading?: boolean;
  onLimitChange?: (newLimit: number | null) => void;
}

export interface RowPerPageProps {
  value: string;
  onValueChange: (value: string) => void;
  rowLength: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  triggerClassName?: string;
  label?: string;
}

export interface FormTextareaProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  required?: boolean;
  className?: string;
  value: string;
  textClassName?: string;
  labelClassName?: string;
  placeholder?: string;
  pre?: string;
  error?: string;
  type?: string;
  name?: string;
}

export type Actions = {
  icon: ReactNode;
  label?: string;
  onClick?: (e: any, v: any) => void;
  condition?: (row: any) => boolean;
  action?: string;
  isDisabled?: (row: any) => boolean;
};

export interface ActionMenuProps {
  row: any;
  actions: Actions[];
  isLoading?: boolean;
  loadingRowId?: string;
  className?: string;
}
export interface GridActionMenuProps {
  actions: Actions[];
  className?: string;
  data: any[];
}

export interface LineChartProps {
  height: string | number;
  data: number[];
}

export interface IMenuProps {
  menuItems?: {
    icon?: React.ReactNode;
    label?: string;
    description?: string;
    time?: string;
    color?: string;
    status?: string;
    action?: string;
    disable?: boolean;
  }[];
  onChange?: (action: string) => void;
  title?: string;
  subtitle?: string;
  image?: string;
  className?: string;
  dropdownContentclass?: string;
  post?: React.ReactNode;
  menuType: string;
  notificationsCount?: number;
  username?: string;
  role?: string;
  icon?: React.ReactNode;
}

export interface MainLayoutProps {
  children: React.ReactNode;
}

export interface CheckBoxWithLabelProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  checkboxClassName?: string;
  labelText?: ReactNode;
  error?: string;
}

export interface FormRadioProps {
  label: string;
  value: string;
  className?: string;
  radioClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
}

export interface CustomLabelProps {
  title: string;
  className: string;
}

export interface IMessage {
  PackageDetailId: number;
  Title: string;
  Message: string;
}

export interface IPackageData {
  PackageId: string;
  Name: string;
  Duration: number;
  Cost: number;
  IsMonth: boolean;
  Messages: IMessage[];
}

export interface SettingPopoverProps {
  open: boolean;
  setOpen: (e: boolean) => void;
  items: {
    label: string;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  }[];
}

export interface ProfileAvatarProps {
  src: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  fallback?: string;
  avatarClassname?: string;
  avatarImgClassname?: string;
  avatarFallbackClassname?: string;
}

export interface ITabsProps {
  tabs: { tabName: string; tabPanel: React.ReactNode }[];
  selectedIndex: number;
  setSelectedIndex: (e: number) => void;
}

export interface OTPModalProps {
  open: boolean;
  setOpen?: (open: boolean) => void;
  onOTPVerified: (verified: boolean) => void;
}

export interface CustomSelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (e: string | number) => void;
  itemClassName?: string;
  triggerClassName?: string;
  labelClassName?: string;
  required?: boolean;
  className?: string;
  innerClassName?: string;
  subTitle?: string;
  error?: string;
  icon?: ReactNode;
  isDisabled?: boolean;
  placeholder?: string;
}

export interface MultiSelectProps {
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  itemClassName?: string;
  triggerClassName?: string;
  labelClassName?: string;
  required?: boolean;
  innerClassName?: string;
  subTitle?: string;
  error?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface StyledDataCellProps {
  createdOn: string;
  className?: string;
  dataAlignClassName?: string;
}
export interface Option {
  value: string | number | any;
  label: string;
}

export interface IFieldGeneratorProps {
  f: any;
  isDisabled?: boolean;
  onChange?: (e: any, value?: any) => void;
  setFieldValue?: (field: string, value: any) => void;
  onSelectChange?: (value: any) => void;
  form?: ReturnType<typeof useFormik>;
  dropzoneFiles?: { [key: string]: File[] };
  setDropzoneFiles?: React.Dispatch<
    React.SetStateAction<{ [key: string]: File[] }>
  >;
  filesCount?: (e: number) => void;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FieldConfig {
  multiple?: boolean;
  name: string;
  label?: string | React.ReactNode;
  isGroup?: boolean;
  className?: string;
  labelClassName?: string;
  inputClass?: string;
  innerClassName?: string;
  groupClassName?: string;
  triggerClassName?: string;
  inputClassName?: string;
  fieldArrayClassName?: string;
  fieldArrayFlexClassName?: string;
  readOnly?: boolean;
  type?:
    | "text"
    | "date"
    | "time"
    | "password"
    | "select"
    | "auto-complete"
    | "dropzone"
    | "color"
    | "accordion"
    | "number"
    | "wysiwyg"
    | "number";
  entity?:
    | "textarea"
    | "password"
    | "email"
    | "checkbox"
    | "radio"
    | "auto-complete"
    | "select"
    | "dropzone"
    | "accordion"
    | "date"
    | "time"
    | "switch"
    | "image-input"
    | "multi-select"
    | "field-array"
    | "wysiwyg"
    | "heading"
    | "sub-heading"
    | "map-input"
    | "time-input";
  minDate?: string;
  value?: any;
  error?: string;
  placeholder?: string;
  width?: string;
  size?: "large" | "medium" | "small";
  items?: SelectOption[];
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  isDisabled?: boolean;
  required?: boolean;
  customValidation?: Yup.Schema<any>;
  forgetPassword?: boolean;
  endDecorator?: React.ReactNode;
  startDecorator?: React.ReactNode;
  hint?: string;
  canDelete?: boolean;
  checkboxClassName?: string;
  canEdit?: boolean;
  components?: FieldConfig[];
  radioOptions?: { label: string; value: string }[];
  isAccordion?: boolean;
  isFlex?: boolean;
  flexClassName?: string;
  defaultOpen?: boolean;
  accordionClassName?: string;
  accordionTitle?: ReactNode | string;
  accordionId?: string;
  accordionTriggerClassName?: string;
  accordionContentClassName?: string;
  title?: string;
  subTitle?: string;
  titleClassName?: string;
  subTitleClassName?: string;
  uplaodIcon?: ReactNode;
  acceptedFiles?: string[];
  maxFileSizeMb?: number;
  fallBack?: string;
  avatarClassName?: string;
  rows?: number;
  switchClassName?: string;
  onChange?: (e: any, setFieldValue?: any) => void;
  arrayFields?: FieldConfig[];
  zoom?: number;
  latitude?: number;
  longitude?: number;
  minDateSource?: string;
  disableDate?: Date;
  pattern?: string;
  maxFiles?: number;
  placeName?: string;
  maxLength?: number;
}

export interface IFormGeneratorProps {
  fields: FieldConfig[];
  buttonText?: string;
  cancelButtontext?: string;
  formClassName?: string;
  style?: string;
  formID?: string;
  cancelButtonClassName?: string;
  onCancelClick?: (e: any) => void;
  refID?: React.Ref<any>;
  isDisabled?: boolean;
  isLoading?: boolean;
  onSubmit: (values: any) => void | Promise<void>;
  onChange?: (e: any, value?: any) => void;
  onSelectChange?: (value: any) => void;
  spacing?: number;
  marginBottom?: number;
  submitVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  submitClassName?: string;
  triggerClassName?: string;
  accordionClassName?: string;
  dropzoneFiles?: any; // Add dropzoneFiles prop
  setDropzoneFiles?: any;
  filesCount?: (e: number) => void;
}
export interface StyledDataCellProps {
  createdBy?: string;
  createdOn: string;
  className?: string;
}

export interface DonutChartProps {
  data: {
    [key: string]: {
      labels: string[];
      data: number[];
      backgroundColor: string[];
    };
  };
  className?: string;
}

export interface DoughnutChartProps {
  labels: string[];
  data: number[];
  backgroundColor: string[];
  className?: string;
}

export interface IconButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  icon: React.ReactNode;
  text?: string;
  tooltipContent?: React.ReactNode;
  tooltipSide?: "top" | "bottom" | "left" | "right";
  type?: "button" | "reset" | "submit";
}

export interface CustomTooltipProps {
  children: React.ReactNode;
  content?: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export interface FilterMenuProps {
  filterKey: string;
  label: string;
  items?: Option[];
  selected?: string;
  onSelect: (filterKey: string, item: string) => void;
  icon?: React.ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}

export interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  type?: "income" | "expense";
}

export interface VerticleChartProps {
  revenue: number[];
  expense: number[];
}

export interface SalesChartProps {
  data: {
    [year: string]: {
      revenueTotal: number;
      expenseTotal: number;
      revenueChange: number;
      expenseChange: number;
      revenue: number[];
      expense: number[];
    };
  };
}

export interface SingleDropzoneProps {
  onFileSelect: (files: File[] | null) => void;
  acceptedFiles?: string[];
  maxFileSizeMb?: number;
  multiple?: boolean;
  uploadIcon?: ReactNode;
  titleClassName?: string;
  subTitleClassName?: string;
  title?: string;
  subTitle?: string;
  files?: File[];
  setFiles?: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}

export interface Employee {
  id: string;
  name: string;
  designation?: string;
  assignedProjects: number;
  completedProjects: number;
  progress: number;
  isOnline?: boolean;
  image?: string;
  // productivity: number;
}

// interface FilterOption {
//   label: string;
//   value: string | number | any;
// }

export interface DataGridProps {
  data: any;
  filterConfig?: FilterConfig[];
  onItemSelect?: (itemIds: string[]) => void;
  // onItemEdit?: (item: any) => void;
  // onItemDelete?: (item: any) => void;
  onItemClick?: (item: any) => void;
  onFilter?: (filters: Record<string, string>) => void;
  title?: string;
  bulkActions?: Actions[];
  actions?: Actions[];
  cardType?: "employee" | "department";
}

export type IntervalKey = "MTD" | "Last30Days" | "Quarterly" | "Yearly" | "LastMonth";

export interface BarChartCardProps {
  title: string;
  intervals: readonly IntervalKey[];
  defaultInterval?: IntervalKey;
  data: Record<IntervalKey, ApexAxisChartSeries>;
  categories: Record<IntervalKey, string[]>;
  options?: ApexCharts.ApexOptions;
  height?: number;
  headerIcon?: React.ReactNode;
  className?: string;
}

export interface SimplePieChartCardProps {
  title: string;
  data: number[];
  labels: string[];
  options?: ApexOptions;
  height?: number;
  headerIcon?: React.ReactNode;
  className?: string;
  colors?: string[];
}

export interface TicketPriorityCardProps {
  priorities: {
    high: number;
    medium: number;
    low: number;
  };
  className?: string;
}

export interface BasicStatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  percentage?: number;
  isProfit?: boolean;
  chartData?: number[];
  chartColor?: string;
}

export interface IListingHeaderProps {
  heading?: string;
  subTitle?: string;
  handlePDFClick?: MouseEventHandler<HTMLButtonElement>;
  handleExcelClick?: MouseEventHandler<HTMLButtonElement>;
  handleRefreshClick?: MouseEventHandler<HTMLButtonElement>;
  handleHeaderActionButtonClick?: (e: string) => void;
  navbarToggle?: boolean;
  headerActionButtons?: {
    preIcon?: ReactNode;
    postIcon?: ReactNode;
    className?: string;
    buttonText: string;
    type?: "submit" | "reset" | "button";
    variant?:
      | "error"
      | "default"
      | "link"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "eyeIcon"
      | "addItem"
      | "confirmBtn"
      | "cancelBtn"
      | "textBtn"
      | "labelBtn";
    action: string;
  }[];
  isGridAllowed?: boolean;
  listView?: "list" | "grid" | "kanban";
  setListView?: (e: "list" | "grid" | "kanban") => void;
  isKanbanAllowed?: boolean;
  customViewToggleButtons?: {
    icon: React.ReactNode;
    tooltip: string;
    isActive?: boolean;
    onClick: () => void;
  }[];
  handleBackButtonWithHeading?: MouseEventHandler<HTMLButtonElement>;
}

export interface IListingTableProps extends ITableComponentProps {
  type?: "tabbed" | "default";
}

type IListingCard = {
  title?: string;
  subTitle?: string;
  cardClassName?: string;
  iconClassname?: string;
  icon?: ReactNode;
  percentage?: string | number;
};

export interface IListingCardsProps {
  cards: IListingCard[];
  mainClassName?: string;
}

export interface IExtendedPageListingProps
  extends IListingHeaderProps,
    IListingTableProps {}

export interface IPageListingProps
  extends DataGridProps,
    Omit<IExtendedPageListingProps, "actions" | "data"> {
  listingCards?: IListingCard[];
  listingCardsMainClass?: string;
  gridCardActions?: Actions[];
  gridBulkActions?: Actions[];
  onGridItemClick?: (e: any) => void;
  onGridActionSelect?: (e: any) => void;
  gridTitle?: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  items?: any[];
  type: "select" | "button" | "text" | "date" | "auto-complete";
  placeholder?: string; // For text and date inputs
}

export interface GridFilterProps {
  title?: string;
  selectedData: any[];
  filterConfig?: FilterConfig[];
  selectedFilters: Record<string, any>;
  onFilterSelect: (key: string, value: any) => void;
  actions?: Actions[];
}

export type TableContent = {
  table: true;
  col: string[];
  vertical?: boolean;
  cardType?: string;
  data: (string | number)[] | { [key: string]: string | number }[];
};

export type TextContent = {
  table: false;
  text: string;
};

export type AccordionContent = TableContent | TextContent;

export interface AccordionPropData {
  header: string;
  formId: string;
  fields: FieldConfig[]; // Your form field config
  content: AccordionContent;
}

export interface InfoField {
  label: string;
  icon: string;
  value: string | number;
  imageUrl?: string; // optional — only needed when you want to show image+value
}

export interface EmployeeInfoCardProps {
  title?: string;
  fields: InfoField[];
  onEditClick?: () => void;
  formId?: USerFormKey;
}

export const DialogKeys = {
  ABOUT: "about",
  BANK: "bank",
  FAMILY: "family",
  EDUCATION: "education",
  EXPERIENCE: "experience",
} as const;

export type DialogKey = (typeof DialogKeys)[keyof typeof DialogKeys];

export const USerFormKeys = {
  ABOUT: "about",
  PERSONAL: "personal",
  EMERGENCY: "emergency",
} as const;

export type USerFormKey = (typeof USerFormKeys)[keyof typeof USerFormKeys];

export interface NotificationModalProps {
  open: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  closeButton?: string;
  className?: string;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string | React.ReactNode;
  cancelButtonText?: string;
  confirmButtonText?: string;
  cancelButtonsize?: "default" | "icon" | "sm" | "lg";
  confirmButtonsize?: "default" | "icon" | "sm" | "lg";
  cancelButtonvariant?:
    | "error"
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "eyeIcon"
    | "addItem"
    | "confirmBtn"
    | "cancelBtn"
    | "textBtn"
    | "labelBtn";
  confirmButtonvariant?:
    | "error"
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "eyeIcon"
    | "addItem"
    | "confirmBtn"
    | "cancelBtn"
    | "textBtn"
    | "labelBtn";
  cancelButtoncolor?: "brand" | "gray" | "success" | "error";
  confirmButtoncolor?: "brand" | "gray" | "success" | "error";
  onConfirmClick?: () => void;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
  subTitleClassName?: string;
  titleClassName?: string;
  dialogClassName?: string;
  confirmButtonLoading?: boolean;
}

export interface IGridEmployeeCard {
  employee: Employee;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onClick: () => void;
  actions?: Actions[];
}

export interface IGridDepartmentCard {
  department: any;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onClick: () => void;
  actions?: Actions[];
}

export interface IFormModalProps {
  isLoading?: boolean;
  open: boolean;
  header: string;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  fields?: any;
  formId?: string;
  handleSubmitData: (e: any) => void;
  modalClassName?: string;
  formClassName?: string;
  submitButtonText?: string;
  handleCloseModal?: () => void;
  customComponent?: React.ReactNode; // 👈 Add this line
  enablefooterButtons?: boolean;
  headerClassName?: string;
  footerClassName?: string;
}

export type AssetCardProps = {
  image: string;
  title: string;
  code: string;
  assignedDateTime: string;
  assignedByImage: string;
  assignedByName: string;
};

export interface AlertProps {
  icon: string;
  iconColor: string;
  bgColor: string;
  children: React.ReactNode;
}

export type TimeRange = "Today" | "Weekly" | "Monthly";

export interface ProductItem {
  id: string;
  image: string;
  name: string;
  price?: string;
  sales?: string;
  category?: string;
  stock?: number;
  status?: "Processing" | "Cancelled" | "Onhold" | "Completed";
  date?: string;
  changePercentage?: number;
}

export interface ProductCardProps {
  title: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  products: ProductItem[];
  timeRanges?: readonly TimeRange[];
  defaultTimeRange?: TimeRange;
  showTimeRange?: boolean;
  showViewAll?: boolean;
  viewAllLink?: string;
  className?: string;
  showId?: boolean;
}

export interface InvoiceCardProps {
  amount: string;
  title: string;
  profit: number;
  isProfit: boolean;
  iconName: string;
  bgColor: string;
  textColor: string;
}

export type TabConfig = {
  key: string;
  label: string;
  render: () => ReactNode;
};

export interface CardWithTabsProps {
  tabs: TabConfig[];
  defaultTabKey?: string;
  className?: string;
}

export interface SidedrawerProps {
  triggerText?: string;
  content?: ReactNode;
  bgColor?: string; // Tailwind class e.g., "bg-white" or "bg-gray-100"
  direction?: "top" | "bottom" | "left" | "right";
}

export interface SalesCardProps {
  cardTitle: string;
  amount: string; // Or number, depending on your data
  // isProfit: boolean;
  // chnagePercentage: number;
  iconName?: string;
  bgColor?: string;
  textColor?: string;
  iconBgColor?: string;
  chartColor?: string;
  chartData?: number[];
}

export interface Project {
  id: number;
  title: string;
  tasks: number;
  completed: number;
  deadline: string;
  leadName: string;
  leadImage: string;
  icon: string;
  link: string;
}

export interface ProjectCardProps {
  projects: Project[];
}

export interface FileManagerCardProps {
  title: string;
  icon: string;
  fileCount: number;
  storageUsed: string;
  progressPercent: number;
  progressColor?: string;
}

export const titleMap: Record<USerFormKey, string> = {
  about: "About",
  personal: "Personal Information",
  emergency: "Emergency Contact",
};

export type HeatmapChartProps = {
  data: {
    [key: string]: {
      name: string;
      data: number[];
    }[];
  };
};

export interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconColor?: string;
}

export interface StatItemProps {
  label: string;
  value: string;
  badge: string;
  color: string;
}

export type ChartIntervals = "Today" | "Weekly" | "Monthly";

export interface OverviewCardProps {
  suppliers: number;
  customers: number;
  orders: number;
  firstTime: number;
  returnCount: number;
  firstTimePercent: string;
  returnPercent: string;
  className?: string;
  intervals: readonly ChartIntervals[];
  title?: string;
}

export interface AccordionCardsProps {
  // formId: keyof typeof accordionPropData;
  accordionId: string;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onActionButtonClick?: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
  data?: any;
}

export interface ProfileData {
  name: string;
  imageUrl: string;
  role: string;
  experience: string;
  teamInfo: InfoField[];
}

export interface UserFormProps {
  fields: any;
  formId: string;
  handleSubmitData: (e: any) => void;
}

export interface ContactInfo {
  name: string;
  relation: string;
  phone: string;
  type: "Primary" | "Secondary";
}

export interface EmergencyContactProps {
  contacts: ContactInfo[];
}

export interface AssetDataModalProps {
  image: string;
  title: string;
  code: string;
  assignedDateTime: string;
  brand: string;
  category: string;
  cost: string;
  serialNo: string;
  vendor: string;
  location: string;
  warranty: string;
  images: string[];
}

export interface GeneralDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface DeleteModalProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  title: string;
  description: string;
  icon?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  modalClassName?: string;
}

export interface ITextAreaProps
  extends Omit<
    IInputProps,
    | "type"
    | "pre"
    | "post"
    | "minLength"
    | "inputType"
    | "onSearch"
    | "btnClassName"
    | "onButtonClick"
    | "buttonDisabled"
  > {
  rows?: number;
}

export interface IImageInputProps extends Omit<IInputProps, "onChange"> {
  onChange?: (name: string, value: File | null) => void;
  maxFileSize?: number;
  fallBack?: string;
  avatarClassName?: string;
}

export interface IProgressData {
  startHour: number;
  durationMinutes: number;
  type: "idle" | "productive" | "break" | "overtime";
}

export type ExtendedOption = Option & {
  className?: string;
};

export interface VenueInfoCardProps {
  name: string;
  location: string;
  imageUrl: string;
  capacity: string;
  venueType: string;
  parking: string;
  wifi: string;
  catering: string;
  description: string;
}

interface AttendanceStat {
  label: string;
  count: number;
  trendPercent: number; // use negative for down, positive for up
}

export interface AttendanceOverviewProps {
  heading: string;
  subheading: string;
  stats: AttendanceStat[];
  absentAvatars: {
    src: string;
    fallback: string;
  }[];
}

export interface PaymentSummaryCardProps {
  title: string;
  amount: string;
  color: string;
  icon: string;
}

// export interface SimpleAccordionProps {
//   title?: string;
//   children?: React.ReactNode;
//   defaultOpen?: boolean;
// }

export interface VenueInfo {
  Info: {
    Name: string;
    Description: string;
    Included: string;
    Phone: string;
    Rating: string;
    OwnerName: string;
  };
  VenueLocation: {
    LocationId: string;
    Lat: number;
    Long: number;
    Address: string;
    LocationName: string;
  };
}

export interface PolicyCardProps {
  bookingPolicy: string;
  cancellationPolicy: string;
}

interface AccordionItemType {
  id: string; // Added id to uniquely identify each item
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

export interface SimpleAccordionProps {
  items: AccordionItemType[];
  defaultOpenId?: string; // Prop to specify which item to open by default
  triggerClassName?: string;
}

export interface MapsCoordinatesProps {
  lat: number;
  lng: number;
  zoom?: number;
  mainClassName?: string;
}

export type LoaderProps = {
  isLoading: boolean;
};

export interface MapInputProps {
  latitude: number;
  longitude: number;
  zoom: number;
  mapClassName?: string;
  className?: string;
  onPositionChange: (latitude: number, longitude: number) => void;
  label?: string;
  labelClassName?: string;
  required?: boolean;
  subTitle?: string;
  error?: string;
}

export interface BadgeProps {
  variant:
    | "text"
    | "id"
    | "purchase"
    | "icon"
    | "active"
    | "inactive"
    | "paid"
    | "trial"
    | "unpaid"
    | "success"
    | "refunded"
    | "cancelled"
    | "pending"
    | "deleted"
    | "product-item";
  value?: number | string | boolean;
  className?: string;
  icon?: React.ReactNode;
}

export interface MarkdownTextRendererProps {
  text: string;
  highlight?: string; // Optional prop to highlight search terms
}

export interface MapModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  lat: number;
  lng: number;
  header: string;
  modalClassName?: string;
}

export interface EntityStatusConfirmationDialogProps {
  actionState: ActionState;
  setActionState: React.Dispatch<
    SetStateAction<{
      type:
        | ""
        | "Active"
        | "Refund"
        | "Edit"
        | "InActive"
        | "Delete"
        | "Trending"
        | "UnmarkTrending"
        | "FullBooked"
        | "Available";
      id: string;
      open: boolean;
    }>
  >;
  warningIcon?: ReactNode;
  warningTitle: string;
  warningDialogClassName?: string;
  handleWarningAction: (
    type:
      | ""
      | "Active"
      | "Refund"
      | "Edit"
      | "InActive"
      | "Delete"
      | "Trending"
      | "UnmarkTrending"
      | "FullBooked"
      | "Available",
    id: string | number
  ) => void;
  warningConfirmButtonText?: string;
  warningCancelButtonText?: string;
  warningConfirmButtonLoading?: boolean;
  warningCancelButtonClassName?: string;
  warningSubTitle?: string;
  successState: { open: boolean; message: string };
  successTitle?: string;
  setSuccess: React.Dispatch<
    SetStateAction<{ open: boolean; message: string }>
  >;
  successDialogClassName?: string;
  successIcon?: ReactNode;
  apiError?: string;
  apiErrorTitle?: string;
  setApiError: React.Dispatch<SetStateAction<string>>;
  apiErrorIcon?: ReactNode;
}

export interface ActionState {
  type:
    | ""
    | "Active"
    | "Refund"
    | "Edit"
    | "InActive"
    | "Delete"
    | "Trending"
    | "UnmarkTrending"
    | "FullBooked"
    | "Available";
  id: string | number;
  open: boolean;
}

export interface ActionConfig {
  entityType: string; // e.g., "pvt/amenity"
  successMessages: Record<string, string>; // e.g., { Active: "Amenity activated successfully." }
  apiActionMap: Record<
    string,
    {
      mutation: string;
      body?: any;
    }
  >; // Maps action types to API mutation and payload
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  [key: string]: any;
}

export interface CalendarConfig {
  // Calendar view settings
  initialView?: "dayGridMonth" | "dayGridWeek" | "dayGridDay";
  headerToolbar?: {
    left?: string;
    center?: string;
    right?: string;
  };
  height?: string | number;
  eventBackgroundColor?: string;
  eventBorderColor?: string;
  eventTextColor?: string;
  // Event handling
  onDateClick?: (selectInfo: any) => void;
  onEventClick?: (clickInfo: any) => void;
  // Additional FullCalendar options
  [key: string]: any;
}

export interface ICalendarViewProps {
  events: CalendarEvent[];
  config: CalendarConfig;
  className?: string;
}

export interface CalendarSidebarConfig {
  showCurrentEvents?: boolean;
  showDatePicker?: boolean;
  showQuickActions?: boolean;
  showUpcomingEvents?: boolean;
  showStats?: boolean;
  customSections?: CalendarSidebarSection[];
}
export interface CalendarSidebarSection {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}
export interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export interface CalendarStats {
  total: number;
  upcoming: number;
  custom?: Array<{
    label: string;
    value: number | string;
    color?: string;
  }>;
}

export interface ICalendarSidebarProps {
  config: CalendarSidebarConfig;
  selectedDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
  quickActions?: QuickAction[];
  upcomingEvents?: any[];
  CurrentEvents?: any[];
  stats?: CalendarStats;
  formatDateTime?: (dateStr: string) => string;
  sidebarClassName?: string;
  onEdit?: (timeSlot: any) => void;
  onDelete?: (timeSlotId: number) => void;
}

export interface IPageCalendarProps {
  // Calendar props
  events: CalendarEvent[];
  calendarConfig?: CalendarConfig;

  // Sidebar props
  sidebarConfig?: CalendarSidebarConfig;
  quickActions?: QuickAction[];
  currentEvents?: any[];
  upcomingEvents?: any[];
  stats?: CalendarStats;

  // Layout
  className?: string;
  sidebarClassName?: string;
  calendarClassName?: string;

  // Callbacks
  onDateChange?: (date: Date | undefined) => void;
  formatDateTime?: (dateStr: string) => string;
  onEdit?: (timeSlot: any) => void;
  onDelete?: (timeSlotId: number) => void;
}

export interface SwitchButtonProps {
  onChange: (checked: boolean) => void;
  className?: string;
  circleClassName?: string;
  check?: boolean;
}

export interface EntityCardProps {
  className?: string;
  featureTitle?: string;
  editClick?: (id: number | string) => void;
  delClick?: (id: number | string) => void;
  onChange: (id: number | string, newValue: boolean) => void;
  check: boolean;
  id: number | string;
  isDeleteDisabled?: boolean;
}

export interface sourceCardProps {
  className?: string;
  featureTitle?: string;
  editClick?: (id: number | string) => void;
  delClick?: (id: number | string) => void;
  onChange: (id: number | string, newValue: boolean) => void;
  check: boolean;
  id: number | string;
}

export interface statusCardProps {
  className?: string;
  featureTitle?: string;
  editClick?: (id: number | string) => void;
  delClick?: (id: number | string) => void;
  onChange: (id: number | string, newValue: boolean) => void;
  check: boolean;
  id: number | string;
}

export interface categoryCardProps {
  className?: string;
  featureTitle?: string;
  editClick?: (id: number | string) => void;
  delClick?: (id: number | string) => void;
  onChange: (id: number | string, newValue: boolean) => void;
  check: boolean;
  id: number | string;
}

export interface UserChat {
  TicketId: number;
  Subject: string;
  Name: string;
  Email: string;
  IsRead: boolean;
  LastMessageOn: string;
  LastMessage: string;
  UnreadMessages: number;
  CreatedBy: string;
}

export interface MessageBoxHeaderProps {
  ticketId: string | null;
  name: string | null;
  email: string | null;
}

interface HeaderButton {
  preIcon?: React.ReactNode;
  buttonText: string;
  action: string;
  className?: string;
}

interface CardAction {
  type: "edit" | "delete" | "toggle";
  label?: string;
}

export interface DataGridListingProps {
  heading: string;
  subTitle: string;
  headerButtons?: HeaderButton[];
  onHeaderButtonClick: (action: string, data?: any) => void;
  data: any[];
  loading?: boolean;
  totalCount?: number;
  renderCard: (item: any) => React.ReactNode;
  cardActions?: CardAction[];
  onCardAction?: (action: string, id: any) => void;
  filterConfig?: FilterConfig[];
  onFilter?: (filters: Record<string, string>) => void;
  showMoreEnabled?: boolean;
  onShowMore?: () => void;
  gridCols?: string;
  containerClassName?: string;
  cardClassName?: string;
}

export interface EntityFormModalProps {
  // Basic Configuration
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // API Configuration
  apiType: string; // "pvt/tags", "pvt/categories" etc
  entityId?: string; // For edit mode

  // Form Configuration
  formFields: FieldConfig[]; // Fields array
  formId: string; // Unique form ID

  // Labels
  entityName: string; // "Tag", "Category", "Account" etc
  successEntityName?: string; // "Sub Category"
  modalTitle?: {
    create?: string; // Custom create title
    edit?: string; // Custom edit title
  };

  // Success/Error Messages
  successMessages?: {
    create?: string;
    update?: string;
  };

  // Callbacks
  onSuccess?: () => void; // Success ke baad callback
  onClose?: () => void; // Modal close callback

  // Transform data before submit (optional)
  transformSubmitData?: (values: any) => any;

  // Modal Styling (optional)
  modalClassName?: string;
  headerClassName?: string;
  footerClassName?: string;

  // Navigation (optional)
  navigateOnClose?: boolean; // Default: true
  navigateTo?: string; // Default: -1 (go back)
}
