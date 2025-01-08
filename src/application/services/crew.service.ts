import { model } from "mongoose";
import CrewModel, { ICrew } from "../../domain/entities/crew.entity";

class CrewService {
    private static instance: CrewService;

    private constructor() { }

    public static getInstance(): CrewService {
        if (!CrewService.instance) {
            CrewService.instance = new CrewService();
        }
        return CrewService.instance;
    }

    public async createCrew(crewData: any): Promise<ICrew> {
        const { tasks, ...crew } = crewData;
        const newCrew = new CrewModel(crew);
        const result = await newCrew.save();

        await CrewModel.updateOne(
            { _id: result._id },
            { $push: { tasks: tasks } }
        );
        return result;
    }

    public async getCrewById(crewId: string): Promise<ICrew | null> {
        return await CrewModel.findById(crewId).populate({ path: "tasks", model: "Task" }).exec();
    }

    public async getCrewsByTaskIds(taskIds: any[]): Promise<ICrew[]> {
        return await CrewModel.find({ tasks: { $in: taskIds } });
    }

    public async getCrewIds(userId: string): Promise<string[]> {
        // Recherchez les équipes où l'utilisateur est membre ou directeur
        const userTeams = await CrewModel.find({
            $or: [
                { crewDirector: "677977ad98ab6c28e7d8dab9" }, // L'utilisateur est directeur de l'équipe
                { members: { $in: ["677977ad98ab6c28e7d8dab9"] } } // L'utilisateur est membre de l'équipe
            ]
        });

        // Récupérez les IDs de ces équipes en tant que chaînes
        const teamIds = userTeams.map(team => team._id!.toString());
        console.log("teamIds: " + teamIds);
        return teamIds;
    }

    public async getAllMembersByCrewDirector(crewDirector: string): Promise<number> {
        const result = await CrewModel.find({ crewDirector: crewDirector }).populate(
            {
                path: "members",
                model: "User"
            }
        ) as ICrew[];
        return result.reduce((acc, curr) => acc + curr.members!.length, 0);
    }

    public async updateCrew(crewId: string, updateData: any): Promise<ICrew | null> {
        return await CrewModel.findByIdAndUpdate(crewId, updateData, { new: true });
    }


    public async deleteCrew(crewId: string): Promise<ICrew | null> {
        return await CrewModel.findByIdAndDelete(crewId);
    }
}

export default CrewService.getInstance();
