import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { brandConfigSchema, rifaqDcleanBrandConfig } from '../dist/index.js';

describe('BrandConfig schema', () => {
  it('accepts the Rifaq / Dclean seed config', () => {
    assert.doesNotThrow(() => brandConfigSchema.parse(rifaqDcleanBrandConfig));
  });

  it('rejects invalid HEX colors', () => {
    const invalidConfig = structuredClone(rifaqDcleanBrandConfig);
    invalidConfig.colors.primary = 'blue';
    assert.equal(brandConfigSchema.safeParse(invalidConfig).success, false);
  });
});
