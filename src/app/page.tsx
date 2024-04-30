"use client"

import React, {useEffect, useState} from "react";
import Column from "@/components/column";
import BurnBarrel from "@/components/burn-barrel";
import {Task} from "@/types";

export default function Board() {
  const [cards, setCards] = useState<Task[]>([]);
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    hasChecked && localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    const cardData = localStorage.getItem("cards");

    setCards(cardData ? JSON.parse(cardData) : []);

    setHasChecked(true);
  }, []);

  return (
    <div
      className="md:h-screen h-full w-full bg-black bg-grid-white/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className={"flex items-center justify-center h-full w-full"}>
        <div
          className="flex md:flex-row flex-col md:overflow-hidden justify-center overflow-y-scroll gap-3 p-12">
          <Column
            title="Todo"
            column="todo"
            headingColor="text-red-200"
            cards={cards}
            setCards={setCards}
          />
          <Column
            title="Progress"
            column="progress"
            headingColor="text-yellow-200"
            cards={cards}
            setCards={setCards}
          />
          <Column
            title="Complete"
            column="done"
            headingColor="text-emerald-200"
            cards={cards}
            setCards={setCards}
          />
          <BurnBarrel setCards={setCards}/>
        </div>
      </div>
    </div>
  );
};




