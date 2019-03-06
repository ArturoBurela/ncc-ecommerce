module.exports = {
  extend: 'apostrophe-pieces',
  name: 'ncc-emails',
  label: 'Email',
  addFields: [
    {
      name: 'from',
      type: 'string',
      label: 'From (if not added, it is used env variable config)'
      // required: true
    },
    {
      name: '_users',
      label: 'Users',
      // Must match the `name` option given when configuring `fabric` as a subclass of pieces.
      // You could skip this since the name of the join matches the name of the other type.
      withType: 'apostrophe-user',
      type: 'joinByArray',
      idsFields: 'usersIds',
      filters: {
        // Fetch just enough information
        projection: {
          email: 1,
          title: 1,
          _id: 1
        }
      },
      required: true
    },
    {
      type: 'select',
      name: 'template',
      label: 'Available templates',
      choices: [
        {
          label: 'Order Completed',
          value: 'orderCompleted'
        }
      ],
      required: true
    },
    {
      name: 'info',
      type: 'string',
      label: 'Template dynamic info, ex: {"price":"10",..}',
      //required: true
    }
  ],
  construct: function(self, options) {
    self.afterInsert = function(req, piece, options, callback) {
      self.apos.docs.db.find({
        _id: { $in: piece.usersIds }
      }, {email: 1, firstName: 1}).toArray((err, usersInfo) => {
        if (err) callback(err);
        else {
          const emails = [];
          for (const userInfo of usersInfo) {
            emails.push(userInfo.email);
          }
          return self.email(req, piece.template, {
            info: JSON.parse(piece.info)
          }, {
          // can also specify from and other
          // valid properties for nodemailer messages here
            to: emails,
            from: (piece.from !== '') ? piece.from : req.data.global.defaultFromEmail,
            subject: piece.title
          },
          callback
          );
        }
      });

    };
  }
};
