export enum USER_CONNECTION_STATUS {
    OFFLINE = "offline",
    ONLINE = "online",
}
export enum USER_ROLE {
    CREATOR = "creator",
    EDITOR = "editor",
    VIEWER = "viewer"
  }
  
export interface User {
    username: string;
    roomId: string;
    status: USER_CONNECTION_STATUS;
    cursorPosition: number;
    typing: boolean;
    socketId: string;
    currentFile: string | null;
    currentDir: unknown;
    role?: USER_ROLE; // Add role to existing User interface
  }