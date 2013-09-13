var url = require('url');
var path = require('path');

var Products = module.exports = function() {
  this.products = {
    1234: {
      id: 1234,
      name: 'Tabasco Sauce'
    }
  };
};

Products.prototype.init = function(config) {
  config
    .path('/store/products')
    .produces('application/json')
    .get({
      path: '/',
      handler: this.list,
      operation: 'rest.products.list'
    })
    .post({
      path: '/',
      handler: this.create,
      consumes: ['application/json'],
      operation: 'rest.products.create',
    })
    .get({
      path: '/{id}',
      handler: this.show,
      operation: 'rest.products.show'
    })
    .del({
      path: '/{id}',
      handler: this.remove,
      operation: 'rest.products.remove'
    })
    .bind(this);
};

Products.prototype.create = function(env, next) {
  var products = this.products;

  env.request.getBody(function(err, body) {
    var product = JSON.parse(body.toString());

    products[product.id] = product;

    var uri = env.argo.uri();
    var parsed = url.parse(uri);
    parsed.pathname = path.join(parsed.pathname, product.id.toString());
    var location = url.format(parsed);

    env.response.statusCode = 201;
    env.response.setHeader('Location', location);

    next(env);
  });
};

Products.prototype.list = function(env, next) {
  var products = [];

  for(var key in this.products) {
    products.push(this.products[key]);
  }

  env.response.body = products;
  next(env);
};

Products.prototype.show = function(env, next) {
  var product = this.products[parseInt(env.route.params.id)];
  env.response.body = product;
  next(env);
};

Products.prototype.remove = function(env, next) {
  var id = env.route.params.id;
  delete this.products[id];

  env.response.statusCode = 204;

  next(env);
};
