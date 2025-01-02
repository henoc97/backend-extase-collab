import { IObserver } from "./observer";

export interface IObserverService {
    notify(observers: IObserver[], title: string, content: string): void // any = IObserver
}

