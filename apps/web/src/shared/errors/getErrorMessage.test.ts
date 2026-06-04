import { ApiError } from '@project-manager/shared';
import { describe, expect, it } from 'vitest';

import { getErrorMessage } from 'shared/errors/getErrorMessage';

describe('getErrorMessage', () => {
  it('returns ApiError message', () => {
    const error = new ApiError('INVALID_CREDENTIALS', 'Invalid email or password', 401);

    expect(getErrorMessage(error)).toBe('Invalid email or password');
  });

  it('returns Error message', () => {
    expect(getErrorMessage(new Error('Network failed'))).toBe('Network failed');
  });

  it('returns fallback for unknown values', () => {
    expect(getErrorMessage({ code: 1 }, 'Fallback')).toBe('Fallback');
  });
});
