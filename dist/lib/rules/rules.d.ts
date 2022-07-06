export declare type BaseRuleResult = {
    success: boolean;
};
export interface RuleContextResult<ErrType> extends BaseRuleResult {
    errors: ErrType[];
}
export interface RuleResult<ErrType> extends BaseRuleResult {
    error?: ErrType;
}
export declare type CreateRuleOptions = {
    waitAll: boolean;
};
export declare type Validator<ErrType> = (params: any) => RuleResult<ErrType>;
