(function(){
  'use strict';
  var module = angular.module('app', ['onsen']);

  module.controller('AppController', function($scope, $surveys) {
    $scope.doSomething = function() {
      setTimeout(function() {
        alert('tapped');
      }, 100);
    };
  });

  module.controller('DetailController', function($scope, $surveys) {
    $scope.item = $surveys.selectedItem;
  });

  module.controller('MasterController', function($scope, $surveys) {
    $scope.items = $surveys.items; 
    
    $scope.showDetail = function(index) {
      var selectedItem = $surveys.items[index];
      $surveys.selectedItem = selectedItem;
      $scope.ons.navigator.pushPage('detail.html', {title : selectedItem.title});
    };

    $scope.addSurvey = function() {
      setTimeout(function() {
        console.log($scope.items);
        $scope.items = [
          { 
              title: 'Survey 1',
              desc: 'This could be the coolest, most relevant survey ever.',
              questions: [ 
                          {

                          }, 
                          {

                          }, 
                          {

                          }
              ]
          }
        ];
        console.log($scope.items);
        $scope.$apply();
      }, 2000);
    };

    $scope.addSurvey();

  });

  module.factory('$surveys', function() {
      var surveys = {};
      surveys.items = [];
      return surveys;
  });
})();

function onSuccess(acceleration) {
  alert('Acceleration X: ' + acceleration.x + '\n' +
        'Acceleration Y: ' + acceleration.y + '\n' +
        'Acceleration Z: ' + acceleration.z + '\n' +
        'Timestamp: '      + acceleration.timestamp + '\n');
};

function onError() {
    alert('onError!');
};

//

navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);

