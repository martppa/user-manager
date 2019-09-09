import { injectable, inject } from "inversify";
import SessionProvider from "../../SessionProvider";
import { Observable, Subscriber } from 'rxjs';
import SessionEntity from "../../../../../entities/SessionEntity";
import { SessionSchema } from '../../../../../entities/SessionSchema';
import { BusinessInjector } from '../../../../../../business/di/BusinessInjector';
import Logger from "chk2global/dist/logger/Logger";
import Errors from "../../../../../../business/constants/Errors";
import SessionSchemaMapper from '../../../../../entities/mappers/SessionSchemaMapper';

@injectable()
export default class SessionMongoProvider implements SessionProvider {
    private readonly TAG: string = this.constructor.name;

    @inject(BusinessInjector.LOGGER.value)
    private logger: Logger;

    public getSessionsByUserId(userId: string): Observable<SessionEntity[]> {
        return Observable.create(async (subscriber: Subscriber<SessionEntity[]>) => {
            try {
                const sessions = await SessionSchema.find({ userId : userId });
                subscriber.next(SessionSchemaMapper.mapToEntities(sessions));
            } catch (error) {
                this.logger.error(this.TAG, `Error when querying session by user id: ${error}`);
                subscriber.error(new Error(Errors.INTERNAL_SERVER_ERROR));
            }
        });
    }
}