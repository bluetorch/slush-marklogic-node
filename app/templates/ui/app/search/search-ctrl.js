(function () {
  'use strict';

  angular.module('sample.search')
    .controller('SearchCtrl', ['$scope', 'MLRest', '$location', function ($scope, mlRest, $location) {
      var model = {
        selected: [],
        text: ''
      };

      var searchContext = mlRest.createSearchContext();

      function updateSearchResults(data) {
        model.search = data;
      }

      (function init() {
        searchContext.search().then(updateSearchResults);
      })();

      angular.extend($scope, {
        model: model,
        selectFacet: function(facet, value) {
          var existing = model.selected.filter( function( selectedFacet ) {
            return selectedFacet.facet === facet && selectedFacet.value === value;
          });
          if ( existing.length === 0 ) {
            model.selected.push({facet: facet, value: value});
            searchContext.selectFacet(facet, value).then(updateSearchResults);
          }
        },
        clearFacet: function(facet, value) {
          var i;
          for (i = 0; i < model.selected.length; i++) {
            if (model.selected[i].facet === facet && model.selected[i].value === value) {
              model.selected.splice(i, 1);
              break;
            }
          }
          searchContext.clearFacet(facet, value).then(updateSearchResults);
        },
        textSearch: function() {
          searchContext.setText(model.text).then(updateSearchResults);
          $location.path('/');
        }
      });
    }]);
}());
