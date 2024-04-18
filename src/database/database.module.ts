import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:12050/VladimirJovicic_DeltaDruve_Delta',
    ),
  ],
})
export class DatabaseModule {}
