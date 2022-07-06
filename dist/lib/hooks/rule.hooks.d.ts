import { RuleContext } from "../app/rule.app";
import { CreateRuleOptions } from "../rules/rules";
export declare const createRule: <ErrorType = string>(options?: CreateRuleOptions) => RuleContext<ErrorType>;
