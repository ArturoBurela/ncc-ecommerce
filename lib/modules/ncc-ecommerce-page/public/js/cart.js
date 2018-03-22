//Add to cart button
$( ".add-to-cart" ).click(function() {
  addToCart( $(this).data('product') );
});


if ($('#cart-products').length) {
  $( "#delete" ).click(function(e) {
    deleteFromCart(e.currentTarget.attributes.getNamedItem('product').value);
  });
}

function addToCart( product_id ) {
  var val = $( "#quantity" ).val() || 1;
  $.post("/addtocart", {id: product_id, amount: val}, function(data, status){
    alert('Product added to cart');
  });
}

function deleteFromCart(product) {
  $.post("/deletefromcart", {id:product} , function(data, status){
    alert('Product removed');
    location.reload();
  });
}
