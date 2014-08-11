var utils = function () {

  var validUrl = require('valid-url');

  this.isValidUrl = function (url) {
    if (validUrl.isUri(url))
      return true;
    return false;
  };

  this.validateEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  this.isAlphaNumeric = function (string) {
    if (!string.match(/^[a-z\d\-_\s]+$/i))
      return false;
    return true;
  };

  this.addhttp = function (url) {
     if (!/^(f|ht)tps?:\/\//i.test(url)) {
        url = "http://" + url;
     }
     return url;
  },

  this.getExtension = function (filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
  }

};

module.exports = new utils;