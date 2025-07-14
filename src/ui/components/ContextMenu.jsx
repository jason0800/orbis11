export default function ContextMenu(props) {
  console.log("PROPS: ", props)
  const { id, position, handleHideNode } = props

  return (
    <div className="context-menu" style={{ top: position.y, left: position.x - 200 }}>
      <div onClick={()=>handleHideNode(id)}>Hide Node</div>
      <div onClick={() => console.log(`Option 2`)}>Option 2</div>
    </div>
  );
}