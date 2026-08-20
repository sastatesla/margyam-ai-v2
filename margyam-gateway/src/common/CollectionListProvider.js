/**
 * CollectionListProvider
 * Generic pagination and query parameters parsing provider.
 */
export class CollectionListProvider {
  static parseQueryParams(query = {}) {
    const { page, limit, sortBy, sort, q, ...filters } = query;

    const parsedOptions = {
      page: parseInt(page, 10) > 0 ? parseInt(page, 10) : 1,
      limit: parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 20,
      sort: {},
    };

    if (sortBy) {
      const sortOrder = String(sort).toLowerCase() === 'asc' ? 1 : -1;
      parsedOptions.sort[sortBy] = sortOrder;
    }

    return {
      options: parsedOptions,
      searchQuery: q || '',
      filters: this.sanitizeFilters(filters),
    };
  }

  static sanitizeFilters(filters) {
    const cleaned = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === '') continue;
      cleaned[key] = value;
    }
    return cleaned;
  }
}
