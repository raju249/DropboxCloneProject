/* global angular */
angular.module("saveItApp",[])
        .controller("LoginController",['$scope','$http',function($scope,$http){
            $scope.login = function(){
                console.log($scope.loginData);
                $http.post("/login",JSON.stringify($scope.loginData))
                     .then(function(response){
                            console.log("I sent it..Check on server side console..");
                            console.log(response);
                        }),
                        function(response){
                            console.log("Some error occured :(");
                           console.log(response); 
                        };
            };
        }])
        .directive("loginDirective",function(){
            return {
                templateUrl : "../static/views/login.html"
            };
        });