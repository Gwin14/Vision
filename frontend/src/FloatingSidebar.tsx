import React from "react";
import { Node } from "@xyflow/react";

type FloatingSidebarProps = {
  node: Node;
  onClose: (event: React.MouseEvent) => void;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDateTime = (dateString: string): string => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.toLocaleString();
};

const FloatingSidebar: React.FC<FloatingSidebarProps> = ({ node, onClose }) => {
  return (
    <div className="floating-sidebar" onClick={(e) => e.stopPropagation()}>
      <button type="button" onClick={onClose} className="close-button">
        »
      </button>
      {node.data.file?.mimeType === "image/png" ||
      node.data.file?.mimeType === "image/jpeg" ? (
        <img
          src={node.data["@microsoft.graph.downloadUrl"]}
          alt={node.data.name || "Image"}
          style={{
            width: "90%",
            margin: "auto",
            display: "block",
            borderRadius: "5px",
          }}
        />
      ) : node.data.folder ? (
        <img
          src="https://static-00.iconduck.com/assets.00/folder-icon-512x410-jvths5l6.png"
          alt=""
          style={{ width: "80%", margin: "auto", display: "block" }}
        />
      ) : (
        <img
          src="https://cdn.pixabay.com/photo/2014/04/03/00/40/document-309065_640.png"
          alt=""
          style={{ width: "80%", margin: "auto", display: "block" }}
        />
      )}
      <h3>File Metadata</h3>
      <div className="metadata-section">
        <p>
          <strong>Name:</strong> {node.data.name || "Unknown"}
        </p>
        <p>
          <strong>Type:</strong>{" "}
          {node.data.folder ? "Folder" : node.data.file?.mimeType || "File"}
        </p>
        <p>
          <strong>ID:</strong> {node.data.id || "Unknown"}
        </p>
        <p>
          <strong>Size:</strong> {formatFileSize(node.data.size)}
        </p>
        <p>
          <strong>Created:</strong> {formatDateTime(node.data.createdDateTime)}
        </p>
        <p>
          <strong>Modified:</strong>{" "}
          {formatDateTime(node.data.lastModifiedDateTime)}
        </p>
        <p>
          <strong>Created by:</strong>{" "}
          {node.data.createdBy?.user?.displayName || "Unknown"}
        </p>
        <p>
          <strong>Modified by:</strong>{" "}
          {node.data.lastModifiedBy?.user?.displayName || "Unknown"}
        </p>
        {node.data.file?.mimeType && (
          <p>
            <strong>File type:</strong> {node.data.file.mimeType}
          </p>
        )}
        {node.data.folder?.childCount !== undefined && (
          <p>
            <strong>Items:</strong> {node.data.folder.childCount}
          </p>
        )}
        {node.data.parentReference && (
          <div className="parent-info">
            <p>
              <strong>Location:</strong>{" "}
              {node.data.parentReference.name || "Root"}
            </p>
            <p>
              <strong>Path:</strong> {node.data.parentReference.path || "/"}
            </p>
          </div>
        )}
        {node.data.webUrl && (
          <p>
            <strong>Web URL:</strong>{" "}
            <a
              href={node.data.webUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in browser
            </a>
          </p>
        )}
        {node.data["@microsoft.graph.downloadUrl"] && (
          <p>
            <strong>Download:</strong>{" "}
            <a
              href={node.data["@microsoft.graph.downloadUrl"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download file
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default FloatingSidebar;
