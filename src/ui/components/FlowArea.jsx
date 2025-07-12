import { ReactFlow, Background, Controls } from '@xyflow/react';
import useFlowHandlers from '../hooks/useFlowHandlers';
import FolderNode from './FolderNode';
import Sidebar from './SideBar';

export default function FlowArea() {
  const {
    nodes,
    edges,
    handleDrop,
    handleDragOver,
    onNodesChange,
    handleSelectFolder
  } = useFlowHandlers();

  const nodeTypes = {
    folderNode: FolderNode,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar handleSelectFolder={handleSelectFolder} />
      <div style={{ flexGrow: 1, height: '100vh' }} onDrop={handleDrop} onDragOver={handleDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          minZoom={0.1}
          maxZoom={2}
          style={{ width: '100%', height: '100%' }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}