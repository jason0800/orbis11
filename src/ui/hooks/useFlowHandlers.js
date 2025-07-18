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
        type: "folderNode",
        style: {
          width: 260,     // match your min-width
          height: 200,    // match your min-height
        },
      }];
      setNodes(rootNode);
    }
  };

  // handler for when user drags and drops a folder node
  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));

    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    window.electronAPI.scanFolder(data.subfolderPath)
      .then((response) => {
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
          type: "folderNode",
          style: {
            width: 260,     // match your min-width
            height: 200,    // match your min-height
          },
        };

        const nodeAlreadyExists = nodes.some((n) => (
          dirPath === n.data.dirPath
        ))

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
          alert("The folder node already exists 😔");
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

  // Folder Header Context Menu Handlers

  const onPaneClick = () => {
    setMenu(null)
  }

  const onMoveStart = () => {
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

  const handleHideNode = (id) => {
    const unhiddenNodes = (nodes.filter((node) => node.id !== id))
    setNodes(unhiddenNodes)
    
    setMenu(null)
  }

  const handleCopyPath = (dirPath) => {
    window.electronAPI.copyToClipboard(dirPath)
    setMenu(null)
  }

  const handleCreateFile = (dirPath) => {
    window.electronAPI.createFile(dirPath)
    handleRefresh()
    setMenu(null)
  }

  async function handleRefresh() {
    console.log("handle refresh") // re-scan all displayed nodes

    const refreshedNodes = await Promise.all(
      nodes.map(async (node) => {
        console.log("node: ", node)

        const response = await window.electronAPI.scanFolder(node.data.dirPath)
        const { files, subfolders } = response
        const refreshedNode = {
          ...node,
          data: {
            ...node.data,
            files,
            subfolders,
          }
      };
      console.log("refreshedNode: ", refreshedNode)
      return refreshedNode
    }))

    console.log("refreshedNodes: ", refreshedNodes)
    setNodes(refreshedNodes)
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
    handleCreateFile,
    handleRefresh,
  };
}
