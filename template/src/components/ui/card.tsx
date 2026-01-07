import * as React from "react";

import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";
import { ActionMenu, GridActionMenu } from "./common";
import { Button } from "./button";
import {
  AccordionCardsProps,
  Actions,
  AssetDataModalProps,
  AttendanceOverviewProps,
  CardWithTabsProps,
  ChartIntervals,
  EntityCardProps,
  FileManagerCardProps,
  GridFilterProps,
  IGridEmployeeCard,
  InfoItemProps,
  InvoiceCardProps,
  IProgressData,
  Option,
  OverviewCardProps,
  PaymentSummaryCardProps,
  ProductCardProps,
  ProjectCardProps,
  SalesCardProps,
  StatItemProps,
  StatsCardProps,
  sourceCardProps,
  statusCardProps,
  TimeRange,
  categoryCardProps,
  TicketPriorityCardProps,
  BasicStatCardProps,
} from "../types";
import { IGridDepartmentCard } from "../types";
import { getDesignationBadgeColor, getProductivityColor, truncateText } from "@/helper/funcs";
import Badge from "./badge";
import { Dropdown, DropdownItem } from "./dropdown";
import { ArrowDownLeft, ArrowUpLeft, CalendarIcon, Info, Pencil, ShoppingCart, UserCheck, Users } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Trash2, RotateCw, FolderOpen } from "lucide-react";
import { FilterMenu } from "./dropdown-menu";
import ApexCharts from "react-apexcharts";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { AvatarGroup, ProfileAvatar } from "./avatar";
import { Link } from "react-router-dom";
import L from "leaflet";
// import "leaflet/dist/leaflet.css";
import ReactApexChart from "react-apexcharts";
import { SwitchButton } from "./switch";
import { CustomTooltip } from "./tooltip";
import { ProgressBar } from "./miscellaneous";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card" className={cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-border-gray border py-6 shadow-sm font-nunito", className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("leading-none font-semibold", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center px-6 [.border-t]:pt-6", className)} {...props} />;
}

