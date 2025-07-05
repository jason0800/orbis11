import { Handle } from "@xyflow/react";

export default function CleanNode(props) {
  return (
    <div>
      <div className="custom-node" >
        {props.data.label}
      </div>
      <Handle type="target" position="top" style={{ background: '#555' }} />
      <Handle type="source" position="bottom" style={{ background: '#555' }} />
    </div>
  );
}