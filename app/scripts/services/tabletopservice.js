'use strict';

/**
 * @ngdoc service
 * @name stpApp.tabletopService
 * @description
 * # tabletopService
 * Factory in the stpApp.
 */
angular.module('stpApp')
  .factory('tabletopService', ['$rootScope', function ($rootScope) {
    // Tabletop API wapper for Google Spreadsheets
    return {
      query: function (cb) {
        Tabletop.init({
          key: '1qaB-6mVdmQvQkf0S0IeSfOP2rsHmQFxNK7PlnoHfQrI',
          parseNumbers: true,
          callback: function(data){
            if(cb && typeof(cb) === 'function'){
              $rootScope.$apply(function(){
                cb(data);
              });
            }
          }
        });
      }
    };
  }]);
