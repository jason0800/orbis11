export default function FileContextMenu(props) {
    const {
        position,
        filePath,
        handleRenameFile,
        handleDeleteFile,
    } = props;

    return (
        <div
            className="context-menu"
            style={{ top: position.y, left: position.x - 200 }}
        >
            <div onClick={() => handleRenameFile(filePath)}>Rename</div>
            <div onClick={() => handleDeleteFile(filePath)} >Delete</div>
        </div>
    );
}
