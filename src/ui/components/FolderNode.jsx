import { Handle, NodeResizer } from "@xyflow/react";

function handleFileClick(filePath) {
  window.electronAPI.openFile(filePath)
  .then(result => {
    if (result) {
      alert(`Failed to open file: ${result}`);
    }
  });
}

// drag and drop API
const handleDragStart = (event, subfolderPath, parentId) => {
  event.dataTransfer.setData('text/plain', JSON.stringify({
    subfolderPath: subfolderPath,
    parentId: parentId,
  }))
};

// react component
function FolderNode(props) {
  console.log("props in FolderNode: ", props)
  const { id, selected, handleHeaderContextMenu, handleFileContextMenu } = props
  const {dirPath, label, files, subfolders} = props.data

  if (files.length === 0 && subfolders.length === 0) {
    return (
      <>
        <NodeResizer
          color="#d3d3d3ff"
          isVisible={selected}
        />
        <div className="folder-node">
        <div className="folder-node-header" onContextMenu={(e)=>handleHeaderContextMenu(e, id, dirPath)}>
          <span>{label}</span>
        </div>
        <div className="no-content" >
          add some stuff!
        </div>
        <Handle type="target" position="top" style={{ background: '#555' }} />
        <Handle type="source" position="bottom" style={{ background: '#555', display: 'block' }} />
      </div>
      </>
    )
  } else {
    return (
      <>
        <NodeResizer color="#d3d3d3ff" isVisible={selected} />
          <div 
            className="folder-node nowheel"
          >
            <div className="folder-node-header" onContextMenu={(e)=>handleHeaderContextMenu(e, id, dirPath)}>
              <span>{label}</span>
            </div>
            <div className="folder-node-files">
              {files.map((item) => (
                <div
                  className="folder-node-file"
                  key={item.id}
                  title={item.name}
                  onClick={() => handleFileClick(item.path)}
                  onContextMenu={(e) => handleFileContextMenu(e, item.path)}
                >
                  <span className="file-name">
                    📄 {item.name}
                  </span>
                  <span style={{color:"grey"}}>
                    {item.size}
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
}


export default (FolderNode)