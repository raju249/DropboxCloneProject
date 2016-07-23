/* global angular */
/* global $*/
angular.module("saveItApp")
        .controller("SignUpController",['$scope','$http',function($scope,$http){
            $scope.error = false;
            $scope.success = false;
            $scope.accept_terms = false;
            $scope.show_accept_terms = false;
            $scope.signup = function(){
                if ($scope.accept_terms){
                    $("#signup").addClass("disabled");
                    $("#signup").text("Signing up...");
                    $http.post("/signup", JSON.stringify($scope.signUpData))
                     .then(
                            function(response){
                                var resp = response;
                                if (resp["data"]["status"] == "200OK" && resp["data"]["message"] == "success"){
                                    $scope.success = true;
                                    $scope.error = false;
                                    toggle_data(false,"Redirecting to dashboard...");
                                }
                                else
                                {
                                    $scope.error = true;
                                    $scope.success = false;
                                    toggle_data(true,"Sign up for free");
                                }
                            },
                            function(response){
                                console.log(response)
                            }
                         )
                }
                else{
                    $scope.show_accept_terms = true;
                }
            };
        }]);
    
    var toggle_data = function(bool,data){
        if (bool){
            $("#signup").removeClass("disabled");
        }
        $("#signup").text(data);
    };