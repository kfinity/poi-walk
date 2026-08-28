export type CompassEvent = {
    heading: number | undefined;
    originalEvent: WebkitDeviceOrientationEvent;
};
export type CompassError = {
    code: 'TIMEOUT' | 'PERMISSION_DENIED';
    message: string;
};
export type WebkitDeviceOrientationEvent = DeviceOrientationEvent & {
    webkitCompassHeading?: number;
    webkitCompassAccuracy?: number;
};
export declare class Compass {
    private static readonly eventTypes;
    private deviceOrientationCallback;
    private errorCallback;
    private isListening;
    private historySize;
    private headingHistory;
    on(type: (typeof Compass.eventTypes)[number], callback: ((event: CompassEvent) => void) | ((error: CompassError) => void)): void;
    turnOn(): void;
    turnOff(): void;
    private addDeviceOrientationListener;
    private removeDeviceOrientationListener;
    private addDeviceOrientationAbsoluteListener;
    private removeDeviceOrientationAbsoluteListener;
    private onDeviceOrientation;
    private calculateCompassHeading;
    private calculateMovingAverage;
    private handleError;
}
