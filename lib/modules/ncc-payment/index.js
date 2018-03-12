var async = require('async');

module.exports = {
    extend: 'apostrophe-pieces',
    name: 'ncc-payment',
    label: 'Payment',
    addFields: [
        {
            name: 'method',
            type: 'string',
            label: 'Payment Form',
            required: true
        },
        {
            name: 'amount',
            type: 'float',
            label: 'Amount Paid',
            required: true
        },
        {
            name: 'folio',
            type: 'string',
            label: 'Folio',
            required: true
        },
        {
            name: '_products',
            label: 'Products',
            // Must match the `name` option given when configuring `fabric` as a subclass of pieces.
            // You could skip this since the name of the join matches the name of the other type.
            withType: 'ncc-product-payment',
            idsField: 'productIds',
            type: 'joinByArray',
            filters: {
                // Fetch just enough information
                projection: {
                    title: 1,
                    slug: 1,
                    quantity: 1,
                    price: 1,
                    discount: 1,
                    total: 1
                }
            }
        },
        {
            name: '_user',
            label: 'User',
            // Must match the `name` option given when configuring `fabric` as a subclass of pieces.
            // You could skip this since the name of the join matches the name of the other type.
            withType: 'apostrophe-user',
            type: 'joinByOne',
            idField: 'userId',
            filters: {
                // Fetch just enough information
                projection: {
                    username: 1,
                    email: 1,
                    _url: 1,
                    _id: 1
                }
            }
        }
    ],
    permissionsFields: false,

    afterConstruct: function(self) {
        self.setSubmitSchema();
        self.addRoutes();
    },

    construct: function(self, options) {

      self.addPayment = function (req, callback) {
        var piece = self.newInstance();
        piece.title = 'So great!';
        piece.amount = req.session.pay.total;
        piece.method = 'Paypal';
        piece.productIds = req.session.productsPayments;
        piece.folio = Math.floor(Math.random()*90000) + 10000;
        piece.userId = req.session.passport.user;
        console.log("PAYMENT PIECE:");
        console.log(JSON.stringify(piece));
        return self.insert(req, piece, { permissions: false }, callback);
      }

        self.setSubmitSchema = function() {
            self.submitSchema = self.apos.schemas.subset(self.schema,
                [ 'method', 'amount', 'folio', '_products' ]
            );
        };

        /*self.submit = function(req, callback) {
            var piece = {};
            return async.series([
                convert,
                insert,
                mail
            ], callback);

            // Perhaps use Export instead of convert to sanitize
            function convert(callback) {
                return self.apos.schemas.convert(req, self.schema, 'form', req.data, piece, callback);
            }
            function insert(callback) {
                return self.insert(req, piece, { permissions: false }, callback);
            }
            function mail(callback){
                //TODO: Put codes in other file to config mailer
                var api_key = 'key-a8db94cc64c40a5cc5e4a9bedb5511af';
                var domain = 'mg.aferplomeria.com';
                var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

                var data = {
                    from: 'Formulario de Contacto AFER <forma-contacto-afer@afer.mx>',
                    to: 'andre@notecode.mx',
                    subject: 'Confirmación de pago en aferplomeria.com',
                    text: 'Total : ' + piece.amount + '\n'
                    + 'Forma de Pago : ' + req.body.email + '\n'
                };

                mailgun.messages().send(data, callback);
            }
        };*/

        self.addRoutes = function(){


            self.apos.app.post('/payment', function(req, res){
              console.log(res.data);
                //self.submit()
            });

            self.apos.app.get('/mailtest', function(req, res, next){
                var api_key = 'key-a8db94cc64c40a5cc5e4a9bedb5511af';
                var domain = 'mg.aferplomeria.com';
                var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});


                var data = {
                    from: 'Testing Mailer with Apostrophe <mailer@afer.mx>',
                    to: 'andre@notecode.mx',
                    subject: 'Prueba exitosa de sitio Apostrophe',
                    text: ' Hola Mundo!'
                };

                mailgun.messages().send(data, function (error, body) {
                    return res.redirect('/');
                });
            });

            self.apos.app.post('/paypal', function(req, res){
                console.log("RECEIVED WEBHOOK FROM PAYPAL");
                console.log(req.body);
                return res.redirect('/');
            })
        }

    }
};
