(function () {
    'use strict'; 

    angular.module('app.dashboard').
    controller('menuLoginController', ['$scope','$location','$http', '$window','loginFactory','databaseFactory','$mdDialog',
    			function($scope,$location,$http,$window,loginFactory,databaseFactory,$mdDialog){

    	//var $scope = this;

    	$scope.newUser = {}
		$scope.newUser.emailCreate = ""
		$scope.newUser.passwordCreate = ""
		$scope.newUser.nameCreate = ""
		$scope.newUser.photoURLCreate = "http://image.flaticon.com/icons/svg/12/12096.svg"
		$scope.newUser.dateCreate = new Date().toLocaleDateString();
		$scope.errorMessage = ""
		$scope.checkFacebookStatus = true
		$scope.gradeInfo = ""

		$scope.animationsEnabled = true;
		$scope.detectState = "";

		$scope.showLoginbox = true;
		$scope.showSignupbox = false;
		$scope.showLoading = false; 


		$scope.detectState = function(){
			if(sessionStorage.getItem('userName')){
				$location.path('/'+sessionStorage.getItem('userGrade')+'Dashboard');
			}
			else{
				$location.path('/');	
			}
		};

		$scope.onClickLogin = function(data){
			if (data === "loading") {
				$scope.showLoginbox = false;
				$scope.showSignupbox = false;
				$scope.showLoading = true;
			} else if (data === "loginbox") {
				$scope.showLoginbox = true;
				$scope.showSignupbox = false;
				$scope.showLoading = false;
			} else {
				$scope.showLoginbox = false;
				$scope.showSignupbox = true;
				$scope.showLoading = false;
			}
		};

		$scope.close = function(){
			$rootScope.modalInstance.dismiss('cancel');
		}

		$scope.to2 = function(data){
			$rootScope.modalInstance.dismiss('cancel');
			$location.path('/');
		}

		$scope.newUserphotoURLCreate = function (elm) {
	           var element = elm;
	            angular.element(element).click()
        }

	    $scope.userSignInWithEmailAndPassword = function(user) {

	    	loginFactory.get(user).then(function(response){
	    		console.log(response)
	    		if(response.data != "null"){
	    			databaseFactory.logEvent(response.data.nombre,'login').then(function(response){
		    			console.log(response)
		    		});
		    		sessionStorage.setItem('userName',response.data.nombre);
		    		sessionStorage.setItem('userLastName',response.data.apellido);
		    		sessionStorage.setItem('userGrade',response.data.grade);
		    		$location.path('/adminDashboard');
	    		}else{
	    			$mdDialog.show(
				      $mdDialog.alert()
				        .parent(angular.element(document.querySelector('#popupContainer')))
				        .clickOutsideToClose(true)
				        .title('Ingreso NO valido')
				        .textContent('Correo / Contraseña no resgistrados como usuario')
				        .ariaLabel('Ingreso No valido')
				        .ok('Cerrar')
				        .targetEvent(user)
				    );
	    		}
	    		
	    	})
			
	    };

    }])

})();

