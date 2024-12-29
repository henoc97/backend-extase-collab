import { SortStrategy } from "./sort.strategy";
import { ITask } from "../../domain/entities/task";

export class DateSortStrategy implements SortStrategy {
    sort(tasks: ITask[]): ITask[] {
        return tasks.sort((a, b) => {
            return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
        });
    }
} 