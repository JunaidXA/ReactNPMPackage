import { formatDateData } from "@/helper/funcs";
import {
  ActionMenuProps,
  GridActionMenuProps,
  StyledDataCellProps,
} from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface StyledDateProps {
  date: string;
}
const StyledDate: React.FC<StyledDateProps> = ({ date }) => {
  const { day, month, year } = formatDateData(date);

  return (
    <div className="text-center">
      <div className="flex items-center justify-center">
        <div className="text-[40px] font-bold leading-none text-primary/80">
          {day}
        </div>
        <div className="flex flex-col justify-end pl-1">
          <div className="text-[11px] font-bold uppercase">{month}</div>
          <div className="text-[11px] font-bold uppercase">{year}</div>
        </div>
      </div>
    </div>
  );
};

const StyledDataCell: React.FC<StyledDataCellProps> = ({
  createdBy,
  createdOn,
  className,
  dataAlignClassName,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        dataAlignClassName
      )}
    >
      <StyledDate date={createdOn} />
      {createdBy && (
        <div className="flex">
          <h4
            className={cn("font-bold text-primary-600 text-[11px]", className)}
          >
            {createdBy}
          </h4>
        </div>
      )}
    </div>
  );
};

const ActionMenu: React.FC<ActionMenuProps> = ({
  row,
  actions,
  loadingRowId,
  className,
}) => {
  const visibleActions = actions?.filter((action) =>
    action.condition ? action.condition(row) : true
  );

  const isCurrentRowLoading = loadingRowId === row.id;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        disabled={visibleActions.length <= 0}
        className={className}
      >
        <Button
          loading={isCurrentRowLoading}
          variant="outline"
          className="h-8 w-8 border border-gray-100 p-0"
        >
          <MoreHorizontal className="h-4 w-4 rotate-90 text-brand-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-0">
        {visibleActions?.map((action: any, index: number) => (
          <DropdownMenuItem
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(row);
            }}
            className="flex items-center gap-2 text-4xs text-gray-500 hover:bg-gray-200"
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const GridActionMenu: React.FC<GridActionMenuProps> = ({
  actions,
  data,
  className,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button
          variant="outline"
          className="h-8 w-8 border border-gray-100 p-0"
        >
          <MoreHorizontal className="h-4 w-4 rotate-90 text-brand-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions?.map((action: any, index: number) => (
          <DropdownMenuItem
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(data);
            }}
            className="flex items-center gap-2 text-4xs text-gray-500 hover:bg-gray-200"
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// const Dropzone: React.FC<> = ({
//   return(
//       <div className="md:w-1/2 w-full md:mt-0 mt-2">
//                   <h6 className="pb-2 text-sm leading-3 font-medium text-primary-300">
//                     Upload File
//                   </h6>
//                   <div
//                     className="flex items-center justify-center p-5 rounded-lg border border-[#ced4da] cursor-pointer h-[10.75rem]"
//                     {...getRootProps()}
//                   >
//                     <input {...getInputProps()} />
//                     <p className="text-primary-300">
//                       Drag & drop an audio file here, or{" "}
//                       <a className="text-primary-600 font-bold underline">
//                         click
//                       </a>{" "}
//                       to select one
//                     </p>
//                   </div>
//                   {fileError && (
//                     <p className="text-red-500 text-sm mt-1">{fileError}</p>
//                   )}

//                   {fileLoading && (
//                     <div className="mt-2 text-center flex items-center justify-center h-[3.875rem]">
//                       <SpinnerIcon />
//                     </div>
//                   )}

//                   {audioSrc && (
//                     <div className="mt-2 text-center lg:flex sm:items-center gap-5">
//                       <p className="text-black font-medium text-xs text-start">
//                         File preview:
//                       </p>
//                       <audio
//                         key={audioSrc}
//                         controls
//                         className="mt-2 sm:w-72 w-48"
//                       >
//                         <source src={audioSrc} type={audioFile?.type} />
//                         Your browser does not support the audio element.
//                       </audio>
//                     </div>
//                   )}
//                 </div>
//   )
// })

export { StyledDate, StyledDataCell, ActionMenu, GridActionMenu };
