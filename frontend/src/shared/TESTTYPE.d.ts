// wails.d.ts
export {};

declare global {
    interface Window {
        runtime: {
            EventsOn: (event: string, callback: (data?: any) => void) => void;
            EventsOff: (event: string, callback?: (data?: any) => void) => void;
            EventsEmit: (event: string, data?: any) => void;
        };
    }
}
