console.log($('#quantity').length);
if ($('#quantity').length) {

}
$( "#cart" ).click(function() {
  addToCart();
});
function addToCart() {
  let val = $( "#quantity" ).val();
  $.get("/addtocart/{{data.piece._id}}/"+val, function(data, status){
    alert('Product added to cart');
  });
}
