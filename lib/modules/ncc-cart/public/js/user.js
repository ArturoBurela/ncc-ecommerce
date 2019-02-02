function deleteFromCart(productId) {
  $.post('/cart/delete', { productId }, function(result) {
    if (result === true) {
      var el = document.getElementById(productId);
      el.remove();
    }
  });
  return false;
};
