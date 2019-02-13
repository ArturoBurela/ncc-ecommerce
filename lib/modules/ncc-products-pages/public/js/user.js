$(function() {
  $('.addToCart').submit(function() {
    $.post('/cart/add', $('.addToCart').serialize(), function(result) {
      if (result === true) {
        $('.addToCart .thankYou').show();
      }
    });
    return false;
  });
  $(".quantityMinus").click(function() {
    var qInput = $(this).parents(".quantityInput");
    var qText = qInput.find(".quantity");
    var qValue = parseInt((qText.val())? qText.val() : 0);
    qText.val(Math.max(qValue - 1, (qInput.attr("min"))? qInput.attr("min") : -0xffff));
  });

  $(".quantityPlus").click(function() {
    var qInput = $(this).parents(".quantityInput");
    var qText = qInput.find(".quantity");
    var qValue = parseInt((qText.val())? qText.val() : 0);
    qText.val(Math.min(qValue + 1, (qInput.attr("max"))? qInput.attr("max") : 0xffff));
  });

});
