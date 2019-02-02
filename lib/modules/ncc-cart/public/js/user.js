$(function() {
  console.log("hello");
  function deleteFromCart(productId) {
    $.post('/cart/delete', { productId }, function(result) {
      console.log(result);
      if (result.status === 'ok') {
        $('.addToCart .thank-you').show();
      }
    });
    return false;
  };
});
