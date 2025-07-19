import { useState, useCallback } from 'react';
import { useReactFlow, applyNodeChanges } from '@xyflow/react';

export default function useFlowHandlers() {  // module
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [headerContextMenu, setHeaderContextMenu] = useState(null)
  const [fileContextMenu, setFileContextMenu] = useState(null)
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
    setHeaderContextMenu(null)
    setFileContextMenu(null)
  };

  const onPaneClick = () => {
    setHeaderContextMenu(null)
    setFileContextMenu(null)
  }

  const onMoveStart = () => {
    setHeaderContextMenu(null)
    setFileContextMenu(null)
  }

  ///////////////////// Folder Header Context Menu Handlers ////////////////////////////

  // handler to open header context menu when r-clicking on folder node header
  const handleHeaderContextMenu = useCallback((e, id, dirPath) => {
    e.preventDefault()
    setFileContextMenu(null)
    setHeaderContextMenu(null)

    const position = {
      x: e.clientX,
      y: e.clientY,
    };

    setHeaderContextMenu({id, dirPath, position})
  }, [])

  const handleHideNode = (id) => {
    const unhiddenNodes = (nodes.filter((node) => node.id !== id))
    setNodes(unhiddenNodes)
    
    setHeaderContextMenu(null)
  }

  const handleCopyPath = (dirPath) => {
    window.electronAPI.copyToClipboard(dirPath)
    setHeaderContextMenu(null)
  }

  const handleCreateFile = (dirPath, fileName) => {
    console.log("in handleCreateFile: ", dirPath, fileName)
    window.electronAPI.createFile(dirPath, fileName).then(()=>handleRefresh())
    setHeaderContextMenu(null)
  }

  //////////////////////////////////////////////////////////////////////

  //////////// File Context Menu Handlers //////////////////////////////

  // handler to open file context menu when r-clicking on file
  const handleFileContextMenu = useCallback((e, filePath) => {
    e.preventDefault()
    setHeaderContextMenu(null)
    setFileContextMenu(null)

    const position = {
      x: e.clientX,
      y: e.clientY,
    }

    setFileContextMenu({position: position, filePath})
  }, [])
  
  const handleRenameFile = (filePath) => {
    console.log("in handleRenameFile: ", filePath)

    setFileContextMenu(null)
  }
  
  const handleDeleteFile = (filePath) => {
    console.log("in handleDeleteFile: ", filePath)

    window.electronAPI.deleteFile(filePath).then(()=>handleRefresh())
    setFileContextMenu(null)
  }
  /////////////////////////////////////////////////////////////////////////

  async function handleRefresh() {
    const refreshedNodes = await Promise.all(
      nodes.map(async (node) => {
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
      return refreshedNode
    }))
    setNodes(refreshedNodes)
  }

  return {
    nodes,
    edges,
    headerContextMenu,
    fileContextMenu,
    handleDrop,
    handleDragOver,
    onNodesChange,
    handleSelectFolder,
    onPaneClick,
    onMoveStart,
    handleHideNode,
    handleHeaderContextMenu,
    handleFileContextMenu,
    handleCopyPath,
    handleCreateFile,
    handleDeleteFile,
    handleRenameFile,
    handleRefresh,
  };
}
