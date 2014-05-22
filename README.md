# [angular-timer][![Build Status](https://travis-ci.org/xelita/angular-timer.png?branch=master)](https://travis-ci.org/xelita/angular-timer)

This project offers timer service support to [AngularJS](http://angularjs.org) applications.

## Quick start

+ Include timerModule.js in your AngularJS application.

```html
<script src="js/timerModule.js"></script>
```

or use the minified version:

```html
<script src="js/timerModule.min.js"></script>
```

+ Add the module `timerModule` as a dependency to your app module:

```javascript
var myapp = angular.module('myapp', ['timerModule']);
```

+ Use the ngTimer directive to start or stop timer in your application:

```html
<div ng-controller="MyCtrl">
    <ng-timer start-auto='{{timerStarted}}' interval-ms='10000' event-name='angular-timer-tick-handler'></ng-timer>
    <button ng-click='stopTimer()' ng-show="timerStarted === true">Stop Timer!</button>
    <button ng-click='startTimer()' ng-show="timerStarted === false">Start Timer!</button>
</div>
```

+ Add define your controller accordingly to respond to events broadcasting:

```javascript
$scope.timerStarted = false;

$scope.startTimer = function () {
    $scope.timerStarted = true;
};

$scope.stopTimer = function () {
    $scope.timerStarted = false;
};

$scope.$on('angular-timer-tick-handler', function () {
    $log.debug('tick from ctrl!');
});
```

## Developers

Clone the repo, `git clone git://github.com/xelita/angular-timer.git`.
The project is tested with `jasmine` running on `karma`.

>
``` bash
$ npm install
$ bower install
$ npm test
```

## Contributing

Please submit all pull requests the against master branch. If your unit test contains JavaScript patches or features, you should include relevant unit tests. Thanks!

## Copyright and license

    The MIT License (MIT)

    Copyright (c) 2014 The Enlightened Developer

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
