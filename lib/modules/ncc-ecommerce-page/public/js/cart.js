//Add to cart button
if ($('#quantity').length) {
  $( "#cart" ).click(function() {
    addToCart();
  });
}

if ($('#cart-products').length) {
  $( "#delete" ).click(function() {
    addToCart();
  });
}

function addToCart() {
  let val = $( "#quantity" ).val();
  $.post("/addtocart",{id:$( "#cart" ).attr( "product" ), amount: val}, function(data, status){
    alert('Product added to cart');
  });
}

function deleteFromCart() {
  $.post("/deletefromcart",{id:$( "#delete" ).attr( "product" )}, function(data, status){
    alert('Product added to cart');
  });
}
