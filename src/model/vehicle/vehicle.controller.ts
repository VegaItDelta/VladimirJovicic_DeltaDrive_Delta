import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './vehicle';
import { CustomInterceptors } from '../../interceptor';

@UseInterceptors(CustomInterceptors)
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('/getAll')
  public async getAllVehicles(): Promise<Vehicle[]> {
    try {
      const vehicles = await this.vehicleService.getAllVehicles();
      return vehicles;
    } catch (e) {
      console.error('getAllVehicles error', e);
    }
  }
}
