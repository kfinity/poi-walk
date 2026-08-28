import { IControl, Map } from 'maplibre-gl';
type CompassControlOptions = {
    debug?: boolean;
    visible?: boolean;
    timeout?: number;
};
export declare class CompassControl implements IControl {
    private map;
    private container;
    private compass;
    private compassButton;
    private debugView;
    private options;
    private active;
    private currentEvent;
    private turnonCallback;
    private turnoffCallback;
    private errorCallback;
    private compassCallback;
    constructor(options?: CompassControlOptions);
    onAdd(map: Map): HTMLDivElement;
    onRemove(): void;
    on(type: string, callback: any): void;
    turnOn(): void;
    turnOff(): void;
    private updateDebugView;
    private clearDebugView;
    private disable;
}
export {};
