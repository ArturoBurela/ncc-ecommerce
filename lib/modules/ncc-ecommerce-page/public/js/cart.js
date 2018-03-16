//Add to cart button
$( ".add-to-cart" ).click(function() {
  console.log("Add to cart clicked");
  addToCart( $(this).data('product') );
});


if ($('#cart-products').length) {
  $( "#delete" ).click(function(e) {
    console.log(e);
    deleteFromCart(e.currentTarget.attributes.getNamedItem('product').value);
  });
}

function addToCart( product_id ) {
  let val = $( "#quantity" ).val() || 1;
  $.post("/addtocart", {id: product_id, amount: val}, function(data, status){
    alert('Product added to cart');
  });
}

function deleteFromCart(product) {
  console.log(product);
  $.post("/deletefromcart", {id:product} , function(data, status){
    alert('Product removed');
    location.reload();
  });
}
