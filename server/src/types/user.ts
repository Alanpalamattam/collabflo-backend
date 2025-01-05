export enum USER_CONNECTION_STATUS {
    ONLINE = 'online',
    OFFLINE = 'offline',
}

export interface User {
    currentDir(currentDir: any, targetDir: any): unknown;
    username: string;
    roomId: string;
    status: USER_CONNECTION_STATUS;
    cursorPosition: number;
    typing: boolean;
    socketId: string;
    currentFile: string | null;
}
