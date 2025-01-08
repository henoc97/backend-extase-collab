import ProjectService from '../../application/services/project.service';
import CrewService from '../../application/services/crew.service';
import TaskService from '../../application/services/task.service';
import { Server } from 'socket.io';


export class MergeCallsController {
    private crewService = CrewService;
    private projectService = ProjectService;
    private taskService: TaskService;

    public constructor(io: Server) {
        this.taskService = TaskService.getInstance(io);
    }

    public dashboadRequests = async (req: any, res: any): Promise<void> => {
        try {

            const [projectsCount, activeTasksCount, completedTasksCount, recentProjects, allMembers, upcomingDeadlines] = await Promise.all([
                this.projectService.getProjectCountByCreatorId(req.user.id),
                this.taskService.getActiveTasksCount(req.user.id),
                this.taskService.getCompletedTasksCount(req.user.id),
                this.projectService.getRecentProjects(req.user.id),
                this.crewService.getAllMembersByCrewDirector(req.user.id),
                this.taskService.getUpcomingDeadlines(req.user.id),
            ]);

            res.status(200).json({
                projectsCount, activeTasksCount, completedTasksCount, recentProjects, allMembers, upcomingDeadlines
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }
}