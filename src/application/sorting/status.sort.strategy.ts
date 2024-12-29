import { SortStrategy } from "./sort.strategy";
import { ITask } from "../../domain/entities/task";

export class StatusSortStrategy implements SortStrategy {
    sort(tasks: ITask[]): ITask[] {
        return tasks.sort((a, b) => {
            const statusOrder = { 'pending': 1, 'in progress': 2, 'completed': 3 };
            return statusOrder[a.status] - statusOrder[b.status];
        });
    }
} 