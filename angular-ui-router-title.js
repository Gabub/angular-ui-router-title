/**
 * AngularJS module for updating browser title/history based on the current ui-router state.
 *
 * @link https://github.com/nonplus/angular-ui-router-title
 *
 * @license angular-ui-router-title v0.0.4
 * (c) Copyright Stepan Riha <github@nonplus.net>
 * License MIT
 */

(function(angular) {

"use strict";
angular.module("ui.router.title", ["ui.router"])
	.run(["$rootScope", "$timeout", "$state", function($rootScope, $timeout, $state) {

		$rootScope.$on("$stateChangeSuccess", function() {
			var title = getTitleValue($state.$current.locals.globals.$title);
			$timeout(function() {
				$rootScope.$title = title;
			});
			
			if(!$rootScope.$breadcrumbs) {
				$rootScope.$breadcrumbs = [];
				var state = $state.$current;
				while(state) {
					if(state.resolve && state.resolve.$title) {
						$rootScope.$breadcrumbs.unshift({
							title: getTitleValue(state.locals.globals.$title),
							state: state.self.name,
							stateParams: state.locals.globals.$stateParams
						});
					}
					state = state.parent;
				}
			}
			else {
				var state = $state.$current;
				if(state.resolve && state.resolve.$rootState){ $rootScope.$breadcrumbs = []; }
				for(var i = 0; i < $rootScope.$breadcrumbs.length; i++) {
					window.console.log($state.href($rootScope.$breadcrumbs[i].state, $rootScope.$breadcrumbs[i].stateParams) + ' | '+$state.href(state.self.name, state.locals.globals.$stateParams))
					if($state.href($rootScope.$breadcrumbs[i].state, $rootScope.$breadcrumbs[i].stateParams) == $state.href(state.self.name, state.locals.globals.$stateParams)){
						$rootScope.$breadcrumbs.splice(i, $rootScope.$breadcrumbs.length);
						break;
					}			
				}
				if(state.resolve && state.resolve.$title) {
					$rootScope.$breadcrumbs.push({
						title: getTitleValue(state.locals.globals.$title),
						state: state.self.name,
						stateParams: state.locals.globals.$stateParams
					});
				}
			
			}
		
		});

		function getTitleValue(title) {
			return angular.isFunction(title) ? title() : title;
		}

	}]);


})(window.angular);
