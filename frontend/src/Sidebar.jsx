/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDnD } from "./DnDContext";

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
            credentials: "include", // garante o envio de cookies para a sessão
          }
        );

        // Se não autenticado, redireciona para o fluxo de login
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
      <div className="description">
        Arraste esses nós para o painel à direita.
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, "input")}
        draggable
      >
        Input Node
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "default")}
        draggable
      >
        Default Node
      </div>
      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "output")}
        draggable
      >
        Output Node
      </div>
      <div className="files">
        <h3>Arquivos do OneDrive</h3>
        <ul>
          {files.map((file) => (
            <li
              key={file.id}
              className="dndnode file"
              onDragStart={(event) => onDragStart(event, "file", file)}
              draggable
            >
              {file.name}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
