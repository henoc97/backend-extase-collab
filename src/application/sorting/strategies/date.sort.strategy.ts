import { SortStrategy } from "../sort.strategy";
import { Task } from "../../../domain/entities/task.entity";

export class DateSortStrategy implements SortStrategy {
    sort(tasks: Task[]): Task[] {
        return tasks.sort((a, b) => {
            return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
        });
    }
} 