const EmployeeCard = ({ employee, isSelected, onSelect, onClick, actions }: IGridEmployeeCard) => {
  const productivityColors = getProductivityColor(employee.completedProjects / employee.assignedProjects);
  const badgeColor = getDesignationBadgeColor(employee?.designation ?? "Unknown");

  return (
    <Card className="p-5 bg-white">
      <CardContent className="px-0">
        <div className="grid items-start grid-cols-4 gap-1">
          <div className="">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked: boolean) => onSelect(checked)}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 rounded mt-1 shadow-none border-[#E5E7EB]"
            />
          </div>
          <div className="col-span-2 relative flex items-center justify-center text-center">
            <div onClick={onClick} className="relative w-15 h-15  rounded-full border-2 border-blue-500 p-1 hover:border-blue-600 transition-colors">
              <ProfileAvatar fallback={employee.name[0]} src={employee.image ?? ""} avatarClassname="w-full h-full" />
              {employee.isOnline && <div className="absolute bottom-0 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
            </div>
          </div>
          <div className="col-span-1 text-right">
            <ActionMenu row={employee} actions={actions ?? []} className="border-none shadow-none p-4" />
          </div>
        </div>

        <div className="text-center mb-4">
          <h3 className="font-semibold text-gray-900">
            <Button variant={"link"} onClick={onClick} className="hover:text-blue-600 transition-colors">
              {employee.name}
            </Button>
          </h3>
          <span className={`inline-block px-2 py-1 rounded-lg text-xsm font-medium ${badgeColor}`}>{employee.designation}</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-2">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Projects</div>
            <div className="font-semibold text-gray-900">{employee.assignedProjects}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Done</div>
            <div className="font-semibold text-gray-900">{employee.completedProjects}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Progress</div>
            <div className="font-semibold text-gray-900">{Math.round(employee.completedProjects / employee.completedProjects)}%</div>
          </div>
        </div>

        <div className="text-center mb-2">
          <span className="text-sm text-gray-600">
            Productivity: <span className={`font-semibold ${productivityColors.text}`}>{Math.round(employee.completedProjects / employee.completedProjects)}%</span>
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-1.25">
          <div
            className={`${productivityColors.bg} h-1.25 rounded-full transition-all duration-300`}
            style={{
              width: `${Math.round(employee.completedProjects / employee.completedProjects)}%`,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export interface ICandidateKanbanCardProps {
  handleProfileClick: (e: string | number) => void;
  actions?: Actions[];
  item?: any;
}

const CandidateKanbanCard: React.FC<ICandidateKanbanCardProps> = ({ handleProfileClick, actions, item }) => {
  return (
    <div className="flex flex-col items-center bg-white rounded-sm border border-border-gray shadow-[0px_1px_1px_1px_rgba(198,198,198,0.2)] p-5">
      <div className="border border-transparent w-full border-b-border-gray pb-4 mb-4 flex items-center justify-between">
        <Badge variant="id" value={item?.id} className="px-2 py-0.5 font-extrabold border-transparent rounded-sm text-xsm" />
        {actions && <ActionMenu actions={actions} row={item} />}
      </div>
      <div className="w-full">
        <div className="flex items-center space-x-4 mb-4">
          <ProfileAvatar
            src={item.src}
            onClick={() => handleProfileClick && handleProfileClick(item)}
            // avatarImgClassname="h-11 w-11 !rounded-sm"
            avatarFallbackClassname=" bg-gray-200"
            avatarClassname="!h-11 !w-11 !rounded-sm bg-gray-200"
            fallback={item.name[0].toUpperCase()}
          />
          <div>
            <Button variant={"textBtn"} className="text-text-primary font-bold hover:text-primary leading-5">
              {item.name}
            </Button>
            <h5 className="text-text-secondary text-sm">{item.email}</h5>
          </div>
        </div>
        {item.attributes &&
          item.attributes.map((item: Option, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-2">
              <h1 className="text-text-secondary text-md ">{item.label}</h1>
              {/* <div className="h-9 border border-border-gray mx-2" /> */}
              <h1 className="text-text-primary text-md font-bold ">{item.value}</h1>
            </div>
          ))}
      </div>
    </div>
  );
};

export const AssetDataCard = ({ image, title, code, assignedDateTime, brand, category, cost, serialNo, vendor, location, warranty, images }: AssetDataModalProps) => {
  return (
    <div className="px-4 py-4 space-y-6">
      {/* Top Card */}
      <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-4">
        <img src={image} alt={title} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex flex-col">
          <p className="text-base font-semibold text-primary">
            {title} - #{code}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="text-red-500 font-semibold">AST - {code}</span> • Assigned on {assignedDateTime}
          </p>
        </div>
      </div>

      {/* Grid Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        <div>
          <p className="text-sm text-gray-500">Type</p>
          <p className="text-base text-gray-800">{title}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Brand</p>
          <p className="text-base text-gray-800">{brand}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Category</p>
          <p className="text-base text-gray-800">{category}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Serial No</p>
          <p className="text-base text-gray-800">{serialNo}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Cost</p>
          <p className="text-base text-gray-800">{cost}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Vendor</p>
          <p className="text-base text-gray-800">{vendor}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Warranty</p>
          <p className="text-base text-gray-800">{warranty}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Location</p>
          <p className="text-base text-gray-800">{location}</p>
        </div>
      </div>

      {/* Images */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Asset Images</p>
        <div className="flex gap-3">
          {images.map((img, index) => (
            <img key={index} src={img} alt={`Asset image ${index + 1}`} className="w-16 h-16 object-cover rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  icon,
  iconBgColor,
  products,
  timeRanges = ["Today", "Weekly", "Monthly"],
  defaultTimeRange = "Today",
  showTimeRange = true,
  showViewAll = false,
  viewAllLink = "#",
  className,
  showId = false,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<TimeRange>(defaultTimeRange);
  return (
    <Card className={cn("rounded-sm border-0 shadow-regular flex-1 font-nunito", className)}>
      <CardHeader className="px-4 flex justify-between items-center flex-wrap gap-3 border-b border-gray-200">
        <div className="inline-flex items-center">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center me-1" style={{ background: iconBgColor }}>
            <span className="title-icon">{icon}</span>
          </div>
          <h5 className="card-title mb-0 font-bold">{title}</h5>
        </div>

        {showTimeRange && (
          <Dropdown
            triggerText={selectedTimeRange}
            triggerLeftIcon={<CalendarIcon className="size-2.5" />}
            triggerClassName="h-[27px] w-[90px] gap-0 text-[12px] border-border-gray hover:bg-primary-300 hover:text-white hover:transition-all duration-500 "
            className="w-[90px]"
          >
            {timeRanges.map((range) => (
              <DropdownItem key={range} onClick={() => setSelectedTimeRange(range as TimeRange)} className="text-[12px] hover:bg-primary-200 hover:text-primary-300">
                {range}
              </DropdownItem>
            ))}
          </Dropdown>
        )}

        {showViewAll && (
          <a href={viewAllLink} className="underline text-sm hover:text-primary-300 transition-colors duration-500">
            View All
          </a>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-4 p-4">
          {products.map((product, index) => (
            <div key={product.id} className={`flex items-center justify-between ${index !== products.length - 1 ? "border-b border-gray-200 pb-4" : ""}`}>
              <div className="flex items-center">
                <a href="#" className="avatar avatar-lg">
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
                </a>
                <div className="ms-3">
                  <h6 className="font-semibold mb-1">
                    <a href="#">{product.name}</a>
                  </h6>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {product.price && <p>${product.price}</p>}
                    {product.sales && (
                      <p>
                        <i className="ti ti-circle-filled text-xsm text-primary-300 me-1"></i>
                        {product.sales}+ Sales
                      </p>
                    )}
                    {showId && <p>ID: #{product.id}</p>}
                    {product.category && (
                      <p>
                        <i className="ti ti-circle-filled text-xsm text-primary-300 me-1"></i>
                        {product.category}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {product.stock !== undefined && (
                <div className="flex flex-col items-end">
                  <span className="text-sm">Instock</span>
                  <h6 className="text-orange-500 font-medium">{product.stock}</h6>
                </div>
              )}

              {product.changePercentage !== undefined && (
                <span className={`badge ${product.changePercentage >= 0 ? "bg-outline-success" : "bg-outline-danger"} badge-xs inline-flex items-center`}>
                  {product.changePercentage >= 0 ? (
                    <span className="inline-flex items-center text-xs bg-green-100 text-green-600 px-2 py-1 rounded-md">
                      <ArrowUpLeft className="w-3 h-3 mr-1" />
                      {product.changePercentage}%
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs bg-green-100 text-green-600 px-2 py-1 rounded-md">
                      <ArrowDownLeft className="w-3 h-3 mr-1" />
                      {product.changePercentage}%
                    </span>
                  )}
                </span>
              )}

              {product.date && (
                <div className="text-end">
                  <p className="text-sm mb-1">{product.date}</p>
                  {product.status && (
                    <span
                      className={`${
                        product.status === "Processing" ? "bg-primary-300" : product.status === "Cancelled" ? "bg-red-400" : product.status === "Onhold" ? "bg-blue-400" : "bg-green-500"
                      } px-2 py-1 rounded-md text-white inline-flex items-center text-xsm font-medium`}
                    >
                      <span className="w-1 h-1 rounded-full bg-white mr-1"></span>
                      {product.status}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const InVoiceCard = ({ amount, title, profit, isProfit, iconName, bgColor, textColor }: InvoiceCardProps) => {
  return (
    <Card className="bg-white rounded-xl shadow-sm gap-3 p-5 w-full border border-gray-200 font-nunito">
      {/* Top Section */}
      <div className="flex items-start justify-between  pb-4 border-b border-gray-200">
        <div>
          <CardTitle className="text-[20px] font-semibold text-gray-900 leading-tight">{amount}</CardTitle>
          <CardContent className="text-sm text-gray-500 p-0 mt-1">{title}</CardContent>
        </div>

        <div className={`${bgColor} ${textColor} p-2 rounded-md`}>
          <i className={`${iconName} text-[22px] `} />
        </div>
      </div>

      {/* Bottom Section */}
      <CardFooter className="flex items-center justify-between text-sm p-0">
        <p className="text-gray-600">
          <span className={`font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>{isProfit ? `+${profit}%` : `-${profit}%`}</span> vs Last Month
        </p>
        <a className="text-[#212B36]  underline font-medium">View All</a>
      </CardFooter>
    </Card>
  );
};

const CardWithTabs = ({ tabs, defaultTabKey, className = "" }: CardWithTabsProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultTabKey || tabs[0].key);

  return (
    <div className={`${className}`}>
      {/* Tabs Header */}
      <div className="p-4">
        <ul className="flex space-x-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <li key={tab.key}>
              <button
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 text-sm font-medium ${activeTab === tab.key ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-primary"}`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="p-4">{tabs.find((tab) => tab.key === activeTab)?.render()}</div>
    </div>
  );
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change }) => {
  const isPositive = change >= 0;

  return (
    <div className="border border-border-gray rounded-lg p-2 flex items-start gap-2">
      <div>
        <p className={cn("text-normal leading-sm font-bold font-nunito", isPositive ? "text-green-500" : "text-red-500")}>${value.toLocaleString()}</p>
        <span className="text-md leading-sm font-nunito text-text-secondary">{title}</span>
      </div>
      <span className={cn("rounded-lg !text-white text-xsm px-1.5 block", isPositive ? "bg-green-500" : "bg-red-500")}>
        {isPositive ? <i className="ti ti-arrow-up-left"></i> : <i className="ti ti-arrow-down-right"></i>} {Math.abs(change)}%
      </span>
    </div>
  );
};

const SalesCard = ({ cardTitle, amount, iconName, bgColor, textColor, iconBgColor, chartData, chartColor }: SalesCardProps) => {
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      sparkline: { enabled: true },
      toolbar: { show: false },
      zoom: { enabled: false },
      dropShadow: {
        enabled: false,
        top: 3,
        left: 14,
        blur: 4,
        opacity: 0.12,
        color: "#fff",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    stroke: {
      show: true,
      width: 2.5,
      curve: "smooth",
    },
    markers: {
      size: 0,
      colors: [chartColor || "#000"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    colors: [chartColor],
  };

  const series = [
    {
      name: "Info",
      data: chartData ?? [],
    },
  ];

  return (
    <>
      <Card className={`${bgColor} text-black bg-white rounded-xl gap-3 shadow-none flex items-center justify-between p-4 flex-row w-full`}>
        <div className="flex items-center gap-3">
          <div className={`text-white ${textColor} ${iconBgColor} rounded-lg py-3 px-4`}>
            <i className={`${iconName} text-lg`} />
          </div>
          {/* Content */}
          <div className="">
            <CardTitle className="text-gray-500 text-sm mb-1">{cardTitle}</CardTitle>
            <CardDescription className="text-black text-normal font-bold">{amount}</CardDescription>
          </div>
        </div>

        {/* Chart positioned at the right */}
        {chartData && chartData.length > 0 && (
          <div className="flex-shrink-0">
            <ReactApexChart options={chartOptions} series={series} type="area" height={40} width={70} />
          </div>
        )}
      </Card>
    </>
  );
};

const Projectcard: React.FC<ProjectCardProps> = ({ projects }) => {
  return (
    <div className="flex flex-wrap -mx-2">
      {projects.map((project) => (
        <div key={project.id} className="w-full md:w-1/2 px-2 mb-4">
          <div className="bg-white rounded shadow-sm flex-1">
            <div className="p-4 ">
              {/* Header */}
              <div className="flex items-center pb-3 mb-3 border-b border-gray-200">
                <Link to={project.link} className="flex-shrink-0 mr-3">
                  <img src={project.icon} alt="Project Icon" className="w-12 h-12" />
                </Link>
                <div>
                  <h6 className="mb-1 text-base font-semibold text-gray-800 hover:text-primary transition-colors duration-300 delay-100">
                    <Link to={project.link}>{project.title}</Link>
                  </h6>
                  <div className="flex items-center text-xs text-gray-600">
                    <p className="mb-0">{project.tasks} tasks</p>
                    <p className="ml-3 flex items-center">
                      <span className="mx-1">
                        <i className="ti ti-point-filled text-primary" />
                      </span>
                      {project.completed} Completed
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Deadline</span>
                  <p className="text-sm text-gray-800">{project.deadline}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Project Lead</span>
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <img src={project.leadImage} alt="Lead" className="w-6 h-6 rounded-full mr-2" />
                    {project.leadName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FileManagerCard: React.FC<FileManagerCardProps> = ({ title, icon, fileCount, storageUsed, progressPercent, progressColor = "bg-blue-500" }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 font-nunito">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <img src={icon} alt={title} className="w-6 h-6" />
          <h2 className="text-base font-nunito font-bold text-gray-800">{title}</h2>
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button className="text-gray-400 hover:text-gray-600 bg-white border border-gray-100 ">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="min-w-[160px] bg-white border border-gray-200 rounded-md shadow-lg p-1 z-50" sideOffset={5}>
              <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                <FolderOpen size={16} />
                Open
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                <Trash2 size={16} />
                Delete All
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                <RotateCw size={16} />
                Reset
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="w-full h-[5px] bg-gray-400 rounded-full overflow-hidden">
        <div className={`h-full  rounded-md ${progressColor}`} style={{ width: `${progressPercent}%` }}></div>
      </div>

      <div className="flex justify-between  text-gray-500 font-medium">
        <span className="text-sm ">{fileCount} Files</span>
        <span className="text-sm">{storageUsed}</span>
      </div>
    </div>
  );
};

const AccordionCards = ({ accordionId, data, onActionButtonClick, icon }: AccordionCardsProps) => {
  const renderContent = () => {
    if (data?.content?.table) {
      // Special experience card layout
      if (data.content.cardType === "experience-card") {
        return (
          <div className="space-y-5">
            {data.content.data.map((item: { institute: string; position: string; years: string }, idx: number) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm text-text-primary">{item.institute}</p>
                  <p className="inline-flex items-center gap-2 mt-1">
                    <span className="bg-gray-100 text-xs text-primary-600 px-2 py-1 rounded-md">• {item.position}</span>
                  </p>
                </div>
                <p className="text-sm text-text-primary whitespace-nowrap">{item.years}</p>
              </div>
            ))}
          </div>
        );
      }

      // Default vertical layout
      if (data.content.vertical) {
        return (
          <div className="space-y-4">
            {data.content.data.map((item: { institute: string; degree: string; years: string }, idx: number) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-text-secondary">{item.institute}</p>
                  <p className="font-bold text-base">{item.degree}</p>
                </div>
                <p className="text-sm text-text-primary whitespace-nowrap">{item.years}</p>
              </div>
            ))}
          </div>
        );
      }

      // Horizontal table
      return (
        <table className="w-full text-left">
          <thead className="mb-2">
            <tr>
              {data.content.col.map((col: string, i: number) => (
                <th key={i} className="text-text-secondary text-sm font-nunito">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="mt-2">
              {data.content.data.map((val: string | number, i: number) => (
                <td key={i} className="text-text-primary text-sm font-bold">
                  {val}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      );
    }

    // Fallback plain text
    return <p className="p-0">{data.content.text}</p>;
  };

  return (
    <>
      {/* <Accordion
        type="single"
        collapsible
        className="w-full font-nunito"
        
      > */}
      <AccordionItem value={accordionId} className="bg-white border-none ">
        <div className="flex justify-between my-3 items-center px-4 py-6 border border-gray-200 rounded-md">
          <h4 className="font-bold text-text-primary text-base">{data.header}</h4>
          <div className="flex items-center space-x-2">
            {icon && (
              <Button variant="ghost" size="icon" onClick={onActionButtonClick}>
                {icon}
              </Button>
            )}
            <AccordionTrigger className="p-0 h-6 w-6 hover:no-underline [&[data-state=open]>svg]:rotate-180 hover:text-primary" />
          </div>
        </div>
        <AccordionContent className="px-3 pb-2 pt-2 text-sm  text-gray-600 leading-relaxed overflow-hidden py-2">{renderContent()}</AccordionContent>
      </AccordionItem>
      {/* </Accordion> */}
    </>
  );
};

const GridFilter = ({ title, selectedData, filterConfig, selectedFilters, onFilterSelect, actions }: GridFilterProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="mb-6 font-nunito py-2 bg-white">
        <CardContent className="px-4 py-2">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
              {selectedData.length > 0 && <span className="text-sm text-gray-500">({selectedData.length} selected)</span>}
            </div>

            <div className="flex items-center gap-2">
              {filterConfig?.map((filter) => (
                <FilterMenu key={filter.key} filterKey={filter.key} label={filter.label} items={filter.items} selected={selectedFilters && selectedFilters[filter.key]} onSelect={onFilterSelect} />
              ))}

              {/* Action Button Dropdown */}
              {actions && actions.length > 0 && <GridActionMenu actions={actions} className="shadow-none border-none" data={selectedData} />}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, iconColor = "#000" }) => (
  <Card className="bg-gray-100 text-center border-border-gray p-4 gap-0 rounded-md">
    <div className="flex justify-center items-center mb-2 text-3xl" style={{ color: iconColor }}>
      {icon}
    </div>
    <p className="mb-1 text-md text-[#646b72]">{label}</p>
    <h5 className="text-lg font-semibold">{value}</h5>
  </Card>
);

const StatItem: React.FC<StatItemProps> = ({ label, value, badge, color }) => (
  <div className="text-center">
    <h2 className="mb-1 text-xl font-bold">{value}</h2>
    <p className={`mb-2`} style={{ color }}>
      {label}
    </p>
    <span className="inline-flex items-center text-xs bg-green-100 text-green-600 px-2 py-1 rounded-md">
      <ArrowUpLeft className="w-3 h-3 mr-1" />
      {badge}
    </span>
  </div>
);

const OverviewCard: React.FC<OverviewCardProps> = ({ suppliers, customers, orders, firstTime, returnCount, firstTimePercent, returnPercent, className, intervals, title }) => {
  const radialChartOptions: ApexCharts.ApexOptions = {
    chart: {
      height: 150,
      type: "radialBar",
      toolbar: { show: false },
      parentHeightOffset: 0,
    },
    plotOptions: {
      radialBar: {
        hollow: { margin: 10, size: "30%" },
        track: {
          background: "#E6EAED",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: { offsetY: -5 },
          value: { offsetY: 5 },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    colors: ["#E04F16", "#0E9384"],
    series: [70, 70],
    labels: ["First Time", "Return"],
  };
  const [selectedInterval, setSelectedInterval] = React.useState<ChartIntervals>("Today");

  return (
    <Card className={cn("rounded-sm border-0 shadow-regular bg-white", className)}>
      <CardHeader className="flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-primary rounded-full">
            <Info className="w-4 h-4 text-white" />
          </span>
          <h5 className="text-lg font-semibold">{title}</h5>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoItem icon={<UserCheck />} label="Suppliers" value={suppliers} iconColor="#155eef" />
          <InfoItem icon={<Users />} label="Customers" value={customers} iconColor="#e04f16" />
          <InfoItem icon={<ShoppingCart />} label="Orders" value={orders} iconColor="#0e9384" />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <h5 className="text-normal text-[#212b36] font-semibold">Customers Overview</h5>

            <div className="relative group">
              <Dropdown
                triggerText={selectedInterval}
                triggerLeftIcon={<CalendarIcon className="size-2.5" />}
                triggerClassName="h-[27px] w-[80px] gap-0 text-[12px] border-border-gray hover:bg-primary-300 hover:text-white hover:transition-all duration-500 "
                className="w-[80px]"
              >
                {intervals.map((interval) => (
                  <DropdownItem key={interval} onClick={() => setSelectedInterval(interval)} className="text-xsm hover:bg-primary-200 hover:text-primary-300">
                    {interval}
                  </DropdownItem>
                ))}
              </Dropdown>
              {/* <Select
                                value={selectedInterval}
                                onValueChange={(value) =>
                                    setSelectedInterval(
                                        value as "Today" | "Weekly" | "Monthly"
                                    )
                                }
                            >
                                <SelectTrigger className="w-32 text-sm rounded-30x border-border-gray hover:bg-primary-300 hover:text-white [&[data-state=open]]:bg-primary-300 [&[data-state=open]]:text-white">
                                    <CalendarIcon className="size-4" />
                                    <SelectValue placeholder="Select Interval" />
                                </SelectTrigger>
                                <SelectContent>
                                    {intervals.map((interval) => (
                                        <SelectItem
                                            key={interval}
                                            value={interval}
                                            className="font-nunito focus:bg-primary-200 focus:text-primary-300"
                                        >
                                            {interval}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select> */}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
            <div className="col-span-2">
              <ApexCharts options={radialChartOptions} series={[70, 70]} type="radialBar" height={150} />
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-4">
              <StatItem label="First Time" value={`${firstTime}K`} badge={firstTimePercent} color="#e04f16" />
              <StatItem label="Return" value={`${returnCount}K`} badge={returnPercent} color="#0e9384" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DepartmentCard = ({
  department,
  // isSelected,
  // onSelect,
  onClick,
  actions,
}: IGridDepartmentCard) => {
  return (
    <Card className="p-5 bg-white hover:shadow-md transition-shadow">
      <CardContent className="px-0">
        <div className="grid items-start grid-cols-4 gap-1 mb-4">
          <div className="col-span-3 inline-flex text-lg items-center font-bold text-black">
            <i className="ti ti-circle-filled text-sm text-primary me-1"></i>
            {department.Department}
          </div>
          <div className="text-right">
            <ActionMenu row={department} actions={actions ?? []} className="border-none shadow-none p-4" />
          </div>
        </div>

        <div className="grid items-center justify-center grid-cols-4 gap-1 px-6 py-2 bg-gray-100 mb-3">
          <div className="col-span-4 text-center">
            <div className="relative inline-block">
              <div className="w-14 h-14 mx-auto mt-1">
                <img src={department.HOD?.hodImage || "https://via.placeholder.com/32"} alt="HOD avatar" className="w-full h-full rounded-sm" />
              </div>
            </div>

            <p className="font-bold text-md mb-1">
              <Button variant="link" onClick={onClick} className="hover:text-primary transition-colors text-lg">
                {department.HOD.hodName}
              </Button>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-sm text-gray-600">Total Members: {department.TotalMembers}</span>
          </div>
          <div className="flex justify-end">
            <AvatarGroup members={department.membersList || []} avatarClassname="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AttendanceCheckInCard = ({
  name,
  time,
  date,
  productionHours,
  punchInTime,
  avatarUrl,
}: {
  name: string;
  time: string;
  date: string;
  productionHours: string;
  punchInTime: string;
  avatarUrl: string;
}) => {
  const maxHours = 8;
  const progressPercent = Math.min((parseFloat(productionHours) / maxHours) * 100, 100);

  const ringStyle = {
    background: `conic-gradient(#22c55e ${progressPercent}%, #e5e7eb ${progressPercent}%)`, // green then gray
  };
  return (
    <Card className="w-full px-3 py-4 bg-white">
      <CardContent className="text-center">
        <h6 className="text-gray-500 mb-1">Good Morning, {name}</h6>
        <h4 className="mb-4">
          {time}, {date}
        </h4>

        <div className="relative w-32 h-32 mx-auto mb-3 rounded-full p-1" style={ringStyle}>
          <div className="bg-white rounded-full w-full h-full flex items-center justify-center">
            <div className="rounded-full overflow-hidden w-[110px] h-[110px] border border-gray-200">
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <span className="inline-block bg-primary text-white text-sm px-3 py-1 rounded-lg mb-3">Production : {productionHours} hrs</span>
          <div className="text-sm text-gray-700 mb-3">
            <i className="ti ti-fingerprint text-primary mr-1" />
            Punch In at {punchInTime}
          </div>
          <Button className="w-full bg-secondary text-white py-2">Punch Out</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const HoursOverviewCard = ({
  value,
  title,
  total,
  icon,
  trendLabel,
  trendIsPositive,
  bgColor,
}: {
  value: string;
  total: string;
  title: string;
  icon: string;
  trendLabel: string;
  trendIsPositive: boolean;
  bgColor: string;
}) => {
  const trendIcon = trendIsPositive ? "ti-arrow-up" : "ti-arrow-down";
  const trendBg = trendIsPositive ? "bg-green-500" : "bg-red-500";
  return (
    <Card className="bg-white">
      <CardContent className="px-4">
        <div className="border-b border-gray-300 mb-2 pb-2">
          <div className={`avatar-sm ${bgColor} text-white text-sm rounded-lg w-7 h-7 flex items-center justify-center mb-2`}>
            <i className={`ti ${icon}`} />
          </div>
          <h2 className="text-xl leading-7 font-bold">
            {value} / <span className="text-gray-500 text-md">{total}</span>
          </h2>
          <p className="text-sm text-gray-700 truncate">{title}</p>
        </div>
        <div className="flex items-center text-sm">
          <span className={`avatar-xs rounded-full mr-2 flex items-center justify-center w-5 h-5 ${trendBg}`}>
            <i className={`ti ${trendIcon}`} />
          </span>
          <span>{trendLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const TimelineProgressCard = ({ progressData, timeLabels }: { progressData: IProgressData[]; timeLabels: string[] }) => {
  const totalMinutes = 60 * (timeLabels.length - 1); // full span duration

  const getColor = (type: string) => {
    switch (type) {
      case "productive":
        return "bg-green-500";
      case "break":
        return "bg-yellow-500";
      case "overtime":
        return "bg-cyan-500";
      case "idle":
        return "bg-white";
      default:
        return "bg-slate-400";
    }
  };

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h > 0 ? `${h}h` : ""}${m > 0 ? ` ${m}m` : ""}`.trim() || "0m";
  };

  const totals = progressData.reduce(
    (acc, curr) => {
      acc.total += curr.durationMinutes;
      acc[curr.type] = (acc[curr.type] || 0) + curr.durationMinutes;
      return acc;
    },
    {
      total: 0,
      productive: 0,
      break: 0,
      overtime: 0,
      idle: 0,
    } as Record<string, number>
  );

  return (
    <Card className="bg-white w-full">
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm flex items-center">
              <i className="ti ti-point-filled text-gray-500 mr-1" />
              Total Working Hours
            </p>
            <h3 className="text-lg font-semibold">{formatTime(totals.total)}</h3>
          </div>
          <div>
            <p className="text-sm flex items-center">
              <i className="ti ti-point-filled text-green-500 mr-1" />
              Productive Hours
            </p>
            <h3 className="text-lg font-semibold">{formatTime(totals.productive)}</h3>
          </div>
          <div>
            <p className="text-sm flex items-center">
              <i className="ti ti-point-filled text-yellow-500 mr-1" />
              Break Hours
            </p>
            <h3 className="text-lg font-semibold">{formatTime(totals.break)}</h3>
          </div>
          <div>
            <p className="text-sm flex items-center">
              <i className="ti ti-point-filled text-cyan-500 mr-1" />
              Overtime
            </p>
            <h3 className="text-lg font-semibold">{formatTime(totals.overtime)}</h3>
          </div>
        </div>

        <div className="flex h-6 mb-3 rounded overflow-hidden bg-slate-200">
          {progressData.map((segment, index) => {
            const widthPercent = (segment.durationMinutes / totalMinutes) * 100;
            return <div key={index} className={`${getColor(segment.type)} h-full`} style={{ width: `${widthPercent}%` }} />;
          })}
        </div>

        {/* Time Labels */}
        <div className="flex justify-between text-[10px] text-gray-600 flex-wrap gap-y-1">
          {timeLabels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AttendanceOverviewCard: React.FC<AttendanceOverviewProps> = ({ heading, subheading, stats, absentAvatars }) => {
  const getTrendBadge = (percent: number) => {
    const isPositive = percent >= 0;
    return (
      <span className={cn("text-xs font-medium px-2 py-1 rounded-full flex items-center", isPositive ? "bg-green-500 text-white" : "bg-red-500 text-white")}>
        <i className="ti ti-arrow-wave-right-down mr-1 text-sm" />
        {isPositive ? "+" : ""}
        {percent}%
      </span>
    );
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
          <div>
            <h4 className="text-lg font-semibold">{heading}</h4>
            <p className="text-sm text-gray-500">{subheading}</p>
          </div>

          <div className="flex items-center gap-3">
            <h6 className="text-sm font-semibold">Total Absentees today</h6>
            <div className="flex -space-x-3">
              <AvatarGroup members={absentAvatars || []} avatarClassname="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-0 border border-gray-300 rounded overflow-hidden">
          {stats.map((stat, index) => (
            <div key={index} className={cn("p-4", index !== stats.length - 1 && "border-r border-gray-300")}>
              <span className="text-sm text-gray-500 font-medium block mb-1">{stat.label}</span>
              <div className="flex justify-between items-center">
                <h5 className="text-lg font-semibold">{stat.count}</h5>
                {getTrendBadge(stat.trendPercent)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({ title, amount, color, icon }) => {
  return (
    <div className={`relative overflow-hidden p-5 rounded-2xl shadow-lg border ${color} transition-transform transform hover:scale-[1.02] hover:shadow-xl`}>
      <div className="absolute top-0 right-0 opacity-10 text-7xl leading-none">{icon}</div>

      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold tracking-tight">{amount}</p>

      <div className="mt-4 h-1 w-16 rounded-full bg-primary"></div>
    </div>
  );
};

const EntityCard: React.FC<EntityCardProps> = ({ className, featureTitle, editClick, delClick, onChange, check, id, isDeleteDisabled = false }) => {
  const isTruncated = featureTitle && featureTitle.length > 20;

  return (
    <>
      <div className={cn("flex items-center justify-between rounded-lg border border-gray-300 p-3.5 overflow-hidden h-16", className)}>
        <div className="flex items-center gap-2">
          <SwitchButton
            check={check}
            onChange={() => onChange(id, !check)}
            circleClassName="bg-[#5B6461] data-[state=checked]:bg-[#17B26A] shadow-none"
            className="border-[#5B6461] !bg-transparent shadow-none data-[state=checked]:border-[#75E0A7]"
          />
          {isTruncated ? (
            <CustomTooltip content={featureTitle} side="right" className="bg-black text-white">
              <div className="max-w-[150px] cursor-pointer overflow-hidden truncate">{truncateText(featureTitle, 20)}</div>
            </CustomTooltip>
          ) : (
            <div>{featureTitle}</div>
          )}
        </div>
        <div className="flex items-center gap-2 text-brand-500">
          <Button onClick={() => editClick?.(id)} size={"icon"} variant={"outline"} className="rounded-lg border border-gray-300 px-2 py-2 text-brand">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => !isDeleteDisabled && delClick?.(id)}
            size={"icon"}
            variant={"outline"}
            className={cn("rounded-lg border px-2 py-2", isDeleteDisabled ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-300 text-brand")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

const SourceCard: React.FC<sourceCardProps> = ({ className, featureTitle, editClick, delClick, onChange, check, id }) => {
  const isTruncated = featureTitle && featureTitle.length > 20;

  return (
    <>
      <div className={cn("flex items-center justify-between rounded-lg border border-gray-300 p-3.5 overflow-hidden h-16", className)}>
        <div className="flex items-center gap-2">
          <SwitchButton
            check={check}
            onChange={() => onChange(id, !check)}
            circleClassName="bg-[#5B6461] data-[state=checked]:bg-[#17B26A] shadow-none"
            className="border-[#5B6461] !bg-transparent shadow-none data-[state=checked]:border-[#75E0A7]"
          />
          {isTruncated ? (
            <CustomTooltip content={featureTitle} side="right" className="bg-black text-white">
              <div className="max-w-[150px] cursor-pointer overflow-hidden truncate">{truncateText(featureTitle, 20)}</div>
            </CustomTooltip>
          ) : (
            <div>{featureTitle}</div>
          )}
        </div>
        <div className="flex items-center gap-2 text-brand-500">
          <Button onClick={() => editClick?.(id)} size={"icon"} variant={"outline"} className="rounded-lg border border-gray-300 px-2 py-2 text-brand">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button onClick={() => delClick?.(id)} size={"icon"} variant={"outline"} className="rounded-lg border border-gray-300 px-2 py-2 text-brand">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

const StatusCard: React.FC<statusCardProps> = ({ className, featureTitle, editClick, delClick, onChange, check, id }) => {
  const isTruncated = featureTitle && featureTitle.length > 20;

  return (
    <>
      <div className={cn("flex items-center justify-between rounded-lg border border-gray-300 p-3.5 overflow-hidden h-16", className)}>
        <div className="flex items-center gap-2">
          <SwitchButton
            check={check}
            onChange={() => onChange(id, !check)}
            circleClassName="bg-[#5B6461] data-[state=checked]:bg-[#17B26A] shadow-none"
            className="border-[#5B6461] !bg-transparent shadow-none data-[state=checked]:border-[#75E0A7]"
          />
          {isTruncated ? (
            <CustomTooltip content={featureTitle} side="right" className="bg-black text-white">
              <div className="max-w-[150px] cursor-pointer overflow-hidden truncate">{truncateText(featureTitle, 20)}</div>
            </CustomTooltip>
          ) : (
            <div>{featureTitle}</div>
          )}
        </div>
        <div className="flex items-center gap-2 text-brand-500">
          <Button onClick={() => editClick?.(id)} size={"icon"} variant={"outline"} className="rounded-lg border border-gray-300 px-2 py-2 text-brand">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button onClick={() => delClick?.(id)} size={"icon"} variant={"outline"} className="rounded-lg border border-gray-300 px-2 py-2 text-brand">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

const CategoryCard: React.FC<categoryCardProps> = ({ className, featureTitle, editClick, delClick, onChange, check, id }) => {
  const isTruncated = featureTitle && featureTitle.length > 20;

  return (
    <>
      <div className={cn("flex items-center justify-between rounded-lg border border-gray-300 p-3.5 overflow-hidden h-16", className)}>
        <div className="flex items-center gap-2">
          <SwitchButton
            check={check}
            onChange={() => onChange(id, !check)}
            circleClassName="bg-[#5B6461] data-[state=checked]:bg-[#17B26A] shadow-none"
            className="border-[#5B6461] !bg-transparent shadow-none data-[state=checked]:border-[#75E0A7]"
          />
          {isTruncated ? (
            <CustomTooltip content={featureTitle} side="right" className="bg-black text-white">
              <div className="max-w-[150px] cursor-pointer overflow-hidden truncate">{truncateText(featureTitle, 20)}</div>
            </CustomTooltip>
          ) : (
            <div>{featureTitle}</div>
          )}
        </div>
        <div className="flex items-center gap-2 text-brand-500">
          <Button onClick={() => editClick?.(id)} size={"icon"} variant={"outline"} className="rounded-lg border border-gray-300 px-2 py-2 text-brand">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button onClick={() => delClick?.(id)} size={"icon"} variant={"outline"} className="rounded-lg border border-gray-300 px-2 py-2 text-brand">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

const TicketPriorityCard: React.FC<TicketPriorityCardProps> = ({ priorities, className }) => {
  const total = priorities.high + priorities.medium + priorities.low;

  const highPercentage = Math.round((priorities.high / total) * 100);
  const mediumPercentage = Math.round((priorities.medium / total) * 100);
  const lowPercentage = Math.round((priorities.low / total) * 100);

  return (
    <Card className={cn("rounded-sm border-0 shadow-regular bg-white", className)}>
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Ticket Priority</h3>
        <div>
          <ProgressBar label="High" color="#3b82f6" percentage={highPercentage} />
          <ProgressBar label="Medium" color="#3b82f6" percentage={mediumPercentage} />
          <ProgressBar label="Low" color="#3b82f6" percentage={lowPercentage} />
        </div>
      </CardContent>
    </Card>
  );
};

const BasicStatCard: React.FC<BasicStatCardProps> = ({ title, value, icon, percentage, isProfit, chartData = [], chartColor = "#FF6F28" }) => {
  // normalize chartData into heights
  const maxVal = Math.max(...chartData, 1);

  return (
    <Card className="bg-white rounded-xl p-4 w-full border shadow-none border-gray-200 gap-4">
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className="bg-indigo-900 text-white p-2 rounded-md">{icon}</div>

        {/* Percentage badge */}
        {percentage !== undefined && (
          <span className={`px-2 py-1 text-xs rounded-md font-medium ${isProfit ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{isProfit ? `+${percentage}%` : `-${percentage}%`}</span>
        )}
      </div>

      <div className="flex items-end justify-between">
        {/* Value + Title */}
        <div className="flex flex-col">
          <CardTitle className="text-[24px] font-bold text-gray-900 leading-none">{value}</CardTitle>
          <CardContent className="text-sm text-gray-500 p-0 mt-1">{title}</CardContent>
        </div>

        {/* Inline Bar Chart (Peity style) */}
        {chartData.length > 0 && (
          <div className="flex items-end gap-[2px] w-[52px] h-[40px]">
            {chartData.map((d, i) => (
              <div
                key={i}
                style={{
                  height: `${(d / maxVal) * 100}%`,
                  backgroundColor: chartColor,
                  width: `${100 / chartData.length - 2}%`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  EmployeeCard,
  CandidateKanbanCard,
  InVoiceCard,
  CardWithTabs,
  StatsCard,
  SalesCard,
  Projectcard,
  FileManagerCard,
  GridFilter,
  OverviewCard,
  AccordionCards,
  DepartmentCard,
  AttendanceCheckInCard,
  HoursOverviewCard,
  TimelineProgressCard,
  AttendanceOverviewCard,
  PaymentSummaryCard,
  SourceCard,
  StatusCard,
  EntityCard,
  CategoryCard,
  TicketPriorityCard,
  BasicStatCard,
};
