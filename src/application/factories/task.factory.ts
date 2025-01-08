import TaskModel, { Task } from "../../domain/entities/task.entity";

class TaskFactory {
    // Méthode pour créer une tâche en fonction de la priorité
    public static createTask(taskData: any): Task {
        // Vous pouvez ajouter des logiques spécifiques ici en fonction de la priorité
        const task = new Task(taskData);
        console.log("task created in factory: ", task);
        return task;
    }
}

export default TaskFactory; 