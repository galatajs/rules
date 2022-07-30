const { describe, it } = require("node:test");
const assert = require("node:assert");
const { createRule } = require("../dist");

describe("RuleContext tests", () => {
  it("createRule should return a RuleContext", () => {
    const rule = createRule();
    assert.notStrictEqual(rule.and, undefined);
    assert.notStrictEqual(rule.or, undefined);
    assert.notStrictEqual(rule.end, undefined);
  });

  it("RuleContext.start should return a RuleContext", () => {
    const rule = createRule();
    const result = rule.start(() => ({ success: true }));
    assert.notStrictEqual(result.and, undefined);
    assert.notStrictEqual(result.or, undefined);
    assert.notStrictEqual(result.end, undefined);
  });

  it("createRule and try to end should return a RuleContextResult", () => {
    const rule = createRule();
    const result = rule.start(() => ({ success: true })).end();
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.errors.length, 0);
  });

  it("createRule and try to and function (true to true)", () => {
    const rule = createRule();
    const result = rule
      .start(() => ({ success: true }))
      .and(() => ({ success: true }))
      .end();
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.errors.length, 0);
  });

  it("createRule and try to and function (false to true)", () => {
    const rule = createRule();
    const result = rule
      .start(() => ({ success: false }))
      .and(() => ({ success: true }))
      .end();
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.errors.length, 1);
  });

  it("createRoute and try to or function (true to true)", () => {
    const rule = createRule();
    const result = rule
      .start(() => ({ success: true }))
      .or(() => ({ success: true }))
      .end();
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.errors.length, 0);
  });

  it("createRule and try to or function (false to true)", () => {
    const rule = createRule({ waitAll: false });
    const result = rule
      .start(() => ({ success: false }))
      .or(() => ({ success: true }))
      .end();
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.errors.length, 1);
  });

  it("createRule and try to or function (false to false)", () => {
    const rule = createRule({ waitAll: false });
    const result = rule
      .start(() => ({ success: false }))
      .or(() => ({ success: false }))
      .end();
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.errors.length, 1);
  });

  it("createRule and try to provide waitAll option", () => {
    const rule = createRule({ waitAll: true });
    let abc = false;
    const result = rule
      .start(() => ({ success: false }))
      .and(() => {
        abc = true;
        return { success: true };
      })
      .end();
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.errors.length, 1);
    assert.strictEqual(abc, true);
  });

  it("createRule and try to don't provide waitAll option", () => {
    const rule = createRule({ waitAll: false });
    let abc = false;
    const result = rule
      .start(() => ({ success: false }))
      .and(() => {
        abc = true;
        return { success: true };
      })
      .end();
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.errors.length, 1);
    assert.strictEqual(abc, false);
  });

  it("createRule and try to provide params negative", () => {
    const rule = createRule();
    const result = rule.start((num) => ({ success: num === 2 })).end(1, 2, 3);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.errors.length, 1);
  });

  it("createRule and try to provide params positive", () => {
    const rule = createRule();
    const result = rule.start((num) => ({ success: num === 1 })).end(1, 2, 3);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.errors.length, 0);
  });
});
