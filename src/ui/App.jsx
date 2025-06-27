import { useState } from 'react';
import './App.css'

function App() {
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

      <div
        id="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="drop-zone"
      >
        Drop File Here
      </div>
      <p>{fileName}</p>
    </>
  )
}

export default App
