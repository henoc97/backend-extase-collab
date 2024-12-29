import { Request, Response } from 'express';
import CrewService from '../../application/services/crew.service';
import { ICrew } from '../../domain/entities/crew';

class CrewController {
    private crewService = CrewService;

    public async createCrew(req: Request, res: Response): Promise<Response> {
        try {
            const crewData: ICrew = req.body;
            const crew = await this.crewService.createCrew(crewData);
            return res.status(201).json(crew);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async getCrewById(req: Request, res: Response): Promise<Response> {
        try {
            const crewId = req.params.id;
            const crew = await this.crewService.getCrewById(crewId);
            if (!crew) {
                return res.status(404).json({ message: 'Crew not found' });
            }
            return res.json(crew);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async updateCrew(req: Request, res: Response): Promise<Response> {
        try {
            const crewId = req.params.id;
            const updateData = req.body;
            const updatedCrew = await this.crewService.updateCrew(crewId, updateData);
            if (!updatedCrew) {
                return res.status(404).json({ message: 'Crew not found' });
            }
            return res.json(updatedCrew);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async deleteCrew(req: Request, res: Response): Promise<Response> {
        try {
            const crewId = req.params.id;
            const deletedCrew = await this.crewService.deleteCrew(crewId);
            if (!deletedCrew) {
                return res.status(404).json({ message: 'Crew not found' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new CrewController();
