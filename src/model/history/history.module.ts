import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../../database/database.module';
import { CacheModule } from '../../cache';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { History, HistorySchema } from './history';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
    CacheModule,
  ],
})
export class HistoryModule {}
