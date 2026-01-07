// import { useState } from "react";
// import {
//   DndContext,
//   closestCenter,
//   DragEndEvent,
//   UniqueIdentifier,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
//   arrayMove,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// // import { colorMap } from "@/helper";
// import { cn } from "@/lib/utils";
// import { Actions, Option } from "../types";
// import Badge from "./badge";
// import { ActionMenu } from "./common";
// import { ProfileAvatar } from "./avatar";
// import { Button } from "./button";

// // Interface for KanbanColumn props
// interface ColumnProps {
//   // titleDotColor?: ColorKey;
//   titleDotColor?: any;
//   colID: string;
//   title: string;
//   cards: any[];
//   handleProfileClick: (id: string | number) => void;
//   actions?: Actions[];
//   handleAddClick: (id: string) => void;
//   addItemText?: string;
// }

// interface ConfirmationModalProps {
//   open: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   sourceColTitle: string;
//   targetColTitle: string;
//   cardName: string;
// }

// const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
//   open,
//   onClose,
//   onConfirm,
//   sourceColTitle,
//   targetColTitle,
//   cardName,
// }) => {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50] flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//         <h3 className="text-lg font-bold text-text-primary mb-4">
//           Confirm Card Move
//         </h3>
//         <p className="text-text-secondary mb-6">
//           Are you sure you want to move{" "}
//           <span className="font-bold">{cardName}</span> from{" "}
//           <span className="font-bold">{sourceColTitle}</span> to{" "}
//           <span className="font-bold">{targetColTitle}</span>?
//         </p>
//         <div className="flex justify-end space-x-4">
//           <Button
//             variant="textBtn"
//             className="text-text-secondary hover:text-primary"
//             onClick={onClose}
//           >
//             Cancel
//           </Button>
//           <Button
//             className="bg-primary text-white hover:bg-primary-dark"
//             onClick={() => {
//               onConfirm();
//               onClose();
//             }}
//           >
//             Confirm
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// Sortable CandidateKanbanCard component
// const CandidateKanbanCard: React.FC<{
//   handleProfileClick: (id: string | number) => void;
//   actions?: Actions[];
//   item: any;
//   id: string; // Assuming card IDs are strings in your data
// }> = ({ handleProfileClick, actions, item, id }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       className="flex flex-col items-center bg-white rounded-sm border border-border-gray shadow-[0px_1px_1px_1px_rgba(198,198,198,0.2)] p-5"
//     >
//       <div className="border border-transparent w-full border-b-border-gray pb-4 mb-4 flex items-center justify-between">
//         <Badge
//           variant="id"
//           value={item?.id}
//           className="px-2 py-0.5 font-extrabold border-transparent rounded-sm text-xsm"
//         />
//         {actions && <ActionMenu actions={actions} row={item} />}
//       </div>
//       <div className="w-full">
//         <div className="flex items-center space-x-4 mb-4">
//           <ProfileAvatar
//             src={item.src}
//             onClick={() => handleProfileClick && handleProfileClick(item)}
//             avatarClassname="!h-11 !w-11 !rounded-sm bg-gray-200"
//             avatarFallbackClassname="bg-gray-200"
//             fallback={item.name[0].toUpperCase()}
//           />
//           <div>
//             <Button
//               variant={"textBtn"}
//               className="text-text-primary font-bold hover:text-primary leading-5"
//             >
//               {item.name}
//             </Button>
//             <h5 className="text-text-secondary text-sm">{item.email}</h5>
//           </div>
//         </div>
//         {item.attributes &&
//           item.attributes.map((item: Option, index: number) => (
//             <div
//               key={index}
//               className="flex items-center justify-between space-x-2"
//             >
//               <h1 className="text-text-secondary text-md">{item.label}</h1>
//               <h1 className="text-text-primary text-md font-bold">
//                 {item.value}
//               </h1>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// // Column component
// const Column: React.FC<ColumnProps> = ({
//   titleDotColor = "red",
//   title,
//   cards,
//   handleProfileClick,
//   actions,
//   handleAddClick,
//   addItemText,
//   colID,
// }) => {
//   const { bg, border, lightBg } = colorMap[titleDotColor];

//   return (
//     <div className="p-4 rounded-sm bg-[#EDF2F4] space-y-2 mx-3">
//       <div className="flex items-center justify-start bg-white p-2 rounded-sm space-x-2">
//         <span className={cn("p-1 flex rounded-full", lightBg)}>
//           <span
//             className={cn("border rounded-full block p-1", bg, border)}
//           ></span>
//         </span>
//         <h5 className="font-extrabold text-text-primary">{title}</h5>
//         <span className="py-0.5 px-2 bg-[#F8F9FA] text-text-primary border border-[#F8F9FA] font-bold text-xsm rounded-full">
//           {cards.length}
//         </span>
//       </div>
//       <SortableContext
//         id={colID}
//         items={cards.map((card) => card.id)}
//         strategy={verticalListSortingStrategy}
//       >
//         <div className="space-y-3">
//           {cards.map((item) => (
//             <CandidateKanbanCard
//               key={item.id}
//               id={item.id}
//               handleProfileClick={handleProfileClick}
//               actions={actions}
//               item={item}
//             />
//           ))}
//         </div>
//       </SortableContext>
//       {addItemText && (
//         <Button
//           pre={<i className="ti ti-plus" />}
//           className="bg-white p-2 rounded-sm w-full font-bold hover:text-primary text-md border-dashed border border-border-gray"
//           onClick={() => handleAddClick(colID)}
//         >
//           {addItemText}
//         </Button>
//       )}
//     </div>
//   );
// };

