import { Handle } from "@xyflow/react";

export default function CleanNode(props) {
  console.log("PROPS: ", props)
  
  return (
    <div className="folder-node">
      <div className="folder-node-heading">
        {props.data.label}
      </div>
      <div className="folder-node-files">
        {props.data.files.map((file) => {
          return <p>{file}</p>
        })}
      </div>
      <Handle type="target" position="top" style={{ background: '#555' }} />
      <Handle type="source" position="bottom" style={{ background: '#555' }} />
    </div>
  );
}