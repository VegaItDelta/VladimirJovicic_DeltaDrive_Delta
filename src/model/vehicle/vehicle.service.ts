import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from './vehicle';
import { CacheService } from '../../cache';

@Injectable()
export class VehicleService {
  public constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
    private readonly cacheService: CacheService,
  ) {}

  public async getAllVehicles(): Promise<Vehicle[]> {
    if (this.cacheService.isEmpty()) {
      const vehicles: Vehicle[] = await this.vehicleModel.find();
      this.cacheService.addAll(vehicles);
      return await this.vehicleModel.find();
    } else {
      return this.cacheService.getAll();
    }
  }
}
