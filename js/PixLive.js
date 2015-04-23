/*
 * angular-pixlive v0.0.1
 * (c) 2015 Vidinoti http://vidinoti.com
 * License: MIT
 */

'use strict';

pixliveModule
    .directive('pxlView', [
        '$timeout',
        '$ionicPosition',
        '$ionicPlatform',
        function($timeout, $ionicPosition, $ionicPlatform) {
            return {
                restrict: 'E',
                require: '^?ionNavView',
                priority: 800,
                compile: function(element, attr) {

                    element.addClass('scroll-content ionic-scroll scroll-content-false');

                    function prelink($scope, $element, $attr, navViewCtrl) {
                        var parentScope = $scope.$parent;
                        $scope.$watch(function() {
                            return (parentScope.$hasHeader ? ' has-header' : '') +
                                (parentScope.$hasSubheader ? ' has-subheader' : '') +
                                (parentScope.$hasFooter ? ' has-footer' : '') +
                                (parentScope.$hasSubfooter ? ' has-subfooter' : '') +
                                (parentScope.$hasTabs ? ' has-tabs' : '') +
                                (parentScope.$hasTabsTop ? ' has-tabs-top' : '');
                        }, function(className, oldClassName) {
                            $element.removeClass(oldClassName);
                            $element.addClass(className);
                        });

                    }


                    function postlink($scope, $element, $attr, navViewCtrl) {
                        $scope.$on("$ionicView.beforeEnter", function(scopes, states) {
                            if ($scope.arView) {
                                $scope.arView.beforeEnter();
                            }
                        });

                        $scope.$on("$ionicView.afterEnter", function(scopes, states) {
                            if (!$scope.arView) {
                                $ionicPlatform.ready(function () {
                                    if(window.cordova && window.cordova.plugins && window.cordova.plugins.PixLive) {
                                        //We remove all element content
                                        element.children().remove();
                                                     
                                        //FIXME: The timeout is a Dirty hack as on iOS, the status bar CSS style is applied after 
                                        //       this directive is loaded, hence we fail to get the proper Y value for the view.
                                        $scope.pixliveTimeout = $timeout(function() {
                                            var offset = $ionicPosition.offset($element);

                                            var y = offset.top;
                                            var x = offset.left;
                                            var width = offset.width;
                                            var height = offset.height;
                                            $scope.pixliveTimeout = null;
                                            $scope.arView = window.cordova.plugins.PixLive.createARView(x, y, width, height);
                                            
                                            $scope.onResize = function() {
                                                var offset = $ionicPosition.offset($element);

                                                var y = offset.top;
                                                var x = offset.left;
                                                var width = offset.width;
                                                var height = offset.height;

                                                $scope.arView.resize(x,y,width,height);
                                            }; 

                                            ionic.on('resize',$scope.onResize ,window);

                                        }, 300);
                                    }
                                });
                            } else {
                                $scope.onResize();
                                $scope.arView.afterEnter();
                            }

                        });

                        $scope.$on("$ionicView.beforeLeave", function(scopes, states) {
                            if ($scope.pixliveTimeout) {
                                $timeout.cancel($scope.pixliveTimeout);
                                $scope.pixliveTimeout = null;
                            }
                            if ($scope.arView) {
                                $scope.arView.beforeLeave();
                            }

                        });

                        $scope.$on("$ionicView.afterLeave", function(scopes, states) {
                            if ($scope.arView) {
                                $scope.arView.afterLeave();
                            }

                        });

                        $scope.$on('$destroy', function() {
                            if ($scope.pixliveTimeout) {
                                $timeout.cancel($scope.pixliveTimeout);
                                $scope.pixliveTimeout = null;
                            }
                            if ($scope.arView) {
                                ionic.off('resize',$scope.onResize ,window);
                                $scope.arView.destroy();
                            }
                        });
                    }

                    return {
                        pre: prelink,
                        post: postlink
                    };
                }
            };
        }
    ]);