import { ITask } from "../../domain/entities/task.entity";

export interface SortStrategy {
    sort(tasks: ITask[]): ITask[];
} 