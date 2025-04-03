import React, { useEffect, useState } from "react";
import OneDriveFolderItem from "./OneDriveFolderItem";

type OneDriveFilesProps = {
  onDragStart: (event: React.DragEvent, nodeType: string, file: any) => void;
};

const OneDriveFiles: React.FC<OneDriveFilesProps> = ({ onDragStart }) => {
  const [files, setFiles] = useState([]);

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
          window.location.href =
            "http://localhost:8000/microsoftauth/auth/microsoft/";
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

  return (
    <div className="files">
      <h3>Arquivos do OneDrive</h3>
      <ul>
        {files.map((file) =>
          file.folder ? (
            <OneDriveFolderItem
              key={file.id}
              item={file}
              onDragStart={onDragStart}
            />
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
  );
};

export default OneDriveFiles;
