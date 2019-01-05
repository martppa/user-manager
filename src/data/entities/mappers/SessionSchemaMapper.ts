import { SessionSchemaField, SessionSchema } from "../SessionSchema";
import * as Mongoose from 'mongoose';
import SessionEntity from "../SessionEntity";

export default class SessionSchemaMapper {
    public static mapToEntities(sessionSchemas: Mongoose.Document[]): SessionEntity[] {
        const sessions = new Array<SessionEntity>();
        sessionSchemas.forEach(sessionSchema => sessions.push(this.mapToEntity(sessionSchema)));
        return sessions;
    }

    /*public static mapToSchema(token: string, refreshToken: string, userId: string): Mongoose.Document {
        const sessionSchema = new SessionSchema();
        sessionSchema[SessionSchemaField.token] = token;
        sessionSchema[SessionSchemaField.refreshToken] = refreshToken;
        sessionSchema[SessionSchemaField.userId] = userId;
        return sessionSchema;
    }*/

    public static mapToSchema(sessionEntity: SessionEntity): Mongoose.Document {
        const sessionSchema = new SessionSchema();
        sessionSchema[SessionSchemaField.token] = sessionEntity.token;
        sessionSchema[SessionSchemaField.refreshToken] = sessionEntity.refreshToken;
        sessionSchema[SessionSchemaField.userId] = sessionEntity.userId;
        return sessionSchema;
    }

    public static mapToEntity(sessionSchema: Mongoose.Document): SessionEntity {
        return new SessionEntity(sessionSchema[SessionSchemaField.token],
            sessionSchema[SessionSchemaField.refreshToken],
            sessionSchema[SessionSchemaField.userId]);
    }
}
