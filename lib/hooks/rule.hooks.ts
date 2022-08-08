import { RuleContext } from "../app/rule.app";
import {
  CreateRuleOptions,
  RuleContextResult,
  Validator,
} from "../rules/rules";

export const createRule = <ErrorType = string>(
  options: CreateRuleOptions = { waitAll: false, singleParameter: false }
): RuleContext<ErrorType> => {
  let stack;
  let result: RuleContextResult<ErrorType> = {
    success: true,
    errors: [],
  };
  let checkFinish = (): boolean => {
    if (options.waitAll) return false;
    return result.errors.length !== 0 || !result.success;
  };

  const getParameter = (index: number, params: any[]): any => {
    if (options.singleParameter) {
      return params[0];
    }
    return params[index];
  };

  return {
    start(...validators: Validator<ErrorType>[]): RuleContext<ErrorType> {
      stack = new Set<Validator<ErrorType>>();
      validators.forEach((validator) => stack.add({ type: "all", validator }));
      return this;
    },
    and(validator: Validator<ErrorType>): RuleContext<ErrorType> {
      stack.add({ type: "and", validator });
      return this;
    },
    or(validator: Validator<ErrorType>): RuleContext<ErrorType> {
      stack.add({ type: "or", validator });
      return this;
    },
    end(...params: any[]): RuleContextResult<ErrorType> {
      let index = 0;
      for (const rule of stack) {
        if (checkFinish()) break;
        const res = rule.validator(getParameter(index, params));
        res.success === false ? result.errors.push(res.error) : null;
        if (["start", "all"].includes(rule.type)) {
          result.success = res.success;
        } else if (rule.type === "and") {
          result.success = result.success && res.success;
        } else if (rule.type === "or") {
          result.success = result.success || res.success;
        }
        index++;
      }
      return result;
    },
    async asyncEnd(...params: any[]): Promise<RuleContextResult<ErrorType>> {
      let index = 0;
      for (const rule of stack) {
        if (checkFinish()) break;
        const res = await rule.validator(getParameter(index, params));
        res.success === false ? result.errors.push(res.error) : null;
        if (["start", "all"].includes(rule.type)) {
          result.success = res.success;
        } else if (rule.type === "and") {
          result.success = result.success && res.success;
        } else if (rule.type === "or") {
          result.success = result.success || res.success;
        }
        index++;
      }
      return result;
    },
  };
};
