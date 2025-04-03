import React, { useState } from "react";

type FolderItemProps = {
  item: any;
  onDragStart: (event: React.DragEvent, nodeType: string, file: any) => void;
};

const OneDriveFolderItem: React.FC<FolderItemProps> = ({
  item,
  onDragStart,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState(null);

  const toggleExpand = () => {
    setExpanded(!expanded);
    if (!children && !expanded) {
      fetch(
        `http://localhost:8000/microsoftauth/arquivos/?parentId=${item.id}`,
        {
          method: "GET",
          headers: { Accept: "*/*" },
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.arquivos) {
            setChildren(data.arquivos);
          }
        })
        .catch((error) => console.error("Erro ao buscar filhos:", error));
    }
  };

  return (
    <li style={{ listStyleType: "none" }}>
      <div
        className="dndnode file"
        onClick={toggleExpand}
        onDragStart={(event) => onDragStart(event, "file", item)}
        draggable
        style={{ backgroundColor: expanded ? "#808080aa" : "#8080803a" }}
      >
        {item.folder ? (expanded ? "📂" : "📁") : ""} {item.name}
      </div>
      {expanded && children && (
        <ul style={{ paddingLeft: "20px", listStyleType: "none" }}>
          {children.map((child) =>
            child.folder ? (
              <OneDriveFolderItem
                key={child.id}
                item={child}
                onDragStart={onDragStart}
              />
            ) : (
              <li
                key={child.id}
                className="dndnode file"
                onDragStart={(event) => onDragStart(event, "file", child)}
                draggable
              >
                {child.name}
              </li>
            )
          )}
        </ul>
      )}
    </li>
  );
};

export default OneDriveFolderItem;
