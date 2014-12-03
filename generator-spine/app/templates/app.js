(function(){
  'use strict';
  var module = angular.module('app', ['onsen']);
  var loader = SurveyLoader();
  console.log(loader.surveys);
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
      //alert("addding survey");
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

  module.controller('AppController', function($scope) {
    $scope.doSomething = function() {
      setTimeout(function() {
        alert('Soon you can use this sick new feature!');
      }, 100);
    };

    document.addEventListener('deviceready', onDeviceReady, false);

    var onSuccess = function(acceleration) {
      if (Math.abs(acceleration.x) > 8 ||
          Math.abs(acceleration.y) > 8 ||
          Math.abs(acceleration.z) > 10) {
            var newSurvey = { 
              title: acceleration.timestamp,
              desc: 'Triggered by shaking the device.',
              label: '[General Health]',
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
                            question: 'Drag the thing to do the stuff based on your feelings:'
                          }
              ]
            };
            alert(Object.keys(this));
            //this.addSurvey(newSurvey);
            alert("WE ARE ACCELERATING WEEEEEEE");
      }
    };
    var temp = onSuccess.bind($scope);

    function onError() {
        alert('onError!');
    }

    var options = { frequency: 3000 }; 
                    
    var bluetoothSuccess = function(error){
        alert("in success");
    }
                
    var bluetoothError = function(error){
        alert("in error "+error.error);
        alert("messg: "+ error.message);
    }
                    
    var startScanSuccessCallback = function(success){
        alert("2in success: "+success.status);
        alert("success: "+Object.keys(success));
        for(var obj in success){
            alert("key: "+obj+ " value: "+success[obj]);
        }
    }
                    
    var startScanErrorCallback = function(error){
        alert("2in error "+error.error);
        alert("messg: "+ error.message);
    }

    function onDeviceReady() {  
      console.log(navigator.accelerometer);
      var watchID = navigator.accelerometer.watchAcceleration(temp, onError, options);
      bluetoothle.initialize(bluetoothSuccess, bluetoothError);
      bluetoothle.startScan(startScanSuccessCallback, startScanErrorCallback, []);
      /*bluetoothle.stopScan(stopScanSuccessCallback, stopScanErrorCallback);
      bluetoothle.connect(connectSuccessCallback, connectErrorCallback, params);
      bluetoothle.read(readSuccessCallback, readErrorCallback, params);*/
    }

  });

  module.factory('$surveys', function() {
      var surveys = {};
      surveys.items = [];
      return surveys;
  });
})();

var SurveyLoader = module.exports = function() {

  var reader = new FileReader();
  
  reader.onload = function(e) {
      var text = reader.result;
      this.surveys = text;
  }

  reader.readAsText('phonegap/www/surveys.json', encoding);
};