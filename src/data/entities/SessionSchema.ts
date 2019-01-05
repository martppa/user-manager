import * as Mongoose from 'mongoose';

const Schema = Mongoose.Schema;
const SCHEMA_NAME = "Session";

export const SessionSchemaField = {
    id: "_id",
    token: "token",
    refreshToken: "refreshToken",
    userId: "userId"
}

const SessionSchemaTemplate = new Schema({
    token: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});

export const SessionSchema = Mongoose.model(SCHEMA_NAME, SessionSchemaTemplate);