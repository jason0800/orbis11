export default function ContextMenu(props) {
  const {
    id,
    position,
    dirPath,
    handleHideNode,
    handleCopyPath,
    handleCreateFile
  } = props

  return (
    <div className="context-menu" style={{ top: position.y, left: position.x - 200 }}>
      <div onClick={() => handleCopyPath(dirPath)}>Copy Path</div>
      <div onClick={() => handleHideNode(id)}>Hide Node</div>
      <div onClick={() => handleCreateFile(dirPath)}>Create File</div>
    </div>
  );
}