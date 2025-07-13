import { Folder } from 'lucide-react';

export default function Sidebar({handleSelectFolder}) { // on click, invoke handleSelectFolder
  return (
    <div className="sidebar">
        <button onClick={handleSelectFolder}>
            <Folder size={18} />
            Select folder
        </button>
    </div>
  );
}