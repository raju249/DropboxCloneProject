/* global angular */
/* global $*/
angular.module("saveItApp")
        .controller("FolderNameController",['$scope',function($scope){
            $scope.folder_creation_error = false;
             $scope.folder_names = [
                {
                   name:"Folder 1",
                   size: 10,
                   shared:"--"
                },
                {
                    name:"Folder 2",
                    size:2,
                    shared:"--"
                },
                {
                    name:"Folder 3",
                    size:6,
                    shared:"--"
                }
            ];
            
            $scope.add_folder = function(){
                var name = $("#folder_name").val();
                var new_folder = {
                                    name:name,
                                    size:12,
                                    shared:"--"
                                };
                $("#folderNameModal").modal("hide");
                $scope.folder_names.push(new_folder);
            };
        }])
        .directive("folderDirective",function(){
           return {
               templateUrl : "../static/views/newFolder.html"
           };
        });