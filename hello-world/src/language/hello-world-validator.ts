import { ValidationAcceptor, ValidationChecks } from 'langium';
import { HelloWorldAstType, Model, Def } from './generated/ast';
import type { HelloWorldServices } from './hello-world-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: HelloWorldServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.HelloWorldValidator;
    const checks: ValidationChecks<HelloWorldAstType> = {
        Model: validator.checkModel,
        Def: validator.checkDef,
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class HelloWorldValidator {

    checkModel(model: Model, accept: ValidationAcceptor): void {
        const defs = model.defs;
        const previousName = new Set<string>();
        for(const def of defs) {
            if(previousName.has(def.name.toLowerCase())) {
                accept('error', 'Definition cannot re-define an existing name.', {node: def, property: 'name'});
            } else {
                previousName.add(def.name.toLowerCase());
            }
        }
    }
    checkDef(def: Def, accept: ValidationAcceptor): void {
        const params = def.params;
        const previousName = new Set<string>();
        for(const param of params) {
            if(previousName.has(def.name.toLowerCase())) {
                accept('error', `Duplicate params name '${param.name}'` , {node: param, property: 'name'});
            } else {
                previousName.add(def.name.toLowerCase());
            }
        }
    }
}
