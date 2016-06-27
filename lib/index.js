/*
 * metalsmith-swig-helpers
*/

'use strict';

var swig = require("swig"),
    debug = require("debug")("metalsmith-swig-helpers");

module.exports = function plugin( data ) {

    data = (('object' === typeof data)? data : undefined) || {};

    return function through (files, metalsmith, done) {

        swig.setFilter('slug', require('./slugify'));

        swig.setFilter('isSlugMatch', require('./isSlugMatch'));

        swig.setFilter('limit', require('./limit'));

        swig.setFilter('bustcache', require('./bustcache'));


         swig.setFilter('randomElement', function (input) {
           if (!input || !Array.isArray(input)) {
             return input;
           }
           // randomly choose an element from the array
           var index = [Math.floor(Math.random() * input.length)];
           return input[index];
         });

        // Dynamic Filters
        // Take an array of functions or strings.
        for (var name in data.filters || {}) {
          var filter = null;
          switch (typeof data.filters[name]) {
            case "string":
              filter = require(data.filters[name]);
              break;
            case "function":
            default:
              filter = data.filters[name];
              break;
          }
          swig.setFilter(name, filter);
        }


        done();

    };
}
