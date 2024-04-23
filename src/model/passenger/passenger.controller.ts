import { Body, Controller, HttpStatus, Post, Res, Session, UseInterceptors } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { Passenger } from './passenger';
import { AuthentificationInterceptor, NonAuthentificatedInterceptor } from '../../interceptor';

@Controller('passenger')
export class PassengersController {
  constructor(private readonly passengersService: PassengerService) {}

  @UseInterceptors(NonAuthentificatedInterceptor)
  @Post('register')
  public async register(
    @Body() passengerData: Passenger,
    @Res() response
  ): Promise<void> {
    try {
      await this.passengersService.register(passengerData);
      response.status(HttpStatus.OK).send({ message: 'Registration successful', passengerData });
    } catch(e) {
      response.status(HttpStatus.BAD_REQUEST).send({ message: e.message || 'Registration failed' });
    }
  }

  @UseInterceptors(NonAuthentificatedInterceptor)
  @Post('login')
  public async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Session() session: Record<string, any>,
    @Res() response
  ): Promise<void> {
    try {
      const passenger: Passenger = await this.passengersService.login(email, password);
      session.passenger = {
        email: passenger.email
      };
      response.status(HttpStatus.OK).send({ message: `Login successful ${passenger.email}` });
    } catch(e) {
      response.status(e.status).send({ message: e.message });
    }
  }

  @UseInterceptors(AuthentificationInterceptor)
  @Post('logout')
  public async logout(
    @Session() session: Record<string, any>,
    @Res() response
  ): Promise<void> {
    try {
      session.destroy((err: any) => {
        if (err) {
          console.error('Error destroying session:', err);
          response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Failed to logout' });
        } else {
          response.status(HttpStatus.OK).send({message: 'Logged out successfully'});
        }
      });
    } catch(e) {
      response.status(e.getStatus()).send({ message: e.message });
    }
  }
}
