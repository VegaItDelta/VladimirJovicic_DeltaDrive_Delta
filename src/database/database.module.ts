import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '../cache';
import { DATABASE_URL } from '../constants';

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URL),
    CacheModule,
  ],
})
export class DatabaseModule { }
