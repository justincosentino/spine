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
        
        // console.log(currentSurvey.title + ' ' + currentSurvey.trigger.occurrences);
        
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
        $surveys.sendSurvey(currentSurvey);
        $scope.$apply();
      }

      for (var i = 0; i < $surveys.intervals.length; i++) { 
        var currentSurvey = $surveys.intervals[i];
        setInterval(function() { intervalSend(currentSurvey) }, currentSurvey.trigger.interval);
      }

    }

    var timeTriggers = function() {

      var intervalSend = function (currentSurvey) {
        $surveys.sendSurvey(currentSurvey);
        $scope.$apply();
      }

      function daily(currentSurvey) {
        (function loop() {
            var now = new Date();
            console.log('=======================================================');
            console.log("CHECKING!!!!");
            console.log("Hours: " + now.getHours() + " Minutes: " + now.getMinutes());
            console.log(JSON.stringify(currentSurvey.trigger));
            console.log('=======================================================');
            if (now.getHours() === currentSurvey.trigger.hour && 
                now.getMinutes() === currentSurvey.trigger.minute &&
                now.getSeconds() === currentSurvey.trigger.second) {
                intervalSend(currentSurvey);
            }
            now = new Date();                  // allow for time passing
            var delay = 60000 - (now % 60000); // exact ms to next minute interval
            setTimeout(loop, delay);
        })();
      }

      for (var i = 0; i < $surveys.time.length; i++) { 
        var currentSurvey = $surveys.time[i];
        switch(currentSurvey.trigger.interval) {
          case 'daily':
            daily(currentSurvey);
            // var now = new Date();
            // var millisTillOccur = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 
            //   currentSurvey.trigger.hour, currentSurvey.trigger.minute, currentSurvey.trigger.second, 0) - now;
            // console.log(millisTillOccur);
            // setTimeout(function() { startIntervalSending(currentSurvey, 86400000) }, millisTillOccur);
            break;

          case 'weekly':
            break;

          case 'yearly':
            break;

          default:
            console.log('Error: we should never get here');
        }
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
      // Watch accelerometer data when the application is open (TODO: Enable background mode?)
      var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
      
      // Init interval triggers to run when the application is open (TODO: Enable background mode?)
      intervalTriggers();

      // Init time triggers to run when the application is open (TODO: Enable background mode?)
      timeTriggers();

      // Called on startup to prompt the user for Location permission if they have not done so already
      window.navigator.geolocation.getCurrentPosition(function(location) {
        console.log('HealthApp: initial geolocation tracking.');
      });

      var bgGeo = window.plugins.backgroundGeoLocation;

      /**
      * This would be your own callback for Ajax-requests after POSTing background geolocation to your server.
      */
      var yourAjaxCallback = function(response) {
          ////
          // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
          //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
          //
          //
          bgGeo.finish();
      };

      /**
      * This callback will be executed every time a geolocation is recorded in the background.
      */
      var callbackFn = function(location) {
          console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
          // Do your HTTP request here to POST location to your server.
          //
          //
          yourAjaxCallback.call(this);
      };

      var failureFn = function(error) {
          console.log('BackgroundGeoLocation error');
      }

      // BackgroundGeoLocation is highly configurable.
      bgGeo.configure(callbackFn, failureFn, {
          url: 'http://only.for.android.com/update_location.json', // <-- Android ONLY:  your server url to send locations to
          params: {
              auth_token: 'user_secret_auth_token',    //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
              foo: 'bar'                              //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
          },
          headers: {                                   // <-- Android ONLY:  Optional HTTP headers sent to your configured #url when persisting locations
              "X-Foo": "BAR"
          },
          desiredAccuracy: 10,
          stationaryRadius: 20,
          distanceFilter: 30,
          notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
          notificationText: 'ENABLED', // <-- android only, customize the text of the notification
          activityType: 'AutomotiveNavigation',
          debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
          stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates
      });

      // Turn ON the background-geolocation system.
      bgGeo.start();


      // bluetoothle.initialize(bluetoothSuccess, bluetoothError, []);
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
        if (currentSurvey.trigger.occurrences == 'unlimited') {
          surveys.toDisplay.push(currentSurvey);
        }
        else if (currentSurvey.trigger.occurrences > 0) {
          currentSurvey.trigger.occurrences = currentSurvey.trigger.occurrences - 1;  
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
              occurrences: 1
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
              occurrences: 1
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
              occurrences: 'unlimited'
          }
        },
        { 
          title: 'Food Survey',
          desc: 'Please answer the below questions about your most recent meal.',
          label: '[Health Food]',
          questions: [ 
                      {
                        type: 'radio',
                        question: 'What meal did you just eat?',
                        options: ['Breakfast','Lunch','Dinner','Snack','Other']
                      }, 
                      {
                        type: 'text',
                        question: 'Please describe the food that you consumed during this meal:'

                      },
                      {
                        type: 'range',
                        question: 'How did you feel after this meal?'
                      }
          ],
          trigger: {
              type: 'interval',
              interval: 10000,
              occurrences: 3
          }
        },
        { 
          title: 'Food Survey',
          desc: 'Please answer the below questions about your most recent meal.',
          label: '[Health Food]',
          questions: [ 
                      {
                        type: 'radio',
                        question: 'What meal did you just eat?',
                        options: ['Breakfast','Lunch','Dinner','Snack','Other']
                      }, 
                      {
                        type: 'text',
                        question: 'Please describe the food that you consumed during this meal:'

                      },
                      {
                        type: 'range',
                        question: 'How did you feel after this meal?'
                      }
          ],
          trigger: {
              type: 'time',
              interval: 'daily',
              hour: 14,
              minute: 48,
              second: 0,
              occurrences: 3
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

          case 'time':
            surveys.time.push(currentSurvey);
            break;

          default:
            console.log('Error: we should never get here');
        }
      }
      return surveys;
  });
})();
