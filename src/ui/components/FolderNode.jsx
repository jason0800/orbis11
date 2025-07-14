import { Handle } from "@xyflow/react";

function handleFileClick(filePath) {
  window.electronAPI.openFile(filePath)
  .then(result => {
    if (result) {
      alert(`Failed to open file: ${result}`);
    }
  });
}

const handleDragStart = (event, subfolderPath, parentId) => {
  event.dataTransfer.setData('text/plain', JSON.stringify({
    subfolderPath: subfolderPath,
    parentId: parentId,
  }))
};

function FolderNode(props) {
  const id = props.id
  const {label, files, subfolders} = props.data
  const handleHeaderContextMenu = props.handleHeaderContextMenu
  
  return (
    <>
      <div className="folder-node">
        <div className="folder-node-header" onContextMenu={(e)=>handleHeaderContextMenu(e, id)}>
          <span>{label}</span>
        </div>
        <div className="folder-node-files" >
          {files.map((item) => (
            <div
              className="folder-node-file"
              key={item.id}
              title={item.name}
              onClick={() => handleFileClick(item.path)}
            >
              <span className="file-name">
                📄 {item.name}
              </span>
            </div>
          ))}
          {subfolders.map((item) => (
            <div
              className="folder-node-file nodrag"
              key={item.id}
              title={item.name}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => handleFileClick(item.path)}
              onDragStart={(e) => handleDragStart(e, item.path, id)}
              draggable="true"
            >
              <span className="file-name">
                📁 {item.name}
              </span>
            </div>
          ))}
        </div>
        <div className="folder-node-footer">
          {[...files, ...subfolders].length} items
        </div>
        <Handle type="target" position="top" style={{ background: '#555' }} />
        <Handle type="source" position="bottom" style={{ background: '#555', display: 'block' }} />
      </div>
    </>
  );
}

export default (FolderNode)