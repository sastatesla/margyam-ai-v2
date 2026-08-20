import { describe, it, expect } from '@jest/globals';
import { CollectionListProvider } from '../../src/common/CollectionListProvider.js';

describe('CollectionListProvider Utility Class', () => {
  it('should parse query params and set defaults', () => {
    const parsed = CollectionListProvider.parseQueryParams({});

    expect(parsed.options.page).toBe(1);
    expect(parsed.options.limit).toBe(20);
    expect(parsed.searchQuery).toBe('');
  });

  it('should parse sorting and filter parameters correctly', () => {
    const query = {
      page: '2',
      limit: '15',
      sortBy: 'createdAt',
      sort: 'desc',
      q: 'astrology',
      role: 'ASTROLOGER',
      emptyParam: '',
    };

    const parsed = CollectionListProvider.parseQueryParams(query);

    expect(parsed.options.page).toBe(2);
    expect(parsed.options.limit).toBe(15);
    expect(parsed.options.sort).toEqual({ createdAt: -1 });
    expect(parsed.searchQuery).toBe('astrology');
    expect(parsed.filters).toEqual({ role: 'ASTROLOGER' });
    expect(parsed.filters.emptyParam).toBeUndefined();
  });
});
