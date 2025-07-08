import { Handle } from "@xyflow/react";

function handleFileClick(filePath) {
  window.electronAPI.openFile(filePath)
  .then(result => {
    if (result) {
      alert(`Failed to open file: ${result}`);
    }
  });
}

function FolderNode(props) {
  const {label, items} = props.data
  console.log("PROPS: ", props)
  
  return (
    <>
      <div className="folder-node">
        <div className="folder-node-header">
          <span>{label}</span>
        </div>
        <div className="folder-node-files" >
          {items.map((item) => {
            return (
              <div
                className="folder-node-file"
                key={item.id}
                title={item.name}
                onClick={() => handleFileClick(item.path)}
              >
                <span className="file-name">
                  {item.name}
                  {/* <span className="file-ext">{extPart}</span> */}
                </span>
                {/* <span className="file-size">{file.size}</span> */}
              </div>
            )
          })}
        </div>
        <div className="folder-node-footer">
          {items.length} items
        </div>
        <Handle type="target" position="top" style={{ background: '#555' }} />
        <Handle type="source" position="bottom" style={{ background: '#555', display: 'block' }} />
      </div>
    </>
  );
}

export default (FolderNode)