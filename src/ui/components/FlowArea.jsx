import { useMemo } from 'react'
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import useFlowHandlers from '../hooks/useFlowHandlers';
import FolderNode from './FolderNode';
import Sidebar from './SideBar';
import ContextMenu from './ContextMenu';

export default function FlowArea() {
  const {
    nodes,
    edges,
    menu,
    handleDrop,
    handleDragOver,
    onNodesChange,
    handleSelectFolder,
    onPaneClick,
    onMoveStart,
    handleHeaderContextMenu,
    handleHideNode,
    handleCopyPath,
  } = useFlowHandlers();

  const nodeTypes = useMemo(() => ({
    folderNode: (nodeProps) => (
      <FolderNode {...nodeProps} handleHeaderContextMenu={handleHeaderContextMenu} />
    )
  }), [handleHeaderContextMenu]);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar handleSelectFolder={handleSelectFolder} />
      <div
        style={{ flexGrow: 1, height: '100vh', position: 'relative' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          minZoom={0.1}
          maxZoom={2}
          style={{ width: '100%', height: '100%' }}
          onPaneClick={onPaneClick}
          onMoveStart={onMoveStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Background />
          <Controls />
          <MiniMap />
          {menu &&
          <ContextMenu
            {...menu}
            handleHideNode={handleHideNode}
            handleCopyPath={handleCopyPath}
          />}
        </ReactFlow>
      </div>
    </div>
  );
}