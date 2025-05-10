function parseValue(value) {
  if (typeof value === 'string' && !isNaN(value)) return Number(value);
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}

function processFilters(filters) {
  const out = {};

  for (const key in filters) {
    const val = filters[key];

    if (typeof val === 'object' && !Array.isArray(val)) {
      out[key] = {};
      for (const op in val) {
        out[key][op] = parseValue(val[op]);
      }
    } else {
      out[key] = typeof val === 'string'
        ? { contains: val, mode: 'insensitive' }
        : parseValue(val);
    }
  }

  return out;
}

function parseInclude(include) {
  const rec = (obj) => {
    if (typeof obj === 'string') {
      const lower = obj.toLowerCase();
      if (lower === 'true') return true;
      if (lower === 'false') return false;
      return obj;
    }

    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        obj[key] = rec(obj[key]);
      }
    }

    return obj;
  };

  return rec(include);
}

function parseOrderBy(orderBy) {
  if (!orderBy) return undefined;

  if (typeof orderBy === 'string') {
    orderBy = JSON.parse(orderBy);
  }

  if (Array.isArray(orderBy)) {
    return orderBy.map(field => {
      const [key, direction] = field.split('_');
      return { [key]: direction.toLowerCase() };
    });
  }

  return orderBy;
}
module.exports = {
  processFilters,
  parseInclude,
  parseOrderBy  
};
