import { Request, Response } from 'express';
import CrewService from '../../application/services/crew.service';
import { ICrew } from '../../domain/entities/crew.entity';
import { Server } from 'socket.io';

class CrewController {
    private crewService: CrewService;

    public constructor(io: Server) {
        this.crewService = CrewService.getInstance(io);
    }

    public createCrew = async (req: Request, res: Response): Promise<void> => {
        try {
            const crewData: ICrew = req.body;
            console.log('crew data req.body: ' + JSON.stringify(req.body));
            console.log('crew data received: ' + JSON.stringify(crewData));
            const crew = await this.crewService.createCrew(crewData);
            res.status(201).json(crew);
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public getCrewById = async (req: Request, res: Response): Promise<void> => {
        try {
            const crewId = req.params.id;
            const crew = await this.crewService.getCrewById(crewId);
            if (!crew) {
                res.status(404).json({ message: 'Crew not found' });
            }
            res.status(200).json(crew);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public updateCrew = async (req: Request, res: Response): Promise<void> => {
        try {
            const crewId = req.params.id;
            const updateData = req.body;
            const updatedCrew = await this.crewService.updateCrew(crewId, updateData);
            if (!updatedCrew) {
                res.status(404).json({ message: 'Crew not found' });
            }
            res.status(200).json(updatedCrew);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public deleteCrew = async (req: Request, res: Response): Promise<void> => {
        try {
            const crewId = req.params.id;
            const deletedCrew = await this.crewService.deleteCrew(crewId);
            if (!deletedCrew) {
                res.status(404).json({ message: 'Crew not found' });
            }
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }
}

export default CrewController;
