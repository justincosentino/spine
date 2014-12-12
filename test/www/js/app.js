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
              //if (Math.abs(acceleration.x) < currentSurvey.trigger.threshold  ||
              //    Math.abs(acceleration.y) < currentSurvey.trigger.threshold  ||
              //    Math.abs(acceleration.z) < currentSurvey.trigger.threshold) {
              //  $surveys.sendSurvey(currentSurvey);
              //}
              $surveys.sendSurvey(currentSurvey);

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
                    
    $scope.doSomething = function() {
      setTimeout(function() {
        alert('Soon you can use this sick new feature!');
      }, 0);
    };

    
    /***
    ** BLUETOOTH STUFF
    ***/

    var heartrates = [];

    var bluetoothSuccess = function(success){
        alert("in initialize success");
        bluetoothle.startScan(startScanSuccessCallback, startScanErrorCallback, []);
    }
                
    var bluetoothError = function(error){
        alert("initalization error: "+JSON.stringify(error));
    }
                    
    var startScanSuccessCallback = function(success){
        alert("scan success: "+success.status);
        if( success['address'] ){
            alert("found bluetooth: "+JSON.stringify(success));
            var params = {"address": success['address']};
            bluetoothle.stopScan(stopScanSuccessCallback, stopScanErrorCallback);
            bluetoothle.connect(connectSuccessCallback, connectErrorCallback, params);
        }
    }
                    
    var startScanErrorCallback = function(error){
        alert("in error "+error.error);
        alert("messg: "+ error.message);
    }
                    
    var stopScanErrorCallback = function(error){
        alert("stopping error: "+JSON.stringify(error));
    }
                    
    var stopScanSuccessCallback = function(error){
        alert("stopping success: "+JSON.stringify(error));
    }
                    
    var connectErrorCallback = function(error){
        alert("connecting error: "+JSON.stringify(error));
    }
                    
    var connectSuccessCallback = function(success){
        alert("connected: "+JSON.stringify(success));
        var params = {};
        params['address'] = success['address'];
        params['serviceUuids'] = [];
        if(success['status'] == "connected"){
            bluetoothle.discover(discoverSuccess, discoverError, params);
        }
    }

    var discoverError = function(error){
        alert("discover error: "+JSON.stringify(error));
    }
                    
    var discoverSuccess = function(success){
        alert("discover: "+JSON.stringify(success));
        alert("num services: "+success["services"].length);
        for( var i = 0; i < success["services"].length; i++ ){
            var par = success["services"][i];
            if( par["serviceUuid"] == "180d" ){
                alert("heart rate");
            }
            //alert(JSON.stringify(par));
            for( var j = 0; j < par["characteristics"].length; j++ ){
                var c = par["characteristics"][j];
                if( c["characteristicUuid"] == "2a37" ){
                    alert("found it");
                    var params = {};
                    params["address"] = success["address"];
                    params["serviceUuid"] = par["serviceUuid"];
                    params["characteristicUuid"] = c["characteristicUuid"];
                    params["isNotification"] = true;
                    bluetoothle.subscribe(subscribeSuccess, subscribeError, params);
                }
                
            }
            //if( par["characteristics"]
        }
    }

    var subscribeSuccess = function(success){
        //alert("success: "+JSON.stringify(success));
        var value = bluetoothle.encodedStringToBytes(success["value"]);
        //alert("value: "+value);
        var heartbeat = value["1"];
        heartrates.push(heartbeat);
        if( heartrates.length % 20 == 0 ){
            alert(heartrates);
        }

    }

    var subscribeError = function(error){
        alert("error: "+JSON.stringify(error));
    }

    var readSuccess = function(success){
        alert("success: "+JSON.stringify(success));
    }

    var readError = function(error){
        alert("error: "+JSON.stringify(error));
    }


    /***
    ** END OF BLUETOOTH STUFF
    ***/

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

      var params = { "request": true, "statusReceiver": false};
      alert("bluetooth: "+JSON.stringify(bluetoothle));
      bluetoothle.initialize(bluetoothSuccess, bluetoothError, params);
      
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

      var surveyLoader = new SurveyLoader();
      surveys.loadedItems = surveyLoader.get();

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
