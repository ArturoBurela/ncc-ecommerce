if(window.location.href.indexOf("cart") >= 0){
  $(document).ready(function () {
    GetCart(Paypal);
  });
  function GetCart(cb) {
    $.get("/getcart", function(data, status){
      let cart = data;
      cb(cart);
    });
  }
  function PostPayment(payment, cb) {
    $.post("/payment", payment , function(data, status){
      cb(data);
    });
  }
  function Paypal(cart) {
    paypal.Button.render({

      env: 'sandbox', // Or 'sandbox'

      client: {
        sandbox:    'AYIjDNRbj0y5HL-aw3qLZ17TtXI8we_Z3GLMfmpKZNpn9VEnUJV9Jh8cl5xBlDiyQQjH7rCF16J2ZVt8',
        production: 'ASwyz5WhY5VFmBqBhCujRHQ3CFws0nZ5xAWvnGVAH7JLj4vEcflNDb2A0XLdgq3bTGVS0CM81meT20TG'
      },

      commit: true, // Show a 'Pay Now' button

      payment: function(data, actions) {
        let total = 0.00;
        let items = [];
        let price = 0;
        for (var p of cart) {
          total += p.product_data.total * p.amount;
          items.push({
            sku: p.product_id,
            name: p.product_data.title,
            description: 'p.product_data.description',
            quantity: p.amount,
            price: p.product_data.total,
            currency: "MXN"
          });
        }
        let pay = {
          "intent": "sale",
          "payer": {
            "payment_method": "paypal"
          },
          "transactions": [
            {
              "amount": {
                "total": total,
                "currency": "MXN"
              },
              "soft_descriptor": "ECHI5786786",
              "item_list": {
                "items": items,
              }
            }
          ],
          "note_to_payer": "Stop botherinsfasjdkfnslaf"
        };
        return actions.payment.create({
          payment: pay
        });
      },

      onAuthorize: function(data, actions) {
        return actions.payment.execute().then(function(payment) {
          console.log(payment);
          // The payment is complete!
          PostPayment(payment, function (data) {
            console.log(data);
          });
          window.location.replace("/purchase");
        });
      }

    }, '#paypal-button');
  }
}
