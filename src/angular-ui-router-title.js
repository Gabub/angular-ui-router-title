"use strict";
angular.module("ui.router.title", ["ui.router"])
	.run(["$rootScope", "$timeout", "$state", function($rootScope, $timeout, $state) {

		$rootScope.$on("$stateChangeSuccess", function() {
			var title = getTitleValue($state.$current.locals.globals.$title);
			$timeout(function() {
				$rootScope.$title = title;
			});

			$rootScope.$breadcrumbs = [];
			var state = $state.$current;
			while(state) {
				if(state.resolve && state.resolve.$title) {
					$rootScope.$breadcrumbs.unshift({
						title: getTitleValue(state.locals.globals.$title),
						state: state.self.name,
						stateParams: state.locals.globals.$stateParams
					})
				}
				if(state.data && state.data.$parent) {
					state = $state.get(state.data.$parent);
				}
				else {
					state = state.parent;
				}
			}
		});

		function getTitleValue(title) {
			return angular.isFunction(title) ? title() : title;
		}

	}]);
