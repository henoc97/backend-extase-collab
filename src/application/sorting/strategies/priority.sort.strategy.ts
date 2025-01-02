import { SortStrategy } from "../sort.strategy";
import { Task } from "../../../domain/entities/task.entity";

export class PrioritySortStrategy implements SortStrategy {
    sort(tasks: Task[]): Task[] {
        return tasks.sort((a, b) => {
            const priorityOrder = { 'Urgent': 1, 'Normal': 2, 'Low': 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }
} 