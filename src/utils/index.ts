export function toKebabCase(str: string) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // camelCase → kebab
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // 防止 ABCDef → abc-def
        .toLowerCase()
}
  
export function detectMediaType(input: string) {
    if (typeof input !== 'string') return null

    const lower = input.toLowerCase().trim()
    if (input.startsWith('image/')) return 'image';
    if (input.startsWith('video/')) return 'video';
    if (input.startsWith('audio/')) return 'audio';
    // ✅ 判断是否为 YouTube 链接
    const isYouTube = /(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/.test(lower)
    if (isYouTube) return 'youtube';

    // ✅ 判断是否为图片
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
    if (imageExts.some(ext => lower.endsWith(ext))) return 'image';

    // ✅ 判断是否为视频
    const videoExts = ['.mp4', '.webm', '.ogg', '.mov', '.m4v']
    if (videoExts.some(ext => lower.endsWith(ext))) return 'video';

    return 'file'
}
  
export function getFileSizeMB(size: number) {
    if (!size) return 0;
    return (size / (1024 * 1024)).toFixed(2)+'MB' // 返回单位：MB
}
  
export function isAudioFile(file: File): boolean {
    return file.type.startsWith('audio/');
}

export function clearSpaces(str: string) {
    return str.replace(/\s/g, '');
}

export function getFileExtension(url: string): string {
    try {
        const pathname = new URL(url).pathname;
        const lastPart = pathname.split('/').pop();
        const ext = lastPart?.includes('.') ? lastPart.split('.').pop() : '';
        return ext?.toLowerCase() as string;
    } catch (e) {
        return '';
    }
}