﻿angular.module('myApp')
    .directive('baasicLogout', ['$parse',
        function baasicLogout($parse) {
            'use strict';
            var fn;

            return {
                restrict: 'AE',
                scope: false,
                compile: function (elem, attrs) {
                    fn = $parse(attrs.onLogout);
                },
                controller: ['$scope', 'baasicLoginService', 'baasicAuthorizationService',
                    function baasicLogoutCtrl($scope, loginService, authService) {
                        function clearUser() {
                            authService.setUser(null);
                            authService.updateAccessToken(null);

                            if (fn) {
                                fn($scope);
                            }
                        }

                        $scope.logout = function logout() {
                            var token = authService.getAccessToken();
                            if (token) {
                                /* jshint camelcase: false */
                                loginService.logout(token.access_token, token.token_type)
                                    .finally(clearUser);
                            } else {
                                clearUser();
                            }
                        };
                    }
                ]
            };
        }
    ]);