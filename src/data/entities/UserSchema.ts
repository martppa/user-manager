import * as Mongoose from 'mongoose';

const Schema = Mongoose.Schema;
const SCHEMA_NAME = "User";

export const UserSchemaField = {
    id: "id",
    name: "name",
    email: "email",
    password: "password"
}

const UserSchemaTemplate = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export const UserSchema = Mongoose.model(SCHEMA_NAME, UserSchemaTemplate);