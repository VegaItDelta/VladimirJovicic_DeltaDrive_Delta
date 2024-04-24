import { Controller, Get, HttpStatus, Res, Session, UseInterceptors } from '@nestjs/common';
import { AuthentificationInterceptor } from '../../interceptor';
import { HistoryService } from './history.service';
import { HistoryDto } from './dto';

@UseInterceptors(AuthentificationInterceptor)
@Controller('history')
export class HistoryController {

    public constructor(private readonly historyService: HistoryService) { }

    @Get()
    public async get(@Session() session: Record<string, any>, @Res() response): Promise<void> {
        try {
            const history: HistoryDto[] = await this.historyService.getUserHistory(session.passenger.email)
            response.status(HttpStatus.OK).send({
                message: `History for the user: ${session.passenger.email}`,
                data: history
            });
        } catch (e) {
            response.status(e.status).send({ message: e.message });
        }
    }

}