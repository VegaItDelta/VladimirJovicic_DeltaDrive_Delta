import { Injectable } from '@nestjs/common';
import { History } from './history';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class HistoryService {

    public constructor(
        @InjectModel(History.name) private historyModel: Model<History>,
      ) { }

    public async insert(data: History): Promise<void> {
        await this.historyModel.create(data);
    }

    /**
     * View the history of rides for a specific user
     * @param email The unique email of the user
     * @returns The user history
     */
    public async viewUserHistory(email: string): Promise<History[]> {
        return await this.historyModel.find({email});
    }
}