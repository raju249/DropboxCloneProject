/* global angular */
/* global $*/
angular.module("saveItApp")
        .controller("FolderNameController",['$scope','$http','toggleData',function($scope,$http,toggleData){
            $scope.folder_creation_error = false;
            $scope.delete = false;
            var firstPress = false;
            $scope.areFolders = false;
            $scope.folder_names = [];
            
            function getFolders(){
                $http.get("/userFolder")
                .then(function(response){
                    if ((response.data).length != 0){
                        $scope.folder_names = response.data;
                        $scope.areFolders = true;
                        console.log(response)
                    }
                },function(response){
                    console.log(response)
                });
            }
            
            //call it once to display folder
            getFolders();
            
            $scope.add_folder = function(){
                var name = $("#folder_name").val();
                toggleData.toggle_data("status",false,"Creating...")
                var new_folder = {
                                    name:name,
                                };
                $http.post("/folder",JSON.stringify(new_folder))
                        .then(function(response){
                             if (response["data"]["status"] == "200OK"){
                                 toggleData.toggle_data("status",true,"Create folder");
                                 $("#folderNameModal").modal("hide");
                                 getFolders();
                             }
                             else{
                                 $scope.folder_creation_error = true;
                                 toggleData.toggle_data("status",true,"Create folder");
                             }
                        },
                        function(response){
                            console.log(response);
                            $scope.folder_creation_error = true;
                            toggleData.toggle_data("status",true,"Create folder");
                        });
            };
            
            $scope.delete_folder = function(){
                $scope.delete = true;
                if (firstPress){
                    var count = 0;
                    $('input[name="folder"]:checked').each(function(){
                        count++;
                    });
                    console.log(count);
                    $('input[name="folder"]:checked').each(function() {
                        var length = $scope.folder_names.length;
                        for(var i = 0; i < length; i++){
                            if (($scope.folder_names[i]).id == Number(this.value)){
                                $scope.folder_names.splice(i,count);
                            }
                        }
                    });
                    $scope.delete = false;
                    firstPress = false;
                }
                else{
                    firstPress = true;
                }
            }
        }])
        .directive("folderDirective",function(){
           return {
               templateUrl : "../static/views/newFolder.html"
           };
        })
        .directive("fileDirective", function(){
           return {
               templateUrl : " ../static/views/fileUpload.html"
           };
        });