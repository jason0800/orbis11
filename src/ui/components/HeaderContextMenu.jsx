import { useState, useEffect } from "react";

export default function HeaderContextMenu(props) {
  const [showInput, setShowInput] = useState(false);
  const [fileName, setFileName] = useState("");

  const {
    id,
    position,
    dirPath,
    handleHideNode,
    handleCopyPath,
    handleCreateFile
  } = props;

  useEffect(() => {
    setShowInput(false);
    setFileName("");
  }, [id, position]);

  return (
    <div
      className="context-menu"
      style={{ top: position.y, left: position.x - 200 }}
    >
      <div onClick={() => handleCopyPath(dirPath)} onMouseEnter={()=>setShowInput(false)} >Copy Path</div>
      <div onClick={() => handleHideNode(id)} onMouseEnter={()=>setShowInput(false)}>Hide Node</div>

      <div
        className="create-file-option"
        onClick={()=>setShowInput(true)}
      >
        Create File
        {
          showInput && 
          <input
            className={`create-file-input`}
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="enter file name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateFile(dirPath, fileName)
              }
            }}
          />
        }
      </div>
    </div>
  );
}
