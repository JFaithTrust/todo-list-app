import React, {useState} from "react";
import Card from "@/components/card";
import DropIndicator from "@/components/drop-indicator";
import AddCard from "@/components/add-card";
import {Task} from "@/types";

interface ColumnProps {
  title: string;
  headingColor: string;
  cards: Task[];
  column: string;
  setCards: (cards: Task[]) => void;
}

const Column = ({ title, headingColor, cards, column, setCards }: ColumnProps) => {
  const [active, setActive] = useState(false);
  const filteredCards = cards.filter((c) => c.column === column);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: {title: string, id: string, column: string, dueDate?: Date, category?: string}) => {
    e.dataTransfer.setData("cardId", card.id);
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights()

    const indicators = getIndicators();
    const {element} = getNearestIndicator(e, indicators);
    const before = (element as HTMLElement).dataset.before || "-1";

    if(before !== cardId){
      let copy = [...cards];
      let cardToTransfer = copy.find((c) => c.id === cardId);
      if(!cardToTransfer) return;
      cardToTransfer = {...cardToTransfer, column};

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if(moveToBack){
        copy.push(cardToTransfer);
      }else{
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if(insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  }

  const handleDragLeave = () => {
    clearHighlights()
    setActive(false);
  }

  const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    (el.element as HTMLElement).style.opacity = "1";
  }

  const clearHighlights = (els?: Element[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      (i as HTMLElement).style.opacity = "0";
    })
  }

  const getNearestIndicator = (e: React.DragEvent<HTMLDivElement>, indicators: Element[]): {offset: number, element: Element} => {
    return indicators.reduce((closest, child) => {
      const DISTANCE_OFFSET = 50;

      const box = child.getBoundingClientRect()
      const offset = e.clientY - (box.top + DISTANCE_OFFSET);

      if(offset < 0 && offset > closest.offset){
        return {offset, element: child}
      }else{
        return closest;
      }
    },{
      offset: Number.NEGATIVE_INFINITY,
      element: indicators[indicators.length - 1]
    })
  }

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  }


  return(
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">{filteredCards.length}</span>
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={`h-full w-full transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"}`}>
        {filteredCards.map((c) => {
          return <Card key={c.id} card={c} handleDragStart={handleDragStart} setCards={setCards} />;
        })}
        <DropIndicator beforeId="-1" column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  )
}

export default Column;