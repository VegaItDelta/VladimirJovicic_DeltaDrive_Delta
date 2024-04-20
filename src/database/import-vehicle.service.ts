import { Injectable, OnModuleInit } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from '../model/vehicle/vehicle';
import { VehicleHelperService } from '../model/vehicle/vehicle-helper.service';
import { CacheService } from '../cache';
import { GuidService } from '../services';

/**
 * Service to import the csv vehicles file to mongodb
 */
@Injectable()
export class ImportVehiclesService implements OnModuleInit {
  constructor(
    private readonly vehicleHelperService: VehicleHelperService,
    @InjectModel(Vehicle.name) private readonly vehicleModel: Model<Vehicle>,
    private readonly cacheService: CacheService,
    private readonly guidService: GuidService
  ) {}

  public async onModuleInit() {
    // Count the documents and only if they are empty, execute it
    // This will prevent multiple adding to the database
    const count = await this.vehicleModel.countDocuments();
    if (count > 0) {
      const vehicles = await this.vehicleModel.find();
      // Add the data to the cache
      this.cacheService.addAll(vehicles);
      return;
    }

    const vehiclesToAdd: Vehicle[] = [];

    console.log(
      'The vehicle data is being added to the database. Please wait...',
    );

    // Get the file
    fs.createReadStream('vehicle_data/delta-drive.csv')
      .pipe(csvParser())
      .on('data', async (row) => {
        // Convert the row by cutting off the currecny at the end
        const convertedVehicle = this.vehicleHelperService.cutOffCurrencies(
          row,
          'startPrice',
          'pricePerKM',
        );

        if (convertedVehicle.uuid  == null) {
          convertedVehicle.uuid = this.guidService.generateGuid();
        }

        if (convertedVehicle.rating  == null) {
          convertedVehicle.rating = 0.0;
        }

        if (convertedVehicle.booked  == null) {
          // For mocking already booked vehicles, generate a 20% chance of being already booked
          convertedVehicle.booked = Math.random() <= 0.2;
        }
        vehiclesToAdd.push(convertedVehicle);
      })
      .on('end', async () => {
        await this.vehicleModel.insertMany(vehiclesToAdd);
        this.cacheService.addAll(vehiclesToAdd);
        console.log(
          'CSV file successfully processed and data inserted into MongoDB.',
        );
      });
  }
}
