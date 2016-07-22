/* global angular */
/* global $*/
angular.module("saveItApp")
        .controller("SignUpController",['$scope','$http',function($scope,$http){
            $scope.error = false;
            $scope.success = false;
            $scope.accept_terms = true;
            $scope.signup = function(){
              
                if ($scope.accept_terms){
                    $http.post("/signup", JSON.stringify($scope.signUpData))
                     .then(
                            function(response){
                                var resp = response;
                                if (resp["data"]["status"] == "200OK" && resp["data"]["message"] == "success"){
                                    $scope.success = true;
                                    $scope.error = false;
                                }
                                else{
                                    $scope.error = true;
                                    $scope.success = false;
                                }
                            },
                            function(response){
                                console.log(response)
                            }
                         )
                }
                else{
                    alert("Please accept terms");
                }
            };
        }]);