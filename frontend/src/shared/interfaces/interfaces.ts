export interface WarningInterface {
    text: string;
    type: 'info' | 'warning' | 'error';
}

export interface BatFile {
    id: number;
    path: string;
}