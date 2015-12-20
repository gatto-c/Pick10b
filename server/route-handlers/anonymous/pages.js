module.exports.applicationPage = function*() {
  this.body = yield this.render('application')
}
