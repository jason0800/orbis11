import { Folder, FileText, Plus } from 'lucide-react';

export default function Sidebar({handleSelectFolder}) {
  return (
    <div className="sidebar">
        <button onClick={handleSelectFolder}>
            <Folder size={18} />
            Select folder
        </button>
    </div>
  );
}