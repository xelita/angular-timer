/**
 * Angular Timer Module.
 */
var angularTimerModule = angular.module('angularTimerModule', []);

// Constants

/**
 * Constants service used in the whole module.
 */
angularTimerModule.constant('angularTimerConstants', {
    apiVersion: '1.0.0',
    defaultSettings: {
        'autoStart': false,
        'intervalMs': 5000,
        'eventName': 'angular-timer-tick'
    }
});

// Services

/**
 * Main service where all the magic happens.
 */
angularTimerModule.factory('angularTimerService', ['$rootScope', '$log', 'angularTimerConstants', function ($rootScope, $log, angularTimerConstants) {

    /**
     * Emitter function called when a new timer is started,
     * @param timerConfig the timer configuration
     */
    var eventEmitterFunction = function (timerConfig) {
        $log.debug('eventEmitterFunction invoked.');
        $rootScope.$broadcast(timerConfig.eventName, {});
    };

    return {
        /**
         * Return the default settings of this module.
         */
        defaultSettings: function () {
            $log.debug('angularTimerService.defaultSettings.');
            return angularTimerConstants.defaultSettings;
        },

        /**
         * Start a new timer based on the given configuration.
         * @param timerConfig the timer configuration
         * @returns {number} the timerId
         */
        startTimer: function (timerConfig) {
            $log.debug('IN angularTimerService.startTimer.');

            // Wrapper function to inject parameter in setInterval function
            var wrapperFunction = function () {
                eventEmitterFunction(timerConfig);
            };
            return setInterval(wrapperFunction, timerConfig.intervalMs);
        },

        /**
         * Stop the timer identified by its id.
         * @param timerId the timer identifier
         */
        stopTimer: function (timerId) {
            $log.debug('IN angularTimerService.stopTimer.');
            clearInterval(timerId);
        }
    };
}]);

// Directives

/**
 * Directive responsible for creating a timer.
 */
angularTimerModule.directive('ngTimer', function ($log, angularTimerService) {
    return {
        priority: 0,
        restrict: 'E',
        scope: {
            autoStart: '@startAuto',
            intervalMs: '@',
            eventName: '@'
        },
        link: function (scope, element, attr) {
            // timerId
            var timerId;

            // Function responsible for starting the timer
            var timerInitFunction = function () {
                $log.debug('IN ngTimer.timerInitFunction.');

                // Extract scope data
                var autoStart = angular.isDefined(scope.autoStart) ? scope.autoStart === 'true' : angularTimerService.defaultSettings().autoStart;
                var eventName = scope.eventName || angularTimerService.defaultSettings().eventName;
                var intervalMs = Number(scope.intervalMs) || angularTimerService.defaultSettings().intervalMs;

                // Timer config
                var timerConfig = {
                    'autoStart': autoStart,
                    'eventName': eventName,
                    'intervalMs': intervalMs
                };
                $log.debug('timerConfig is: ' + angular.toJson(timerConfig));

                // Stop the previous running timer if it exists
                if (timerId) {
                    $log.warn('A timer with id [' + timerId + '] is currently running. It will be stop...');
                    angularTimerService.stopTimer(timerId);
                }

                // If autoStart is set to true, start a new timer
                if (timerConfig.autoStart === true) {
                    timerId = angularTimerService.startTimer(timerConfig);
                    $log.warn('A new timer with id [' + timerId + '] has been started.');
                }
            };

            // Init the timer when scope variables have been changed
            scope.$watch('autoStart', function () {
                timerInitFunction();
            });
            scope.$watch('intervalMs', function () {
                timerInitFunction();
            });
            scope.$watch('eventName', function () {
                timerInitFunction();
            });
        }
    };
});