// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    console.log(req);

    db.Company.create({ name: req.body.company }).then( (dbCompany) => {
      db.User.create({
        firstName: req.body.name,
        lastName: req.body.last,
        email: req.body.email,
        password: req.body.password,
        CompanyId: dbCompany.id
      })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
    });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
        CompanyId: req.user.CompanyId
      });
    }
  });

  // To insert new products from Seller.html @@todo Add products.js to main.handlebars 
  app.get("api/products", (req, res) => {
    console.log(req);

    const { name, desc, quant, minLen, minLenUnits, rate, category, contract, CompanyId } = req.body;

    //@@ todo relate every product created to a company. could use logged in user data.

    db.Product.create({
      product_name: name,
      product_description: desc,
      quantity: quant,
      min_length: minLen,
      min_lengthUnits: minLenUnits,
      rate: rate,
      category: category,
      contract: contract,
      CompanyId: CompanyId
    });
  });
};
