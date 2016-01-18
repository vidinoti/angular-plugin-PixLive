/*
 * angular-pixlive v1
 * (c) 2015-2016 Vidinoti https://vidinoti.com
 * License: MIT
 * 
 * SDK Controller
 *
 */

'use strict';

pixliveModule

    /**
     * @memberof pixlive
     * @ngdoc service
     * @name PxlController
     * @param {service} $ionicPlatform The Ionic Platform helper
     * @param {service} $q Angular promise service
     * @description 
     *   Exposes PixLive SDK methods using an angular-like service
     */
    .factory('PxlController', [
        '$ionicPlatform',
        '$q',
        function PxlController($ionicPlatform, $q) {

            /*private*/

            /*public*/
            return {

                /**
                 * Display the PixLive SDK notification list over the Ionic app. 
                 * If no notification is available, the call fails and return false.
                 * 
                 * @memberof PxlController
                 * 
                 * @returns {boolean} True if the method was able to show the list (i.e. if the list is not empty), false otherwise.
                 */
                presentNotificationsList: function() {
                    var deferred = $q.defer();

                    $ionicPlatform.ready(function () {
                        if(window.cordova && window.cordova.plugins && window.cordova.plugins.PixLive) {
                            window.cordova.plugins.PixLive.presentNotificationsList(function() {
                                deferred.resolve();
                            }, function() {
                                deferred.reject();
                            });
                        } else {
                            deferred.resolve([]);
                        }
                    });

                    return deferred.promise;
                },


                                   
                /**
                 * Class returned by the getContexts method of the PxlController 
                 * service that describe a single context available within the app.
                 * 
                 * @class
                 * @groupName class
                 * @name Context
                 * @memberOf pixlive
                 * @property {string}  contextId            - The ID of the context
                 * @property {string}  name                 - The name of the context as entered in PixLive Maker
                 * @property {string}  lastUpdate           - Date of last update of the context in the format YYYY-MM-DD HH:MM:SS ±HHMM
                 * @property {string}  description          - The description of the context as entered in PixLive Maker
                 * @property {string}  notificationTitle    - The title of the last notification generated by the context, or `null` if no such notification is available.
                 * @property {string}  notificationMessage  - The message of the last notification generated by the context, or `null` if no such notification is available.
                 * @property {string}  imageThumbnailURL    - The absolute URL toward the thumbnail of the image representing this context, null if not available.
                 * @property {string}  imageHiResURL        - The absolute URL toward the full resolution image representing this context, null if not available.
                 */

                /**
                 * Asynchronously return the list of contexts that is available within the app (i.e. the ones that have been synchronized.)
                 * 
                 * See {@link Context} for the description of the Context class.
                 * 
                 * @memberof PxlController
                 *
                 * @returns {Promise} An Angular Promise where the success 
                 *      method will be called with an `Array<Context>` 
                 *      argument corresponding to all the context/content contained in the app. 
                 */
                getContexts: function() {
                    var deferred = $q.defer();

                    $ionicPlatform.ready(function () {
                        if(window.cordova && window.cordova.plugins && window.cordova.plugins.PixLive) {
                            window.cordova.plugins.PixLive.getContexts(function(list) {
                                deferred.resolve(list);
                            }, function() {
                                deferred.reject();
                            });
                        } else {
                            deferred.resolve([]);
                        }
                    });

                    return deferred.promise;
                }
            };
        }
    ]);