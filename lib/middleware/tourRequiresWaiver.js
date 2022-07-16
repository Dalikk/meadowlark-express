module.exports = (req, res, next) => {
  const { cart } = req.session;
  if (!cart) return next();
  if (cart.items.some(item => item.product.requiresWaiver)) {
    cart.warnings.push(('Один или более выбранных вами' +
      'туров требуют документа об отказе от ответственности.'));
  }
  next();
};
