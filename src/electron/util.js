import path from "node:path"
import fs from "node:fs"
import { v4 as uuidv4 } from 'uuid';

// function formatBytes(bytes) {
//   if (bytes === 0) return '0 b';

//   const k = 1000;
//   const sizes = ['b', 'kb', 'mb', 'gb', 'tb'];

//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

//   return `${size} ${sizes[i]}`;
// }

export function isDev() {
    return globalThis.process.env.NODE_ENV === 'development';
}

export function scanFolder(dirPath) {
    const folderName = path.basename(dirPath)
    const folderId = uuidv4().substring(20)
    const rawItems = fs.readdirSync(dirPath)
    const items = []

    rawItems.forEach((rawItem) => {
        const itemPath = path.join(dirPath, rawItem)
        const itemId = uuidv4().substring(20)
        const stats = fs.statSync(itemPath)
        console.log("ITEM PATH:", itemPath)

        if (stats.isDirectory()) {
            items.push({
                id: itemId,
                name: path.basename(itemPath),
                path: itemPath,
        })} else if (stats.isFile()) {
            items.push({
                id: itemId,
                name: path.basename(itemPath),
                // size: formatBytes(stats.size),
                path: itemPath
            })
        }
    })
    console.log(folderName, items)
    return { folderId, folderName, items }
}