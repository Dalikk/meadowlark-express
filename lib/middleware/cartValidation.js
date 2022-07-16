module.exports = {
  resetValidation(req, res, next) {
    const { cart } = req.session;
    if (cart) cart.warnings = cart.errors = [];
    next();
  },

  checkWaivers(req, res, next) {
    const { cart } = req.session;
    if (!cart) return next();
    if (cart.items.some(item => item.product.requiresWaiver)) {
      cart.warnings.push(('Один или более выбранных вами' +
        'туров требуют документа об отказе от ответственности.'));
    }
    next();
  },

  checkGuestCounts(req, res, next) {
    const { cart } = req.session;
    if (!cart) return next;
    if (cart.items.some(items => items.guests > items.product.maxGuests )) {
      cart.errors.push('В одном или более из выбранных вами ' +
        'туров недостаточно мест для выбранного вами ' +
        'количества гостей');
    }
    next();
  },
};