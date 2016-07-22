/* global angular */
angular.module("saveItApp",[])
        .controller("SignUpController",['$scope','$http',function($scope,$http){
            $scope.error = false;
            $scope.accept_terms = true;
            $scope.signup = function(){
              
                if ($scope.accept_terms){
                    console.log($scope.signUpData);
                    $http.post("/signup", JSON.stringify($scope.signUpData))
                     .then(
                            function(response){
                                var resp = response;
                                if (resp["data"]["status"] == "200OK" && resp["data"]["message"] == "success"){
                                    console.log("User signup success");
                                }
                                else{
                                    var message = response["data"]["message"];
                                    $scope.error = true;
                                    $("#errorMessage").html(message);
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