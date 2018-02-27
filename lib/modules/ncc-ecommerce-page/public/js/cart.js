//Add to cart button
if ($('#quantity').length) {
  $( "#cart" ).click(function() {
    addToCart();
  });
}
function addToCart() {
  let val = $( "#quantity" ).val();
  $.get("/addtocart/"+$( "#cart" ).attr( "product" )+"/"+val, function(data, status){
    alert('Product added to cart');
  });
}
