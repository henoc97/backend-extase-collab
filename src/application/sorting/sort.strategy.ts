import { ITask } from "../../domain/entities/task";

export interface SortStrategy {
    sort(tasks: ITask[]): ITask[];
} 