// // KanbanBoard component
// export const KanbanBoard = () => {
//   const [columns, setColumns] = useState(columnData);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [pendingMove, setPendingMove] = useState<{
//     activeId: UniqueIdentifier;
//     overId: UniqueIdentifier;
//     activeColID: string;
//     overColID: string;
//     activeColTitle: string;
//     overColTitle: string;
//     cardName: string;
//   } | null>(null);

//   const handleProfileClick = (id: string | number) => {
//     console.log("Profile clicked:", id);
//   };

//   const handleAddClick = (id: string) => {
//     console.log("Open modal for " + id);
//   };

//   const handleAction = (id: string) => {
//     console.log("Delete this id", id);
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (!over) return;

//     const activeId = active.id;
//     const overId = over.id;

//     // Find the source and target columns
//     const activeCol = columns.find((col) =>
//       col.cards.some((card) => card.id === activeId.toString())
//     );
//     const overCol =
//       columns.find((col) =>
//         col.cards.some((card) => card.id === overId.toString())
//       ) || columns.find((col) => col.colID === overId.toString());

//     if (!activeCol || !overCol) return;

//     const activeColID = activeCol.colID;
//     const overColID = overCol.colID;
//     const activeCard = activeCol.cards.find(
//       (card) => card.id === activeId.toString()
//     );

//     // If dragging within the same column
//     if (activeColID === overColID) {
//       const oldIndex = activeCol.cards.findIndex(
//         (card) => card.id === activeId.toString()
//       );
//       const newIndex = activeCol.cards.findIndex(
//         (card) => card.id === overId.toString()
//       );

//       if (oldIndex === newIndex) return;

//       setColumns((prevColumns) =>
//         prevColumns.map((col) =>
//           col.colID === activeColID
//             ? { ...col, cards: arrayMove(col.cards, oldIndex, newIndex) }
//             : col
//         )
//       );
//     } else {
//       // Store pending move and open modal
//       setPendingMove({
//         activeId,
//         overId,
//         activeColID,
//         overColID,
//         activeColTitle: activeCol.title,
//         overColTitle: overCol.title,
//         cardName: activeCard?.name || "Card",
//       });
//       setIsModalOpen(true);
//     }
//   };

//   const handleConfirmMove = () => {
//     if (!pendingMove) return;

//     const { activeId, overId, activeColID, overColID } = pendingMove;

//     setColumns((prevColumns) => {
//       const newColumns = [...prevColumns];
//       const sourceCol = newColumns.find((col) => col.colID === activeColID);
//       const targetCol = newColumns.find((col) => col.colID === overColID);

//       if (!sourceCol || !targetCol) return prevColumns;

//       const sourceCards = [...sourceCol.cards];
//       const targetCards = [...targetCol.cards];
//       const activeIndex = sourceCards.findIndex(
//         (card) => card.id === activeId.toString()
//       );

//       // Remove card from source column
//       const [movedCard] = sourceCards.splice(activeIndex, 1);

//       // Add card to target column
//       const overIndex = targetCards.findIndex(
//         (card) => card.id === overId.toString()
//       );
//       if (overIndex === -1) {
//         targetCards.push(movedCard);
//       } else {
//         targetCards.splice(overIndex, 0, movedCard);
//       }

//       sourceCol.cards = sourceCards;
//       targetCol.cards = targetCards;

//       return newColumns;
//     });

//     setPendingMove(null);
//     setIsModalOpen(false);
//   };

//   return (
//     <>
//       <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//         <div className="flex items-start">
//           {columns.map((cols) => (
//             <Column
//               key={cols.colID}
//               colID={cols.colID}
//               cards={cols.cards}
//               title={cols.title}
//               titleDotColor={cols.titleDotColor as ColorKey}
//               handleProfileClick={handleProfileClick}
//               handleAddClick={handleAddClick}
//               addItemText={cols.addItemText}
//               actions={[
//                 {
//                   label: "Delete",
//                   icon: <i className="ti ti-search" />,
//                   onClick: (row) => handleAction(row.id),
//                 },
//               ]}
//             />
//           ))}
//         </div>
//       </DndContext>
//       {/* <NotificationModal open={isModalOpen} setOpen={() => {
//           setIsModalOpen(false);
//           setPendingMove(null);
//         }}
//         cancelButtonText="Confirm"

//         /> */}

//       <ConfirmationModal
//         open={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setPendingMove(null);
//         }}
//         onConfirm={handleConfirmMove}
//         sourceColTitle={pendingMove?.activeColTitle || ""}
//         targetColTitle={pendingMove?.overColTitle || ""}
//         cardName={pendingMove?.cardName || ""}
//       />
//     </>
//   );
// };

// Initial column data
// const columnData = [
//   {
//     colID: "col1",
//     titleDotColor: "purple",
//     addItemText: "Add Item",
//     title: "New",
//     cards: [
//       {
//         name: "test",
//         email: "test@test.com",
//         id: "Cand-001",
//         attributes: [
//           { label: "Applied Role", value: "Accountant" },
//           { label: "Applied Date", value: "12 Sep 2024" },
//         ],
//       },
//       {
//         name: "new test",
//         email: "newtest@test.com",
//         id: "Cand-002",
//         attributes: [
//           { label: "Applied Role", value: "Accountant" },
//           { label: "Applied Date", value: "12 Sep 2024" },
//           { label: "Interview Date", value: "15 Sep 2024" },
//         ],
//       },
//     ],
//   },
//   {
//     colID: "col2",
//     titleDotColor: "red",
//     title: "Scheduled",
//     cards: [
//       {
//         name: "schedule user",
//         email: "tested@test.com",
//         id: "Cand-003",
//         attributes: [
//           { label: "Scheduled Role", value: "Web Developer" },
//           { label: "Scheduled Date", value: "16 Sep 2024" },
//         ],
//       },
//     ],
//   },
// ];
