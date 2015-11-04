angular.module('baasic.blog')
	.controller('PasswordRecoveryCtrl', ['$scope', '$state', 'baasicPasswordRecoveryService', 'baasicRecaptchaService',
		function($scope, $state, baasicPasswordRecoveryService, baasicRecaptchaService) {
			'use strict';
			
			var vm = {};
			$scope.vm = vm;
			
			vm.message = '';
			
			vm.recoveryData = {};
			vm.recoveryData.challengeIdentifier = '';
			vm.recoveryData.challengeResponse = '';
			vm.recoveryData.recoverUrl = $state.href('password-change', {}, { absolute: true }) + '?passwordRecoveryToken={passwordRecoveryToken}';
			
			vm.recoverPassword = function() {
				vm.recoveryData.challengeIdentifier = baasicRecaptchaService.challenge();
				vm.recoveryData.challengeResponse = baasicRecaptchaService.response();
				
				if(vm.recoveryData.challengeResponse === '') {
					vm.message = 'Captcha code is required';
					return;
				}
				
				baasicPasswordRecoveryService.requestReset(vm.recoveryData)
					.success(function() {
						vm.message = 'An email with a password change link has been sucessfully sent.';
					})
					.error(function(data, status){
						vm.message = status + ': ' + data.message;
					})
					.finally(function () {
						$scope.$root.loader.resume();
					});					
			};
	}]);