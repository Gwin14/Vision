import React from "react";
import { useDnD } from "./DnDContext";
import OneDriveFiles from "./platforms/onedrive/OneDriveFiles";

export default function Sidebar() {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType, file = null) => {
    setType({ nodeType, file });
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <OneDriveFiles onDragStart={onDragStart} />
    </aside>
  );
}
