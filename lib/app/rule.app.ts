import { RuleContextResult, Validator } from "../rules/rules";

export interface RuleContext<ErrorType> {
  start(...validators: Validator<ErrorType>[]): this;
  and(validator: Validator<ErrorType>): this;
  or(validator: Validator<ErrorType>): this;
  end(...params: any[]): RuleContextResult<ErrorType>;
}
