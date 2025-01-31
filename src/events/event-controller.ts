import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';

class EventController {
    private eventService: EventService;

    constructor(eventService: EventService) {
        this.eventService = eventService;
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const createEventDto: CreateEventDto = req.body;
            const event = await this.eventService.createEvent(createEventDto);
            res.status(201).json(event);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    };

    getEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            const city = (req as any).city;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 2;
            const sortBy = (req.query.sortBy as string) || 'name';
            const sortDirection = (req.query.sortDirection as string) === 'asc' ? 'asc' : 'desc';

            const events = await this.eventService.getEventsByLocation(city, page, limit, sortBy, sortDirection);
            res.status(200).json(events);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    };

    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const event = await this.eventService.getEventById(id);
            if (!event) {
                res.status(404).json({ message: 'Event not found' });
                return;
            }
            res.status(200).json(event);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    };
}

export default EventController;
