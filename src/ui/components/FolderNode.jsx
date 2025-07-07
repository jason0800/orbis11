import { Handle } from "@xyflow/react";

export default function CleanNode(props) {
  const id = props.id
  const {label, files, isEndNode} = props.data
  // console.log("PROPS: ", props)
  
  return (
    <div className="folder-node">
      <div className="folder-node-header">
        <span>{label}</span>
      </div>

      <div className="folder-node-files" >
        {files.map((file, index) => {
          const dotIndex = file.name.lastIndexOf('.');
          const namePart = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file;
          const extPart = dotIndex !== -1 ? file.name.substring(dotIndex) : '';
          return (
            <div className="folder-node-file" key={index}>
              <span className="file-name">
                {namePart}
                <span className="file-ext">{extPart}</span>
              </span>
              <span className="file-size">{file.size}</span>
            </div>
          )
        })}
      </div>
      <div className="folder-node-footer">
        {files.length} items
      </div>
      {id !== 'root' && <Handle type="target" position="top" style={{ background: '#555' }} />}
      <Handle type="source" position="bottom" style={{ background: isEndNode ? 'transparent' : '#555', display: isEndNode ? 'none' : 'block'  }} />
    </div>
  );
}