export declare class CompassButton {
    private button;
    private clickCallback;
    constructor(parent: HTMLElement, visible?: boolean);
    on(type: string, callback: () => void): void;
    turnOn(): void;
    turnOff(): void;
    disable(): void;
    startLoading(): void;
    stopLoading(): void;
    private createButton;
}
