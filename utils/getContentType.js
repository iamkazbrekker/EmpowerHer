import path from 'node:path'

const types = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml"
};

export const getContentType = (pathToResources) => {
    const ext = path.extname(pathToResources);
    const contentType = types[ext.toLowerCase()] || 'text/html';

    return contentType
}