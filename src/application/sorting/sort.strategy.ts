import { Task } from "../../domain/entities/task.entity";

export interface SortStrategy {
    sort(tasks: Task[]): Task[];
} 