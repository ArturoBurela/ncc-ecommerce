var alreadyCalledSerials = [], cart = {};
$("#target").keyup(function () {
  var key = $('#target').val();
  if (key.length > 4) {
    if (alreadyCalledSerials.indexOf(key) === -1) {
      // alert( "Handler for .keyup() called." );
      $.ajax({
        url: "/api/v1/ncc-product?serial=" + key,
        cache: false
      })
        .done(function (response) {
          if (response.results && response.results[0]) {
            var value = response.results[0];
            var html = value.title + ' ' + value.price;
            // Initialize quantity in cart
            cart[value._id] = 1;
            html += '<div class="quantityInput" min="0" max="32"><input type="text" class="quantity' + value._id + '" name="quantity" value="1"><button value="+" class="quantityPlus" onclick="increase(\'' + value._id + '\')">+</button><button value="+" class="quantityPlus" onclick="decrease(\'' + value._id + '\')">-</button></div>';
            html += '<br>';

            $("#results").append(html);
          }
        });
      alreadyCalledSerials.push(key);
    }

  }
});
/*
    $("#results").click(function () {
      $("#target").keyup();
    });
*/
$(".completeOrder").click(function() {
  var paymentType = $('.paymentType').val();
  $.post('/pos/complete', { cart, paymentType }, function(result) {
    if (result.success === true) {
      window.location.href = '/pos';
    } else {
      $('#errorOrder').val(result);
    }
  });
  return false;
});

function increase(id) {
  cart[id] += 1;
  $(".quantity" + id).val(cart[id]);
}
function decrease(id) {
  cart[id] -= 1;
  $(".quantity" + id).val(cart[id]);
}
