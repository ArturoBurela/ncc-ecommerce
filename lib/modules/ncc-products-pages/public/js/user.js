$(function() {
  $('.addToCart').submit(function() {
    $.post('/cart/add', $('.addToCart').serialize(), function(result) {
      console.log(result);
      if (result === true) {
        $('.addToCart .thankYou').show();
      }
    });
    return false;
  });
});
