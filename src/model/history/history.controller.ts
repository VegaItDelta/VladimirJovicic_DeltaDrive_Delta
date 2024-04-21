import { Controller, Get, HttpStatus, Res, Session, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { AuthentificationInterceptor } from '../../interceptor';
import { HistoryService } from './history.service';
import { History } from './history';

@UseInterceptors(AuthentificationInterceptor)
@Controller('history')
export class HistoryController {

    public constructor(private readonly historyService: HistoryService) {}

    @Get()
    public async viewUserHistory(@Session() session: Record<string, any>, @Res() response): Promise<void> {
        try {
            if (session == null) {
                const noSessionErrorMessage = 'Can not find the session!'
                response.status(HttpStatus.BAD_REQUEST).send({ message: noSessionErrorMessage });
                throw new UnauthorizedException(noSessionErrorMessage);
            }

            if (session.passenger == null) {
                const noPassengerErrorMessage = 'Can not find the passenger in the session!'
                response.status(HttpStatus.BAD_REQUEST).send({ message: noPassengerErrorMessage });
                throw new UnauthorizedException(noPassengerErrorMessage);
            }

            if (session.passenger.email == null) {
                const noEmailErrorMessage = 'No email saved in the passenger session'
                response.status(HttpStatus.BAD_REQUEST).send({ message: noEmailErrorMessage });
                throw new UnauthorizedException(noEmailErrorMessage);
            }

            const history: History[] = await this.historyService.viewUserHistory(session.passenger.email)
            response.status(HttpStatus.OK).send({
                message: `History for the user: ${session.passenger.email}`,
                data: history
            });
        } catch(e) {
            console.error(e);
        }
    }

}