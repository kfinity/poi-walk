import { CompassEvent } from '../core/Compass';
export declare class DebugView {
    private element;
    private eventTimestamps;
    constructor(parent: HTMLElement);
    update(e?: CompassEvent): void;
    private clear;
    private updateField;
}
