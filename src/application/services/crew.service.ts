import CrewModel, { ICrew } from "../../domain/entities/crew";

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
        const crew = new CrewModel(crewData);
        return await crew.save();
    }

    public async getCrewById(crewId: string): Promise<ICrew | null> {
        return await CrewModel.findById(crewId);
    }

    public async updateCrew(crewId: string, updateData: any): Promise<ICrew | null> {
        return await CrewModel.findByIdAndUpdate(crewId, updateData, { new: true });
    }

    public async deleteCrew(crewId: string): Promise<ICrew | null> {
        return await CrewModel.findByIdAndDelete(crewId);
    }
}

export default CrewService.getInstance();
