import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Passenger } from './passenger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as validator from 'validator';

@Injectable()
export class PassengerService {
  public constructor(
    @InjectModel(Passenger.name) private passengerModel: Model<Passenger>,
  ) {}

  /**
   * Registers a new passenger where the email must me unique
   * @param passengerData The registration data for the passenger
   */
  public async regiester(passengerData: Passenger): Promise<void> {
    const email = passengerData.email.trim().toLowerCase();
    if (!validator.isEmail(email)) {
      throw new BadRequestException('Invalid email address');
    }
    try {
      // get the user with the mail
      const existingPassenger  = await this.passengerModel.findOne({email});
  
      if (existingPassenger != null) {
        // If the passenger exists throw an error
        throw new ConflictException('Email already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(passengerData.password, 10);

      await this.passengerModel.create({
        ...passengerData,
        email,
        password: hashedPassword
      });
    } catch(e) {
      console.error(e);
    }
  }
  
  /**
   * Function for a user to login.
   * If a user is already logged in it won't re-login again
   * @param email The email input
   * @param password The password input
   * @returns 
   */
  public async login(email: string, password: string): Promise<Passenger> {
    // It's bad practice to say only "Wrong username" or "Wrong password"
    // If a hack happens, the hacker won't know if the guessed anything right
    const errorMessage = 'Wrong email or password';
    const passenger = await this.passengerModel.findOne({ email });
    if (passenger == null) {
      throw new UnauthorizedException(errorMessage);
    }

    // Match the hashes of the entered password
    const passwordMatch = await bcrypt.compare(password, passenger.password);
    if (!passwordMatch) {
      throw new UnauthorizedException(errorMessage);
    }

    return passenger;
  }
}
