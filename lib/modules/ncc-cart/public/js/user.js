function deleteFromCart(productId, serial) {
  $.post('/cart/delete', { productId, serial }, function (result) {
    if (result === true) {
      var el = document.getElementById(productId + "-" + serial);
      el.remove();
    }
  });
  return false;
};