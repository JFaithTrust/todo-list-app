import React, {useState} from "react";
import DropIndicator from "@/components/drop-indicator";
import {motion} from "framer-motion";
import {Pencil} from "lucide-react";
import SpringModal from "@/components/ui/spring-modal";
import {Badge} from "@/components/ui/badge";
import {format} from "date-fns";
import {Task} from "@/types";

interface CardProps {
  card: Task;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, card: {title: string, id: string, column: string, dueDate?: Date, category?: string}) => void;
  setCards: (cards: Task[]) => void;
}

const Card = ({ card, handleDragStart, setCards}: CardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} id={card.id} setCards={setCards} card={card} />
      <DropIndicator beforeId={card.id} column={card.column} />
      <motion.div
        layout
        layoutId={card.id}
        draggable="true"
        onDragStart={(e: any) => handleDragStart(e, card)}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <div className={"flex flex-col gap-y-2"}>
          <div className={"flex justify-between items-center"}>
            <p className="text-sm text-neutral-100">{card.title}</p>
            <Pencil className="text-neutral-300 w-4 h-4 cursor-pointer" onClick={() => setIsOpen(true)}/>
          </div>
          <div className={"flex justify-start items-center gap-x-2"}>
            {card.dueDate && <Badge className={"bg-red-500 hover:bg-red-500/80"}>{format(card.dueDate, "dd MMM")}</Badge>}
            {card.category && <Badge className={"bg-blue-500 hover:bg-blue-500/80"}>{card.category}</Badge>}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Card;