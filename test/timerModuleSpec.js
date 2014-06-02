describe("angularTimerModule Tests Suite", function () {

    // angularTimerConstants

    describe("angularTimerConstants Tests", function () {

        var angularTimerConstants;

        beforeEach(function () {
            module('angularTimerModule');
            inject(function (_angularTimerConstants_) {
                angularTimerConstants = _angularTimerConstants_;
            });
        });

        it("should define api version", function () {
            expect(angularTimerConstants.apiVersion).toBe('1.0.0');
        });

        it("should define default settings for the timer", function () {
            expect(angularTimerConstants.defaultSettings.autoStart).toBeFalsy();
            expect(angularTimerConstants.defaultSettings.intervalMs).toBe(5000);
            expect(angularTimerConstants.defaultSettings.eventName).toBe('angular-timer-tick');
        });
    });

    // angularTimerService

    describe('angularTimerService Tests', function () {

        var $rootScope;
        var angularTimerService;
        var angularTimerConstants;

        beforeEach(function () {
            module('angularTimerModule');
            inject(function (_angularTimerConstants_, _angularTimerService_, _$rootScope_) {
                $rootScope = _$rootScope_;
                angularTimerService = _angularTimerService_;
                angularTimerConstants = _angularTimerConstants_;

                jasmine.clock().install();
            });
        });

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it('should provide default settings for the timer', function () {
            expect(angularTimerService.defaultSettings().autoStart).toBeFalsy();
            expect(angularTimerService.defaultSettings().intervalMs).toBe(5000);
            expect(angularTimerService.defaultSettings().eventName).toBe('angular-timer-tick');
        });

        it('should be able to start a new timer', function () {
            var timerConfig = {eventName: 'myEvent', intervalMs: 100};

            spyOn(window, 'setInterval').and.callThrough();
            spyOn($rootScope, '$broadcast');

            angularTimerService.startTimer(timerConfig);
            expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 100);

            expect($rootScope.$broadcast).not.toHaveBeenCalled();
            jasmine.clock().tick(101);
            expect($rootScope.$broadcast).toHaveBeenCalledWith('myEvent', {});
        });

        it('should be able to stop the currently running timer', function () {
            spyOn(window, 'clearInterval');
            angularTimerService.stopTimer('timerId');
            expect(window.clearInterval).toHaveBeenCalledWith('timerId');
        });
    });

    // ngTimer

    describe('ngTimer tests', function () {

        var angularTimerService;
        var angularTimerConstants;

        var scope;
        var element;

        beforeEach(function () {
            module('angularTimerModule');
            inject(function (_angularTimerConstants_, _angularTimerService_, _$rootScope_) {
                angularTimerService = _angularTimerService_;
                angularTimerConstants = _angularTimerConstants_;

                scope = _$rootScope_.$new();
            });
        });

        it("should watch startAuto and start timer if autoStart is set to true", function () {
            inject(function ($compile) {
                element = $compile("<ng-timer start-auto='{{startAuto}}'></ng-timer>")(scope);
            });

            spyOn(angularTimerService, 'startTimer');

            scope.startAuto = true;
            scope.$digest();

            var expectedTimerConfig = {
                'autoStart': true,
                'eventName': angularTimerConstants.defaultSettings.eventName,
                'intervalMs': angularTimerConstants.defaultSettings.intervalMs
            };
            expect(angularTimerService.startTimer).toHaveBeenCalledWith(expectedTimerConfig);
        });

        it("should watch startAuto and not start timer if autoStart is not set to true", function () {
            inject(function ($compile) {
                element = $compile("<ng-timer start-auto='{{startAuto}}'></ng-timer>")(scope);
            });

            spyOn(angularTimerService, 'startTimer');

            scope.startAuto = false;
            scope.$digest();

            expect(angularTimerService.startTimer).not.toHaveBeenCalled();
        });

        it("should watch eventName", function () {
            inject(function ($compile) {
                element = $compile("<ng-timer start-auto='true' event-name='{{eventName}}'></ng-timer>")(scope);
            });

            spyOn(angularTimerService, 'startTimer');

            scope.eventName = 'custom-tick';
            scope.$digest();

            var expectedTimerConfig = {
                'autoStart': true,
                'eventName': 'custom-tick',
                'intervalMs': angularTimerConstants.defaultSettings.intervalMs
            };
            expect(angularTimerService.startTimer).toHaveBeenCalledWith(expectedTimerConfig);
        });

        it("should watch intervalMs", function () {
            inject(function ($compile) {
                element = $compile("<ng-timer start-auto='true' interval-ms='{{intervalMs}}'></ng-timer>")(scope);
            });

            spyOn(angularTimerService, 'startTimer');

            scope.intervalMs = 1000;
            scope.$digest();

            var expectedTimerConfig = {
                'autoStart': true,
                'eventName': angularTimerConstants.defaultSettings.eventName,
                'intervalMs': 1000
            };
            expect(angularTimerService.startTimer).toHaveBeenCalledWith(expectedTimerConfig);
        });

        it("should stop timer if a timer is running", function () {
            inject(function ($compile) {
                element = $compile("<ng-timer start-auto='{{startAuto}}'></ng-timer>")(scope);
            });

            spyOn(angularTimerService, 'startTimer').and.callThrough();
            spyOn(angularTimerService, 'stopTimer').and.callThrough();

            scope.startAuto = false;
            scope.$digest();
            expect(angularTimerService.startTimer).not.toHaveBeenCalled();

            scope.startAuto = true;
            scope.$digest();
            expect(angularTimerService.startTimer).toHaveBeenCalled();

            scope.startAuto = false;
            scope.$digest();
            expect(angularTimerService.stopTimer).toHaveBeenCalled();
        });
    });
});