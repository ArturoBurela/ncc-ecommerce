$(function() {
  $('.addToCart').submit(function() {
    $.post('/cart/add', $('.addToCart').serialize(), function(result) {
      console.log(result);
      if (result.status === 'ok') {
        $('.addToCart .thank-you').show();
      }
    });
    return false;
  });
});
