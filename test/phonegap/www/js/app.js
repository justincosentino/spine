(function(){
  'use strict';

  /* ----------------------------------------------------------------------- */

  var module = angular.module('app', ['onsen']);
  module.controller('DetailController', function($scope, $surveys) {
    $scope.item = $surveys.selectedItem;
  });

  /* ----------------------------------------------------------------------- */

  module.controller('MasterController', function($scope, $surveys) {
    $scope.items = $surveys.toDisplay; 
    
    $scope.showDetail = function(index) {
      var selectedItem = $scope.items[index];
      $surveys.selectedItem = selectedItem;
      $scope.ons.navigator.pushPage('detail.html', {title : selectedItem.title});
    };

  });

  /* ----------------------------------------------------------------------- */

  module.controller('AppController', function($scope, $surveys) {

    $scope.items = $surveys.toDisplay;

    document.addEventListener('deviceready', onDeviceReady, false);

    var onSuccess = function(acceleration) {

      // console.log(JSON.stringify(acceleration));

      for (var i = 0; i < $surveys.accelerometer.length; i++) { 
        var currentSurvey = $surveys.accelerometer[i];
        
        // console.log(currentSurvey.title + ' ' + currentSurvey.trigger.times);
        
        switch(currentSurvey.trigger.thresholdType) {
          case 'max':
              if (Math.abs(acceleration.x) < currentSurvey.trigger.threshold  ||
                  Math.abs(acceleration.y) < currentSurvey.trigger.threshold  ||
                  Math.abs(acceleration.z) < currentSurvey.trigger.threshold) {
                $surveys.sendSurvey(currentSurvey);
              }

              break;
              
          case 'min':
              if (Math.abs(acceleration.x) > currentSurvey.trigger.threshold  ||
                  Math.abs(acceleration.y) > currentSurvey.trigger.threshold  ||
                  Math.abs(acceleration.z) > currentSurvey.trigger.threshold) {
                $surveys.sendSurvey(currentSurvey);
              }

              break;

          default:
            console.log('Error: we should never get here');
        }

        $scope.items = $surveys.toDisplay;
        $scope.$apply();

      }
    };

    var intervalTriggers = function() {
      
      var intervalSend = function(currentSurvey) {
        console.log("sending the surveys");
        $surveys.sendSurvey(currentSurvey);
        $scope.$apply();
      }

      for (var i = 0; i < $surveys.intervals.length; i++) { 
        var currentSurvey = $surveys.intervals[i];
        setInterval(function() { intervalSend(currentSurvey) }, currentSurvey.trigger.interval);
      }

    }


    function onError() {
        alert('onError!');
    }

    var options = { frequency: 500 }; 
                    
    var bluetoothSuccess = function(error){
        alert('in success');
    }
                
    var bluetoothError = function(error){
        alert('in error '+error.error);
        alert('messg: '+ error.message);
    }
                    
    var startScanSuccessCallback = function(success){
        alert('2in success: '+success.status);
        alert('success: '+Object.keys(success));
        for(var obj in success){
            alert('key: '+obj+ ' value: '+success[obj]);
        }
    }
                    
    var startScanErrorCallback = function(error){
        alert('2in error '+error.error);
        alert('messg: '+ error.message);
    }
    
    $scope.doSomething = function() {
      setTimeout(function() {
        alert('Soon you can use this sick new feature!');
      }, 0);
    };

    function onDeviceReady() {  
      var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
      intervalTriggers();
      // bluetoothle.initialize(bluetoothSuccess, bluetoothError);
      // bluetoothle.startScan(startScanSuccessCallback, startScanErrorCallback, []);
      // bluetoothle.stopScan(stopScanSuccessCallback, stopScanErrorCallback);
      // bluetoothle.connect(connectSuccessCallback, connectErrorCallback, params);
      // bluetoothle.read(readSuccessCallback, readErrorCallback, params);
    }

  });

  /* ----------------------------------------------------------------------- */

  module.factory('$surveys', function() {
      
      // Survey 'class'/object to be returned by the factory
      var surveys = {};

      surveys.sendSurvey = function (currentSurvey) {
        if (currentSurvey.trigger.times == 'unlimited') {
          surveys.toDisplay.push(currentSurvey);
        }
        else if (currentSurvey.trigger.times > 0) {
          currentSurvey.trigger.times = currentSurvey.trigger.times - 1;  
          surveys.toDisplay.push(currentSurvey);
        }  
      }

      // Surveys that have been loaded by the application. This info will be 
      // added by the generator, but here are some placeholder surveys for now
      surveys.loadedItems = [
        { 
            title: 'Survey I (Acceleration, Max, 9, 1)',
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
            ],
            trigger: {
              type: 'acceleration',
              thresholdType: 'max',
              threshold: 9,
              times: 1
            }
        },
        { 
            title: 'Survey II (Acceleration, Min, 0, 1)',
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
            ],
            trigger: {
              type: 'acceleration',
              thresholdType: 'min',
              threshold: 0,
              times: 1
            }
        },
        { 
          title: 'Survey III (Acceleration, Min, 12, Unlimited)',
          desc: 'Triggered by shaking the device.',
          label: '[Health Food]',
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
          ],
          trigger: {
              type: 'acceleration',
              thresholdType: 'min',
              threshold: 12,
              times: 'unlimited'
          }
        },
        { 
          title: 'Survey IV (Interval, 10000 ms, 10)',
          desc: 'Triggered by shaking the device.',
          label: '[Health Food]',
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
          ],
          trigger: {
              type: 'interval',
              interval: 10000,
              times: 10
          }
        }
      ];

      // Surveys to be displayed in the application (currently active, awaiting action)
      surveys.toDisplay = [];

      // Surveys that are triggered by the accelerometer
      surveys.accelerometer = [];

      // Surveys that should be triggered at a certain time (e.g. 12:00 pm)
      surveys.time = [];

      // Surveys that should be triggered at regular intervals
      surveys.intervals = [];

      // Read in surveys to proper arrays
      for (var i = 0; i < surveys.loadedItems.length; i++) { 2
        var currentSurvey = surveys.loadedItems[i];
        switch(currentSurvey.trigger.type) {
          case 'acceleration':
            surveys.accelerometer.push(currentSurvey);
            break;

          case 'interval':
            surveys.intervals.push(currentSurvey);
            break;

          default:
            console.log('Error: we should never get here');
        }
      }
      return surveys;
  });
})();
