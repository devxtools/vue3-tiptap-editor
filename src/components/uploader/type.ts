export enum EnumAccept {
    media = 'image/*, video/*',
    image = 'image/*',
    video = 'video/*',
    audio = 'audio/mpeg, audio/wav, audio/ogg, audio/webm',
    file = 'application/pdf, application/msword, text/plain, application/zip, application/x-rar-compressed, application/json, text/javascript, text/html, application/octet-stream, font/ttf, font/woff',
    iframe = 'iframe'
}

export type Accept = EnumAccept.image | EnumAccept.video | EnumAccept.file | EnumAccept.iframe | string;

export type Options = {
    name?: string;
    accept?: Accept;
    tip?: string;
    placeholder?: string;
    icon?: string;
}

export enum EnumStatus {
    ready = 'ready',
    file = 'file',
    uploading = 'uploading',
    success = 'success',
    error = 'error'
}
export enum EnumMediaType {
    media = 'media', // 表示还不确定是什么类型，表示另外3种都可能，得等上传后才知道！
    image = 'image',
    video = 'video',
    audio = 'audio',
    iframe = 'iframe',
    youtube = 'youtube'
}

export type Status = EnumStatus.ready | EnumStatus.file | EnumStatus.uploading | EnumStatus.success | EnumStatus.error;
export type MediaType = EnumMediaType.media | EnumMediaType.image | EnumMediaType.video | EnumMediaType.iframe | EnumMediaType.youtube;