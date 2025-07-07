import path from "node:path"
import fs from "node:fs";
import { v4 as uuidv4 } from 'uuid';

function formatBytes(bytes) {
  if (bytes === 0) return '0 b';

  const k = 1000;
  const sizes = ['b', 'kb', 'mb', 'gb', 'tb'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

  return `${size} ${sizes[i]}`;
}

export function isDev() {
    return globalThis.process.env.NODE_ENV === 'development';
}

export function scanFolders(dirPath, parentId = null, folders = [], folderId) {
    if (!folderId) {
        folderId = 'root'
    }

    const items = fs.readdirSync(dirPath)
    const files = []
    const subfolders = []

    items.forEach((item) => {
        const itemPath = path.join(dirPath, item)
        const stats = fs.statSync(itemPath)
        console.log("ITEM PATH:", itemPath)

        if (stats.isDirectory()) {
            subfolders.push({
                path: itemPath,
                id: uuidv4().substring(20)
        })} else if (stats.isFile()) {
            files.push({
                name: path.basename(itemPath),
                size: formatBytes(stats.size),
                path: itemPath
            })
        }
    })

    folders.push({
        id: folderId,
        parentId: parentId,
        name: path.basename(dirPath),
        files: files,
        isEndNode: subfolders.length === 0
    })

    subfolders.forEach((subfolder) => {
        scanFolders(subfolder.path, folderId, folders, subfolder.id)
    })

    return folders
}