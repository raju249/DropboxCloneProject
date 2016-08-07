/* global angular */
/* global $*/
angular.module("saveItApp")
        .controller("FolderNameController",['$scope',function($scope){
            $scope.folder_creation_error = false;
            $scope.delete = false;
            var firstPress = false;
             $scope.folder_names = [
                {
                   id:0,
                   name:"Folder 1",
                   size: 10,
                   shared:"--"
                },
                {
                    id:1,
                    name:"Folder 2",
                    size:2,
                    shared:"--"
                },
                {
                    id:2,
                    name:"Folder 3",
                    size:6,
                    shared:"--"
                }
            ];
            
            $scope.add_folder = function(){
                var name = $("#folder_name").val();
                var new_folder = {
                                    id:$scope.folder_names.length,
                                    name:name,
                                    size:0,
                                    shared:"--"
                                };
                $("#folderNameModal").modal("hide");
                $scope.folder_names.push(new_folder);
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