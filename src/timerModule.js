/**
 * Angular Polling Module.
 */
var angularPollingModule = angular.module('angularPollingModule', []);

// Constants

/**
 * Constants service used in the whole module.
 */
angularPollingModule.constant('angularPollingConstants', {
    defaultSettings: { 
        'autoStart': false,        
        'intervalMs': 5000,
        'eventName': 'poller-tick'        
    }
});

// Services

/**
 * Main service where all the magic happens.
 */
angularPollingModule.factory('angularPollingService', ['$rootScope', '$log', 'angularPollingConstants', function ($rootScope, $log, angularPollingConstants) {
  
    // Interval function
    var eventEmitterFunction = function(pollerConfig) {
        $log.debug('eventEmitterFunction invoked.');
        $rootScope.$broadcast(pollerConfig.eventName, {});
    }; 
    
    return {
        /**
         * Return the default settings of this module.
         */
        defaultSettings: function () {
            $log.debug('angularPollingService.defaultSettings.');
            return angularPollingConstants.defaultSettings;
        },
        
        startPoller: function (pollerConfig) {
            $log.debug('angularPollingService.startPoller.');
           
            // Wrapper function to inject parameter in setInterval function
            var wrapperFunction = function() { 
                eventEmitterFunction(pollerConfig); 
            };
            return setInterval(wrapperFunction, pollerConfig.intervalMs);
        },
        
        stopPoller: function (pollerId) {
            $log.debug('angularPollingService.stopPoller.');
            clearInterval(pollerId);
        }       
    };
}]);

// Controllers

/**
 * Convenience controller that registers service in its scope.
 */
angularPollingModule.controller('angularPollingCtrl', ['$scope', '$log', 'angularPollingService', 'angularPollingConstants', function ($scope, $log, angularPollingService, angularPollingConstants) {

    $scope.pollingStarted = false;
    $scope.togglePollerStatus = function() {
       $scope.pollingStarted = !$scope.pollingStarted; 
    };
    
    $scope.$on('poll-tick-handler', function(){
        $log.debug('tick!');
    });
    
    // Export the angularPollingService in the controller scope
    $scope.angularPollingService = angularPollingService;

    // Export the angularPollingConstants in the controller scope
    $scope.angularPollingConstants = angularPollingConstants;
}]);

// Directives

angularPollingModule.directive('ngPoll', function($log, angularPollingService) {
    return {
        priority: 0,
        restrict: 'E',
        scope: {
            autoStart: '@startAuto',
            intervalMs: '@',
            eventName: '@'
        },
        link: function(scope, element, attr) {
            // pollerId
            var pollerId;
            
            // Extract scope data
            var autoStart = scope.autoStart === true;
            var eventName = scope.eventName || angularPollingService.defaultSettings().eventName;
            var intervalMs = Number(scope.intervalMs) || angularPollingService.defaultSettings().intervalMs;
            
            var timerInitFunction = function(autoStart, eventName, intervalMs) {
                $log.debug('IN ngPool.timerInitFunction.');
              
                // Poller config
                var pollerConfig = {
                    'autoStart': autoStart,
                    'eventName': eventName, 
                    'intervalMs': intervalMs 
                };
                $log.debug('pollerConfig is: ' + angular.toJson(pollerConfig));
                
                // If autoStart is set to true, start the poller
                if(pollerConfig.autoStart === true) {
                    pollerId = angularPollingService.startPoller(pollerConfig);
                    $log.debug('pollerId is:' + pollerId);
                } else if(pollerId) {
                    $log.debug('pollerId to stop is:' + pollerId);
                    pollerId = angularPollingService.stopPoller(pollerId);
                };  
            };
            
            // Init the timer
            scope.$watch('autoStart', function(oldValue, newValue) {
                $log.debug('oldValue: ' + oldValue);
                $log.debug('newValue: ' + newValue);
                $log.debug('newValue boolean: ' + newValue === true);
                timerInitFunction(newValue === true, scope.eventName, scope.intervalMs);
            });
        }        
    };
});