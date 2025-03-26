import React, { useEffect, useState } from "react";
import { useDnD } from "./DnDContext";

// Componente para itens que podem ser recursivos
function FolderItem({ item, onDragStart }) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState(null);

  const toggleExpand = () => {
    setExpanded(!expanded);
    if (!children && !expanded) {
      // Se ainda não buscou os filhos, faça a chamada
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
    <li>
      <div
        className="dndnode file"
        onClick={toggleExpand}
        onDragStart={(event) => onDragStart(event, "file", item)}
        draggable
      >
        {item.name} {item.folder ? (expanded ? "[-]" : "[+]") : ""}
      </div>
      {expanded && children && (
        <ul style={{ paddingLeft: "20px" }}>
          {children.map((child) =>
            child.folder ? (
              <FolderItem
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
}

export default function Sidebar() {
  const [files, setFiles] = useState([]);
  const [_, setType] = useDnD();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/microsoftauth/arquivos/",
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
            credentials: "include",
          }
        );

        if (response.status === 401) {
          window.location.href = "http://localhost:8000/microsoftauth/login/";
          return;
        }

        const data = await response.json();
        if (data && data.arquivos) {
          setFiles(data.arquivos);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    fetchData();
  }, []);

  const onDragStart = (event, nodeType, file = null) => {
    setType({ nodeType, file });
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <div className="files">
        <h3>Arquivos do OneDrive</h3>
        <ul>
          {files.map((file) =>
            file.folder ? (
              <FolderItem key={file.id} item={file} onDragStart={onDragStart} />
            ) : (
              <li
                key={file.id}
                className="dndnode file"
                onDragStart={(event) => onDragStart(event, "file", file)}
                draggable
              >
                {file.name}
              </li>
            )
          )}
        </ul>
      </div>
    </aside>
  );
}
