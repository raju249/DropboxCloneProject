/* global angular */
angular.module("saveItApp",[])
        .controller("LoginController",['$scope','$http','toggleData','$window',function($scope,$http,toggleData,$window){
            $scope.login_error = false;
            $scope.login = function(){
                toggleData.toggle_data("login",false,"Logging in....");
                $http.post("/login",JSON.stringify($scope.loginData))
                     .then(function(response){
                            if (response["data"]["status"] == "200OK"
                                && response["data"]["message"] == "success"){
                                    toggleData.toggle_data("login",false,"Redirecting to dashboard..");
                                    $window.open("/dashboard","_self");
                                }
                            else {
                                $scope.login_error = true;
                                toggleData.toggle_data("login",true,"Sign in");
                            }
                        }),
                        function(response){
                           toggleData.toggle_data("login",true,"Sign in");
                        };
            };
        }])
        .directive("loginDirective",function(){
            return {
                templateUrl : "../static/views/login.html"
            };
        });