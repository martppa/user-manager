import SessionProvider from "./provider/SessionProvider";
import { Observable } from "rxjs";
import SessionEntity from "../../entities/SessionEntity";
import { inject, injectable } from "inversify";
import { BusinessInjector } from '../../../business/di/BusinessInjector';
import SessionDataSource from "../SessionDataSource";

@injectable()
export default class SessionDatabaseDataSource implements SessionDataSource {
    @inject(BusinessInjector.SESSION_PROVIDER.value)
    private sessionProvider: SessionProvider;

    public getSessionsByUserId(userId: string): Observable<SessionEntity[]> {
        return this.sessionProvider.getSessionsByUserId(userId);
    }
}