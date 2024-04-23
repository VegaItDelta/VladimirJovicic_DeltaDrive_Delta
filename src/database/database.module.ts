import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '../cache';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:12050/VladimirJovicic_DeltaDrive_Delta',
    ),
    CacheModule,
  ],
})
export class DatabaseModule {}
