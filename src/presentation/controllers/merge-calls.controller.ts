import projectService from '../../application/services/project.service';
import taskService from '../../application/services/task.service';
import crewService from '../../application/services/crew.service';


class MergeCallsController {

    public constructor() { }

    public dashboadRequests = async (req: any, res: any): Promise<void> => {
        try {

            const [projectsCount, activeTasksCount, completedTasksCount, recentProjects, allMembers, upcomingDeadlines] = await Promise.all([
                projectService.getProjectCountByCreatorId(req.user.id),
                taskService.getActiveTasksCount(req.user.id),
                taskService.getCompletedTasksCount(req.user.id),
                projectService.getRecentProjects(req.user.id),
                crewService.getAllMembersByCrewDirector(req.user.id),
                taskService.getUpcomingDeadlines(req.user.id),
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

export default new MergeCallsController();