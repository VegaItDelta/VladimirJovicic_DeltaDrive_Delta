import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../../database/database.module';
import { CacheModule } from '../../cache';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewSchema, Review } from './review';
import { GuidService } from '../../services';
import { RouterModule } from '@nestjs/core';
import { CONSTRUCTOR_PREFIX } from '../../constants';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, GuidService],
  imports: [
    RouterModule.register([{ path: CONSTRUCTOR_PREFIX, module: ReviewModule }]),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    CacheModule,
  ],
})
export class ReviewModule { }
