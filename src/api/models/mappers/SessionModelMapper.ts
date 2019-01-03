import SessionModel from '../SessionModel';
import Session from '../../../business/models/Session';

export default class SessionModelMapper {
    public static map(session: Session): SessionModel {
        return new SessionModel(session.token, session.refreshToken);
    }        
}