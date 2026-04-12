// Factory function to create validation middleware from Zod schemas
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      if (source === 'body') {
        const validated = schema.parse(req.body);
        Object.assign(req.body, validated);
      } else if (source === 'query') {
        const validated = schema.parse(req.query);
        // Important: req.query can be a getter in some environments, 
        // especially in newer Express/Node versions or when using specific middlewares.
        // We clear and re-assign properties for maximum compatibility.
        for (const key in req.query) delete req.query[key];
        Object.assign(req.query, validated);
      } else if (source === 'params') {
        const validated = schema.parse(req.params);
        Object.assign(req.params, validated);
      }
      next();
    } catch (error) {
      next(error); // Pass to error handler
    }
  };
};
