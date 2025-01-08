import { SortStrategy } from "../sort.strategy";
import { Task } from "../../../domain/entities/task.entity";

export class PrioritySortStrategy implements SortStrategy {
    sort(tasks: Task[]): Task[] {
        return tasks.sort((a, b) => {
            const priorityOrder = { 'urgent': 1, 'high': 2, 'medium': 3, 'low': 4 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }
} 