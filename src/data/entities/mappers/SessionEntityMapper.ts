import Session from "../../../business/models/Session";
import SessionEntity from "../SessionEntity";

export default class SessionEntityMapper {
    public static mapToModel(sessionEntity: SessionEntity): Session {
        if (!sessionEntity) return undefined;
        return new Session(sessionEntity.token, sessionEntity.refreshToken, sessionEntity.userId);
    }

    public static mapToModels(sessionEntities: SessionEntity[]): Session[] {
        const sessions = new Array<Session>();
        sessionEntities.forEach(sessionEntity => sessions.push(this.mapToModel(sessionEntity)));
        return sessions;
    }

    public static mapToEntity(session: Session): SessionEntity {
        return new SessionEntity(session.token, session.refreshToken, session.userId);
    }
 }