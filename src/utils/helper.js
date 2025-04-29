export function getFileNameFromPath(path) {
  if (!path || typeof path !== 'string') return ''; 

  const pathSegments = path.split('/');
  return pathSegments[pathSegments.length - 1];
}


export function downloadFile(filename) {
  const anchor = document.createElement('a');
  anchor.href = filename;
  anchor.target = '_blank';
  anchor.download = filename;
  anchor.click();
  anchor.remove();
};


export const replaceLineBreaks = (text) => {
  if (!text) return '';
  return text.replace(/\r\n/g, '<br />');
};
