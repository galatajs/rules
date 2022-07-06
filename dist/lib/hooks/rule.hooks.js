"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRule = void 0;
const createRule = (options = { waitAll: false }) => {
    let stack;
    let result = {
        success: true,
        errors: [],
    };
    let checkFinish = () => {
        if (options.waitAll)
            return false;
        return result.errors.length !== 0 || !result.success;
    };
    return {
        start(...validators) {
            stack = new Set();
            validators.forEach((validator) => stack.add({ type: "all", validator }));
            return this;
        },
        and(validator) {
            stack.add({ type: "and", validator });
            return this;
        },
        or(validator) {
            stack.add({ type: "or", validator });
            return this;
        },
        end(...params) {
            let index = 0;
            for (const rule of stack) {
                if (checkFinish())
                    break;
                const res = rule.validator(params[index]);
                res.success === false ? result.errors.push(res.error) : null;
                if (["start", "all"].includes(rule.type)) {
                    result.success = res.success;
                }
                else if (rule.type === "and") {
                    result.success = result.success && res.success;
                }
                else if (rule.type === "or") {
                    result.success = result.success || res.success;
                }
                index++;
            }
            return result;
        },
    };
};
exports.createRule = createRule;
//# sourceMappingURL=rule.hooks.js.map