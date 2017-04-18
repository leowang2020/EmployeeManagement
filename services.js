app.factory('userFactory', ['$http', function($http) {		
	return {
		getArray : function($scope) {
			$http.get("http://localhost:8080/api/users")
			.success(function(data){
				console.log("in the getArray service" + data);
				$scope.users = data;
				$scope.scrollUsers = $scope.users.slice(0, 10);
				$scope.getMoreData = function () {
					if ($scope.scrollUsers.length < $scope.users.length) {
						$scope.scrollUsers = $scope.users.slice(0, $scope.scrollUsers.length + 2);
					}
				}
			}).error(function(data) {
				console.error("error in geting");
			})
		},
		
		getManager : function($scope, managerId) {
			console.log(managerId);
			$http.get("http://localhost:8080/api/users/manager/" + managerId)
			.success(function(data){
				console.log("in the getManager service" + data);
				console.log(data.name);				
				$scope.scrollUsers = [];
				$scope.scrollUsers.push(data);
			}).error(function(data) {
				console.error("error in posting");
			})
		},
		
		getDirectReportsUserArray : function($scope, userId) {
			console.log(userId);
			$http.get("http://localhost:8080/api/users/directReports/" + userId)
			.success(function(data){
				console.log("in the getDirectReports service" + data);
				$scope.users = data;
				$scope.scrollUsers = $scope.users.slice(0, 10);
				$scope.getMoreData = function () {
					if ($scope.scrollUsers.length < $scope.users.length) {
						$scope.scrollUsers = $scope.users.slice(0, $scope.scrollUsers.length + 2);
					}
				}
			}).error(function(data) {
				console.error("error in posting");
			})
		},
		
		editUser: function($scope, userid) {			
			$http.get("http://localhost:8080/api/users/" + userid)
			.success(function(data){
				console.log(data);
				$scope._id = data._id;
				if(typeof $scope.image == "undefined") {
					$scope.image = data.image;
				}
				$scope.name = data.name;
				$scope.title = data.title;
				$scope.sex = data.sex;
				$scope.startDate = data.startDate;
				$scope.officePhone = data.officePhone;
				$scope.cellPhone = data.cellPhone;
				$scope.SMS = data.SMS;
				$scope.email = data.email;
				$scope.manager = data.manager.name + '/' + data.manager._id;
			}).error(function(data) {
				console.error("error in getting");
			})
		},
		
		saveNewUser: function($scope, $location) {
			var userObj = {};
			userObj._id = $scope._id;
			//userObj.image = $scope.image;
			userObj.name = $scope.name;
			userObj.title = $scope.title;
			userObj.sex = $scope.sex;
			userObj.startDate = $scope.startDate;
			userObj.officePhone = $scope.officePhone;
			userObj.cellPhone = $scope.cellPhone;
			userObj.SMS = $scope.SMS;
			userObj.email = $scope.email;
			console.log($scope.manager);
			if (typeof $scope.manager != "undefined") {
				var managerObj = $scope.manager.split("/");
				var managerId = parseInt(managerObj[1]);
				var managerName = managerObj[0];
				userObj.manager = {_id:managerId, name:managerName};
			} else {
				userObj.manager = {};
			}

			$http.post("http://localhost:8080/api/users", userObj)
			.success(function(data){
				console.log(data);
				//$scope.users = data;
				$location.path('/');
			}).error(function(data) {
				console.error("error in posting");
			})
		},

		updateUser: function($scope, $location) {
			var userObj   = {};
			userObj._id = $scope._id;
			userObj.image = $scope.image;
			userObj.name = $scope.name;
			userObj.title = $scope.title;
			userObj.sex = $scope.sex;
			userObj.startDate = $scope.startDate;
			userObj.officePhone = $scope.officePhone;
			userObj.cellPhone = $scope.cellPhone;
			userObj.SMS = $scope.SMS;
			userObj.email = $scope.email;
			if (typeof $scope.manager != "undefined") {
				var managerObj = $scope.manager.split("/");
				var managerId = parseInt(managerObj[1]);
				var managerName = managerObj[0];
				userObj.manager = {_id:managerId, name:managerName};
			} else {
				userObj.manager = {};
			}
			//console.log(userObj);
			$http.put("http://localhost:8080/api/users/" + userObj._id, userObj)
			.success(function(data){
				console.log(data);
				//$scope.users = data;
				$location.path('/');
			}).error(function(data) {
				console.error("error in puting");
			})
		},
		
		deleteUser: function($scope, userid, $location) {			
			$http.delete("http://localhost:8080/api/users/" + userid)
			.success(function(data){
				console.log(data);
				//$scope.users = data;
				$location.path('/');
			}).error(function(data) {
				console.error("error in deleting");
			})
		}
	}
}]);