import { useState } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css'

 
const fileNode = [
  { id: '1', position: { x: 50, y: 50 }, data: { label: 'hello.txt' } }
];
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function App() {
  const [pong, setPong] = useState("")
  const [fileName, setFileName] = useState("")

  const handleClick = () => {
    window.electronAPI.ping().then((response) => {
      console.log(response)

      if (pong) {
        setPong("")
      } else {
        setPong(response)
      }
    });
  }

  const handleDrop = (event) => {
    event.preventDefault()

    const droppedFile = event.dataTransfer.files[0].name
    setFileName(droppedFile)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  return (
    <>
      <button onClick={handleClick}>Ping</button>
      <p>{pong}</p>

      <p>{fileName}</p>

      <div 
        style={{ width: '400px', height: '300px', border: 'solid blue'}}
        id="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="drop-zone"
      >
        <ReactFlow
          nodes={fileNode}
          // edges={initialEdges}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  )
}
