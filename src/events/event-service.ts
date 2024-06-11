import mongoose from 'mongoose';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventModel, { IEvent } from './models/Event';

class EventService {
    async getEventsByLocation(location: string, page: number, limit: number, sortBy: string, sortDirection: 'asc' | 'desc'): Promise<IEvent[]> {
        const skip = (page - 1) * limit;
        return await EventModel.find({ location })
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(limit)
            .exec();
    }

    async getEventById(id: string): Promise<IEvent | null> {
        return await EventModel.findById(id).exec();
    }

    async getEvents(): Promise<IEvent[]> {
        return await EventModel.find().exec(); 
    }

    async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
        const { name, description, date, location, duration } = createEventDto;
        const newEvent = new EventModel({
            name,
            description,
            date: new Date(date),
            location,
            duration
        });

        await newEvent.save();
        return newEvent;
    }
}

export default EventService;
