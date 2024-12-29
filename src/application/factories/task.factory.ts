import TaskModel, { ITask } from "../../domain/entities/task";

class TaskFactory {
    // Méthode pour créer une tâche en fonction de la priorité
    public static createTask(taskData: any): ITask {
        // Vous pouvez ajouter des logiques spécifiques ici en fonction de la priorité
        const task = new TaskModel(taskData);
        return task;
    }
}

export default TaskFactory; 