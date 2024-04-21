import { Body, Controller, HttpStatus, Post, Res, Session } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { Passenger } from './passenger';

@Controller('passenger')
export class PassengersController {
  constructor(private readonly passengersService: PassengerService) {}


  @Post('register')
  public async register(
    @Body() passengerData: Passenger,
    @Res() response
  ): Promise<void> {
    try {
      await this.passengersService.regiester(passengerData);
      response.status(HttpStatus.OK).send({ message: 'Registration successful', passengerData });
    } catch(e) {
      response.status(HttpStatus.BAD_REQUEST).send({ message: e });
    }
  }

  @Post('login')
  public async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Session() session: Record<string, any>,
    @Res() response
  ): Promise<void> {
    try {
      if (session.passenger != null) {
        response.status(HttpStatus.OK).send({ message: 'A user is already logged in' });
        return;
      }
      const passenger: Passenger = await this.passengersService.login(email, password);
      session.passenger = {
        email: passenger.email
      };
      response.status(HttpStatus.OK).send({ message: 'Login successful', passenger });

    } catch(e) {
      response.status(HttpStatus.UNAUTHORIZED).send({ message: 'Login failed' });
      console.error('PassengersController.register', e);
    }
  }

  @Post('logout')
  public async logout(
    @Session() session: Record<string, any>,
    @Res() response
  ): Promise<void> {
    if (session.passenger == null) {
      response.status(HttpStatus.OK).send({ message: 'No user is currently logged in' });
      return;
    }
    session.destroy((err: any) => {
      if (err) {
        console.error('Error destroying session:', err);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Failed to logout' });
      } else {
        response.status(HttpStatus.OK).send({message: 'Logged out successfully'});
      }
    });
  }
}
