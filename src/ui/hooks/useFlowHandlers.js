import { useState, useCallback } from 'react';
import { useReactFlow, applyNodeChanges } from '@xyflow/react';

export default function useFlowHandlers() {  // module
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [menu, setMenu] = useState(null)
  const { screenToFlowPosition } = useReactFlow();

  // handler for when user selects folder from sidebar
  const handleSelectFolder = async () => {
    const response = await window.electronAPI.selectFolder();
    if (response) {
      const { dirPath, folderId, folderName, files, subfolders } = response;

      const rootNode = [{
        id: folderId,
        position: { x: 100, y: 100 },
        data: {
          dirPath: dirPath,
          label: folderName,
          files: files,
          subfolders: subfolders,
          parentId: null
        },
        type: "folderNode"
      }];
      setNodes(rootNode);
    }
  };

  // handler function for when user drags and drops a folder node
  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));

    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    window.electronAPI.scanFolder(data.subfolderPath)
      .then((response) => {
        console.log("response in handleDrop: ", response)
        const { dirPath, folderId, folderName, files, subfolders } = response;

        const newNode = {
          id: folderId,
          data: {
            dirPath: dirPath,
            label: folderName,
            files: files,
            subfolders: subfolders,
            parentId: data.parentId,
          },
          position,
          type: "folderNode"
        };

        const nodeAlreadyExists = nodes.some((node) =>
          newNode.data.label === node.data.label && newNode.parentId === node.parentId
        );

        if (!nodeAlreadyExists) {
          const newNodes = nodes.concat(newNode);
          const newEdges = newNodes.map((node) => ({
            id: `${node.data.parentId}->${node.id}`,
            source: node.data.parentId,
            target: node.id
          }));
          setNodes(newNodes);
          setEdges(newEdges);
        } else {
          alert("folder node already exists :(");
        }
      });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const onNodesChange = (changes) => {
    setNodes(applyNodeChanges(changes, nodes)) // applyNodeChanges returns array of updated nodes
    setMenu(null)
  };

  const onPaneClick = (e) => {
    console.log("Clicked on pane, e:", e)
    setMenu(null)
  }

  const onMoveStart = (e) => {
    console.log("moving pane, e: ", e)
    setMenu(null)
  }

  const handleHideNode = (id) => {
    console.log("in handleHideNode, id: ", id)

    const unhiddenNodes = (nodes.filter((node) => node.id !== id))
    setNodes(unhiddenNodes)
    
    setMenu(null)
  }

  const handleHeaderContextMenu = useCallback((e, id, dirPath) => {
    e.preventDefault()

    const position = {
      x: e.clientX,
      y: e.clientY,
    };

    setMenu({id: id, dirPath: dirPath, position: position})
  }, [])

  const handleCopyPath = (dirPath) => {
    console.log("in handleCopyPath, dirPath: ", dirPath)
    window.electronAPI.copyToClipboard(dirPath)

    setMenu(null)
  }

  return {
    nodes,
    edges,
    menu,
    handleDrop,
    handleDragOver,
    onNodesChange,
    handleSelectFolder,
    onPaneClick,
    onMoveStart,
    handleHideNode,
    handleHeaderContextMenu,
    handleCopyPath,
  };
}
