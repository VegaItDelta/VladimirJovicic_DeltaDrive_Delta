import { Injectable } from '@nestjs/common';
import { History } from './history';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistoryDto } from './dto';
import { CacheService } from '../../cache';

@Injectable()
export class HistoryService {

    public constructor(
        @InjectModel(History.name) private historyModel: Model<History>,
        private readonly cacheService: CacheService
      ) { }

    public async insert(data: History): Promise<void> {
        try {
            await this.historyModel.create(data);
        } catch(e) {
            throw new Error(e);
        }
    }

    /**
     * View the history of rides for a specific user
     * @param email The unique email of the user
     * @returns The user history
     */
    public async getUserHistory(email: string): Promise<HistoryDto[]> {
        try {
            const userHistory: HistoryDto[] = [];
            const history: History[] = await this.historyModel.find({email});
    
            for (let historyData of history) {
                const vehicle = this.cacheService.get(historyData.vehicleId);
                historyData.vehicle = vehicle;
                const historyDataDto: HistoryDto = new HistoryDto(historyData);
                userHistory.push(historyDataDto);
            }
            return userHistory;
        } catch(e) {
            throw new Error(e);
        }
    }
}