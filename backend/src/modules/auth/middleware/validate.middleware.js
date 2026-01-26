export const validate = (schema) => (req, res, next) => {
  try {
    const validationSchema = typeof schema === 'function' ? schema(req) : schema;
    validationSchema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.issues[0].message,
    });
  }
};
