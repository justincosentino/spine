(function(){
  'use strict';
  var module = angular.module('app', ['onsen']);

  module.controller('AppController', function($scope, $surveys) {
    $scope.doSomething = function() {
      setTimeout(function() {
        alert('Soon you can use this sick new feature!');
      }, 100);
    };
  });

  module.controller('DetailController', function($scope, $surveys) {
    $scope.item = $surveys.selectedItem;
  });

  module.controller('MasterController', function($scope, $surveys) {
    $scope.items = $surveys.items; 
    
    $scope.showDetail = function(index) {
      var selectedItem = $scope.items[index];
      $surveys.selectedItem = selectedItem;
      $scope.ons.navigator.pushPage('detail.html', {title : selectedItem.title});
    };

    $scope.addSurvey = function() {
      setTimeout(function() {
        $scope.items = [
          { 
              title: 'Survey I',
              desc: 'This could be the coolest, most relevant survey ever.',
              label: '[Mental Health]',
              questions: [ 
                          {
                            type: 'radio',
                            question: 'What is you favourite CS course?',
                            options: ['CS91','CS21','CS97']
                          }, 
                          {
                            type: 'text',
                            question: 'Is this a super cool project?'

                          },
                          {
                            type: 'range',
                            question: 'Drag the thing to do the stuff based on your feelings:',
                            max: 100,
                            min: 0
                          }
              ]
          },
          { 
              title: 'Survey II',
              desc: 'This could be the second coolest, most relevant survey ever.',
              label: '[Physical Health]',
              questions: [ 
                          {
                            type: 'radio',
                            question: 'What is you favourite CS course?',
                            options: ['CS91','CS21','CS97']
                          }, 
                          {
                            type: 'text',
                            question: 'Is this a super cool project?'

                          },
                          {
                            type: 'range',
                            question: 'Drag the thing to do the stuff based on your feelings:',
                          },
                          {
                            type: 'range',
                            question: 'Drag the thing to do the stuff based on your feelings:',
                          }
              ]
          }
        ];
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

// function onSuccess(acceleration) {
//   alert('Acceleration X: ' + acceleration.x + '\n' +
//         'Acceleration Y: ' + acceleration.y + '\n' +
//         'Acceleration Z: ' + acceleration.z + '\n' +
//         'Timestamp: '      + acceleration.timestamp + '\n');
// };

// function onError() {
//     alert('onError!');
// };

// navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);