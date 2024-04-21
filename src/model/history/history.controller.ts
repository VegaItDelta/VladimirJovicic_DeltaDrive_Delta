import { Controller, Get, HttpStatus, Res, Session, UseInterceptors } from '@nestjs/common';
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