import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
 
export default function ContextMenu({id, name, top, left, right, bottom, ...props}) {
  const { setNodes, setEdges } = useReactFlow();
 
  const hideNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);
 
  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <p style={{ margin: '0.5em' }}>
        <small>{name}</small>
      </p>
      <button onClick={hideNode}>hide</button>
    </div>
  );
}