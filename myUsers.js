var app = angular.module('myApp', ['ngRoute', 'infinite-scroll']);
		
app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'listUser.html',
				controller: 'mainCtrl'
			}).
			when('/listManager/:managerId', {
				templateUrl: 'listUser.html',
				controller: 'listManagerCtrl'
			}).
			when('/listDirectReports/:_id', {
				templateUrl: 'listUser.html',
				controller: 'listDirectReportsCtrl'
			}).
			when('/edit/:_id', {
				templateUrl: 'editUser.html',
				controller: 'editUserCtrl'
			}).
			when('/create', {
				templateUrl: 'createNewUser.html',
				controller: 'createUserCtrl'
			}).
			when('/delete/:_id', {
				templateUrl: 'listUser.html',
				controller: 'deleteUserCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
}]);

app.controller('mainCtrl', ['$scope','userFactory',
	function($scope, userFactory) {				
		$scope.orderByMe = function(x) {
			$scope.myOrderBy = x;
		};
		$scope.edit = true;
		$scope.error = false;
		//$scope.incomplete = true;
		//$scope.abc = true;
		userFactory.getArray($scope);
	}
]);

app.controller('listManagerCtrl', ['$scope', '$routeParams', 'userFactory', 
	function($scope, $routeParams, userFactory) {
		console.log($routeParams.managerId);
		userFactory.getManager($scope, $routeParams.managerId);
	}
]);
		
app.controller('listDirectReportsCtrl', ['$scope', '$routeParams', 'userFactory', 
	function($scope, $routeParams, userFactory) {
		console.log($routeParams._id);
		userFactory.getDirectReportsUserArray($scope, $routeParams._id);
	}
]);

app.controller('editUserCtrl', ['$scope','$routeParams','$location','userFactory', '$http', 
	function($scope, $routeParams, $location, userFactory, $http) {
		$scope.edit = true;
		$scope.error = false;
		$scope.incomplete = false;
		
		var userid = parseInt($routeParams._id);
		userFactory.editUser($scope, userid);
		
		/*$scope.$watch('passw1', function() {$scope.test();});
		$scope.$watch('passw2', function() {$scope.test();});
		$scope.$watch('name', function() {$scope.test();});
		$scope.$watch('title', function() {$scope.test();});
		$scope.$watch('sex', function() {$scope.test();});
		$scope.$watch('startDate', function() {$scope.test();});
		$scope.$watch('officePhone', function() {$scope.test();});
		$scope.$watch('cellPhone', function() {$scope.test();});
		$scope.$watch('SMS', function() {$scope.test();});
		$scope.$watch('email', function() {$scope.test();});
		$scope.test = function() {
			if ($scope.passw1 !== $scope.passw2) {
				$scope.error = true;
			} else {
				$scope.error = false;
			}
			$scope.incomplete = false;
			if ($scope.edit && (!$scope.name.length || !$scope.passw1.length || !$scope.passw2.length
								|| !$scope.title.length || !$scope.sex.length || !$scope.startDate.length || !$scope.officePhone.length
								|| !$scope.cellPhone.length || !$scope.SMS.length || !$scope.email.length)) {
				$scope.incomplete = true;
			}
		};*/
		

		$scope.setimage = function() {
			var file = $scope.myFile;
			var reader = new FileReader();
			reader.readAsDataURL(file);		
			$scope.image = file.name;
			$location.path('/edit/'+userid);
			console.log($scope.image);

			/*console.log($scope.image);
			console.log(file.name);
			console.log(file);
			$scope.image = file.name;
			console.log($scope.image);*/			
		}
		/*$scope.getFile = function () {
		var fileReader = new FileReader();
        fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {
                          $scope.image = result;
                      });
    };*/
		
		$scope.uploadFile = function(){
			var file = $scope.myFile;
			var uploadUrl = "/multer" + userid;
			var fd = new FormData();
			fd.append('file', file);

			$http.put(uploadUrl,fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			})
			.success(function(){
			  console.log("success!!");
			})
			.error(function(){
			  console.log("error!!");
			});
		};
		
		$scope.saveUser = function(_id) {
			userFactory.updateUser($scope, $location);
		}
}]);

app.controller('createUserCtrl', ['$scope','userFactory', '$location',
	function($scope, $location, userFactory) {		
		/*$scope.$watch('passw1', function() {$scope.test();});
		$scope.$watch('passw2', function() {$scope.test();});
		$scope.$watch('name', function() {$scope.test();});
		$scope.$watch('title', function() {$scope.test();});
		$scope.$watch('sex', function() {$scope.test();});
		$scope.$watch('startDate', function() {$scope.test();});
		$scope.$watch('officePhone', function() {$scope.test();});
		$scope.$watch('cellPhone', function() {$scope.test();});
		$scope.$watch('SMS', function() {$scope.test();});
		$scope.$watch('email', function() {$scope.test();});
		$scope.test = function() {
			if ($scope.passw1 !== $scope.passw2) {
				$scope.error = true;
			} else {
				$scope.error = false;
			}
			$scope.incomplete = false;
			if ($scope.edit && (!$scope.name.length || !$scope.passw1.length || !$scope.passw2.length
								|| !$scope.title.length || !$scope.sex.length || !$scope.startDate.length || !$scope.officePhone.length
								|| !$scope.cellPhone.length || !$scope.SMS.length || !$scope.email.length)) {
				$scope.incomplete = true;
			}
		};*/
		
		$scope.saveUser = function() {
			userFactory.saveNewUser($scope);
		}
}]);

app.controller('deleteUserCtrl', ['$scope', '$routeParams', 'userFactory', '$location',
	function($scope, $routeParams, $location, userFactory) {
		var userid = parseInt($routeParams._id);
		userFactory.deleteUser($scope, userid, $location);
}]);

app.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
				$scope.$apply(function(){
					modelSetter($scope, element[0].files[0]);
				});
				$scope.setimage();
			});
		}
	};
}]);