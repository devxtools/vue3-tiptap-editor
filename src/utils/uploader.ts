/**
 * @description Uploader 上传插件，支持分片上传, 默认根网络在上传前动态调整分片大小
 */

export type formDataHookContext = {
    file: File
    isChunked: boolean
    chunkIndex?: number
    totalChunks?: number
    isLast?: boolean
}

export type UploaderOptions = {
    url: string
    debug?: boolean;
    chunkSize?: number // 默认 1MB
    headers?: Record<string, string>
    data?: Record<string, string> // 附加字段
    onProgress?: (percent: number, loaded: number, total: number) => void
    onSuccess?: (response: { code: number, data?: Record<string, any>|null, msg?: string } & any) => void
    onError?: (error: any) => void
    formDataHook?: (formData: FormData, context: formDataHookContext) => void
}

type UploaderFile = File & { uid?: string };
export default class Uploader {
    file: UploaderFile
    options: UploaderOptions
    chunkSize: number
    totalChunks: number
    currentChunk = 0
    xhrList: XMLHttpRequest[] = []
    aborted = false
    isChunked: boolean
    uid: string
    debug: boolean
    constructor(file: UploaderFile, options: UploaderOptions) {
        this.debug = options.debug as boolean;
        this.file = file;
        this.options = options
        this.isChunked = file.size > 3 * 1024 * 1024 // > 3MB 开启分片
        this.chunkSize = options.chunkSize || this.getChunkSize(file.size) // 默认由getChunkSize 态调整分片大小
        this.totalChunks = this.isChunked ? Math.ceil(file.size / this.chunkSize) : 1
        this.uid = this.genUploadId();
        this.file.uid = this.uid;
        this.debug && console.log('每片',this.chunkSize / 1024 / 1024, 'MB');
    }

    /**
     * 
     * @param fileSize 默认动态调整分片大小
     * @returns 
     */
    getChunkSize(fileSize: number): number {
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        let baseSize = 1024 * 1024; // 默认 1MB
        if (connection?.effectiveType === '4g') {
            baseSize = 2 * 1024 * 1024; // 快网速：2MB
        } else if (connection?.effectiveType === '3g') {
            baseSize = 1 * 1024 * 1024;
        } else if (connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g') {
            baseSize = 512 * 1024; // 慢网速：512KB
        }
        // 再根据文件大小适配（防止过多请求）
        if (fileSize <= 10 * 1024 * 1024) {
            return Math.min(baseSize, 512 * 1024); // 小文件不需要太大 chunk
        }
        return baseSize;
    }

    genUploadId() {
        return 'up-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    }

    async start() {
        this.aborted = false;
        if (this.isChunked) {
            this.uploadNextChunk()
        } else {
            this.uploadSingle()
        }
    }

    abort() {
        this.aborted = true
        this.xhrList.forEach(xhr => xhr.abort())
        this.xhrList = []
    }

    private uploadSingle() {
        const xhr = new XMLHttpRequest()
        const formData = new FormData()
        formData.append('file', this.file)
        formData.append('name', this.file.name)

        if (this.options.data) {
            Object.entries(this.options.data).forEach(([key, value]) => {
                formData.append(key, value)
            })
        }

        // 自定义处理 FormData
        this.options.formDataHook?.(formData, {
            file: this.file,
            isChunked: false,
        })

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                this.options.onProgress?.((e.loaded / e.total) * 100, e.loaded, e.total)
            }
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.response);
                    this.options.onSuccess?.(response);
                } catch (error) {
                    this.options.onError?.(error);
                }
            } else {
                this.options.onError?.(xhr)
            }
        }

        xhr.onerror = () => this.options.onError?.(xhr)

        xhr.open('POST', this.options.url)
        this.setHeaders(xhr)
        xhr.send(formData)

        this.xhrList.push(xhr)
    }

    private uploadNextChunk() {
        if (this.aborted || this.currentChunk >= this.totalChunks) return;
        const start = this.currentChunk * this.chunkSize;
        const end = Math.min(start + this.chunkSize, this.file.size);
        const chunkBlob = this.file.slice(start, end);
        const chunk = new File([chunkBlob], this.file.name, {
            type: this.file.type,
        }) as UploaderFile;
        chunk.uid = this.uid;
        const formData = new FormData();
        formData.append('guid', this.uid);
        formData.append('name', this.file.name);
        formData.append('file', chunk);
        formData.append('size', this.file.size.toString());
        // formData.append('chunkIndex', this.currentChunk.toString()) // 分片的第几片
        // formData.append('totalChunks', this.totalChunks.toString()) // 总分片数量
        // formData.append('isLast', (this.currentChunk === this.totalChunks - 1).toString())

        if (this.options.data) {
            Object.entries(this.options.data).forEach(([key, value]) => {
                formData.append(key, value)
            })
        }
        
        // 自定义处理 FormData
        this.options.formDataHook?.(formData, {
            file: this.file,
            isChunked: true,
            chunkIndex: this.currentChunk,
            totalChunks: this.totalChunks,
            isLast: this.currentChunk === this.totalChunks - 1,
        })

        const xhr = new XMLHttpRequest()
        this.xhrList.push(xhr)

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const loaded = this.currentChunk * this.chunkSize + e.loaded
                const percent = (loaded / this.file.size) * 100
                this.options.onProgress?.(percent, loaded, this.file.size)
            }
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                this.currentChunk++
                if (this.currentChunk < this.totalChunks) {
                    this.uploadNextChunk()
                } else {
                    try {
                        const response = JSON.parse(xhr.response);
                        this.options.onSuccess?.(response);
                    } catch (error) {
                        this.options.onError?.(error);
                    }
                }
            } else {
                this.options.onError?.(xhr)
            }
        }

        xhr.onerror = () => this.options.onError?.(xhr)

        xhr.open('POST', this.options.url)
        this.setHeaders(xhr)
        xhr.send(formData)
    }

    private setHeaders(xhr: XMLHttpRequest) {
        if (this.options.headers) {
            Object.entries(this.options.headers).forEach(([key, val]) => {
                xhr.setRequestHeader(key, val)
            })
        }
    }
}
  
export function useUploader(file: File, options: UploaderOptions) {
    return new Uploader(file, options);
}