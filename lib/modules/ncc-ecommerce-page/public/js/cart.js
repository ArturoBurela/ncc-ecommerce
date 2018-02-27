//Add to cart button
if ($('#quantity').length) {
  $( "#cart" ).click(function() {
    addToCart();
  });
}

if ($('#cart-products').length) {
  $( "#delete" ).click(function(e) {
    console.log(e);
    deleteFromCart(e.currentTarget.attributes.getNamedItem('product').value);
  });
}

function addToCart() {
  let val = $( "#quantity" ).val();
  $.post("/addtocart",{id:$( "#cart" ).attr( "product" ), amount: val}, function(data, status){
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
