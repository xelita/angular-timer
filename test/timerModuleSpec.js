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

        var timerCallback;

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
});