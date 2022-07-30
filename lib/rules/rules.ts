export type BaseRuleResult = {
  success: boolean;
};

export interface RuleContextResult<ErrType> extends BaseRuleResult {
  errors: ErrType[];
}

export interface RuleResult<ErrType> extends BaseRuleResult {
  error?: ErrType;
}

export type CreateRuleOptions = {
  waitAll?: boolean;
  singleParameter?: boolean;
};

export type Validator<ErrType> = (params: any) => RuleResult<ErrType>;
