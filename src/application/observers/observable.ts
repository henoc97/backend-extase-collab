import { IObserver } from "./observer";

// Interface Observable
export interface IObservable {
    subscribe(observer: IObserver): void;
    unsubscribe(observer: IObserver): void;
    notifyObservers(): void;
}
