import { Handle } from "@xyflow/react";

export default function CleanNode(props) {
  console.log("PROPS: ", props)

  const {label, files} = props.data
  
  return (
    <div className="folder-node">
      <div className="folder-node-header">
        <span>{label}</span>
      </div>

      <div className="folder-node-files" >
        {files.map((file, index) => {
          const dotIndex = file.lastIndexOf('.');
          const namePart = dotIndex !== -1 ? file.substring(0, dotIndex) : file;
          const extPart = dotIndex !== -1 ? file.substring(dotIndex) : '';
          return (
            <div className="folder-node-file" key={index}>
              <span className="file-name">
                {namePart}
                <span className="file-ext">{extPart}</span>
              </span>
            </div>
          )
        })}
      </div>

      <div className="folder-node-footer">
        {files.length} items
      </div>

      {props.id !== 'root' && <Handle type="target" position="top" style={{ background: '#555' }} />}
      <Handle type="source" position="bottom" style={{ background: '#555' }} />
    </div>
  );
}