function log(req, res, next) {
  console.log('Logueado...');
  next()
}

module.exports = log;
