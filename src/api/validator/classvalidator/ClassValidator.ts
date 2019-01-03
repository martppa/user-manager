import Validator from "../Validator";
import { validate } from "class-validator";
import { injectable } from "inversify";

@injectable()
export class ClassValidator implements Validator {
    public async validate(data: any): Promise<string[]> {
        const validationErrors = await validate(data);
        const errors = new Array<string>();
        validationErrors.forEach(validationError => {
            for (var key in validationError.constraints) {
                errors.push(validationError.constraints[key]);
            }
        });
        return errors;
    }
    
}