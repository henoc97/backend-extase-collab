import { SortStrategy } from "../sort.strategy";
import { Task } from "../../../domain/entities/task.entity";

export class StatusSortStrategy implements SortStrategy {
    sort(tasks: Task[]): Task[] {
        return tasks.sort((a, b) => {
            const statusOrder = { 'pending': 1, 'in progress': 2, 'completed': 3 };
            return statusOrder[a.status] - statusOrder[b.status];
        });
    }
} 