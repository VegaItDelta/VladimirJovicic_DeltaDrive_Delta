import { Module, Global } from '@nestjs/common';
import { CacheService } from './cache.service';

/**
 * A module for handling a global cache for vehicles to keep the full data in memory to avoid constant huge database calls and increase performance
 */
// This can be extended for to have a caching system for all entities but for the purpose of this demo app it's only for the vehicles
@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
