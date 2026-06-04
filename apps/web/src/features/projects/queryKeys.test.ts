import { describe, expect, it } from 'vitest';

import { projectKeys } from 'features/projects/queryKeys';

describe('projectKeys', () => {
  it('builds stable list key', () => {
    expect(projectKeys.list()).toEqual(['projects', 'list']);
  });

  it('builds detail key with id', () => {
    expect(projectKeys.detail('abc')).toEqual(['projects', 'detail', 'abc']);
  });
});
