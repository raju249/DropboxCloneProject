/* global angular */
/* global signupForm */
angular.module("saveItApp")
        .controller("SignUpController",['$scope','$http','$window','toggleData',function($scope,$http,$window,toggleData){
            $scope.error = false;
            $scope.success = false;
            $scope.accept_terms = false;
            $scope.show_accept_terms = false;
            $scope.signup = function(){
                if ($scope.accept_terms){
                    toggleData.toggle_data("signup",false,"Signing up...");
                    $http.post("/signup", JSON.stringify($scope.signUpData))
                     .then(
                            function(response){
                                var resp = response;
                                if (resp["data"]["status"] == "200OK" && resp["data"]["message"] == "success"){
                                    $scope.success = true;
                                    $scope.error = false;
                                    toggleData.toggle_data("signup",false,"Redirecting to dashboard...");
                                    $window.open("/dashboard",'_self');
                                }
                                else
                                {
                                    $scope.error = true;
                                    $scope.success = false;
                                    toggleData.toggle_data("signup",true,"Sign up for free");
                                }
                            },
                            function(response){
                                console.log(response);
                            }
                         );
                }
                else{
                    $scope.show_accept_terms = true;
                }
            };
        }]);