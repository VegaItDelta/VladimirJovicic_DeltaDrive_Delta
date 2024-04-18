import { Injectable, OnModuleInit } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from '../model/vehicle/vehicle';
import { VehicleHelperService } from '../model/vehicle/vehicle-helper.service';

/**
 * Service to import the csv vehicles file to mongodb
 */
@Injectable()
export class ImportVehiclesService implements OnModuleInit {
  constructor(
    private readonly vehicleHelperService: VehicleHelperService,
    @InjectModel(Vehicle.name) private readonly vehicleModel: Model<Vehicle>,
  ) {}

  public async onModuleInit() {
    // Count the documents and only if they are empty, execute it
    // This will prevent multiple adding to the database
    const count = await this.vehicleModel.countDocuments();
    if (count > 0) {
      return;
    }
    console.log(
      'The vehicle data is being added to the database. Please wait...',
    );

    // Get the file
    fs.createReadStream('vehicle_data/delta-drive.csv')
      .pipe(csvParser())
      .on('data', async (row) => {
        // Convert the row by cutting off the currecny at the end
        const convertedRowData = this.vehicleHelperService.cutOffCurrencies(
          row,
          ['startPrice', 'pricePerKM'],
        );

        // Set the converted data to the model
        const newData = new this.vehicleModel(convertedRowData);

        // Save the new data
        await newData.save();
      })
      .on('end', () => {
        console.log(
          'CSV file successfully processed and data inserted into MongoDB.',
        );
      });
  }
}
