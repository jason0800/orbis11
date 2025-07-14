import { useState } from 'react';
import { useReactFlow, applyNodeChanges } from '@xyflow/react';

export default function useFlowHandlers() {  // module
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [menu, setMenu] = useState(null)
  const { screenToFlowPosition } = useReactFlow();

  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));

    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    window.electronAPI.scanFolder(data.subfolderPath)
      .then((response) => {
        const newNode = {
          id: response.folderId,
          data: {
            label: response.folderName,
            files: response.files,
            subfolders: response.subfolders,
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
  };

  const handleSelectFolder = async () => {
    const response = await window.electronAPI.selectFolder();
    if (response) {
      const { folderId, folderName, files, subfolders } = response;

      const rootNode = [{
        id: folderId,
        position: { x: 100, y: 100 },
        data: { label: folderName, files, subfolders, parentId: null },
        type: "folderNode"
      }];
      setNodes(rootNode);
    }
  };

  const onPaneClick = (e) => {
    console.log("Clicked on pane, e:", e)
    setMenu(null)
  }

  const onMoveStart = (e) => {
    console.log("moving pane, e: ", e)
    setMenu(null)
  }

  // const onContextMenu = (e, node) => {
  //   e.preventDefault()
  //   console.log(e.dataTransfer.setData)

  //   const position = {
  //     x: e.clientX,
  //     y: e.clientY,
  //   };

  //   console.log("x, y: ", position.x, position.y)

  //   console.log(node)
  //   setMenu({label: node.data.label, position: position})
  // }

  const handleHideNode = (id) => {
    console.log("in handleHideNode, id: ", id)

    const unhiddenNodes = (nodes.filter((node) => node.id !== id))
    setNodes(unhiddenNodes)
    
    setMenu(null)
  }

  function handleHeaderContextMenu(e, id) {
    console.log("open menu")
    console.log("e and id: ", e, id)

    e.preventDefault()

    const position = {
      x: e.clientX,
      y: e.clientY,
    };

    setMenu({id: id, position: position})
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
  };
}
