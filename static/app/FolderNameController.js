/* global angular */
/* global $*/
angular.module("saveItApp")
        .controller("FolderNameController",['$scope','$http','toggleData',function($scope,$http,toggleData){
            $scope.folder_creation_error = false;
            $scope.delete = false;
            var firstPress = false;
            $scope.areFolders = true;
            $scope.loading = true;
            $scope.folder_names = [];
            
            $scope.show_index = function(){
                console.log(this);
                $scope.folder = this.folder.name;
                console.log($scope.folder);
                $scope.files = $scope.folder_names[this.$index].files;
            }
            
            function getFolders(){
                $http.get("/userFolder")
                .then(function(response){
                    if ((response.data).length != 0){
                        $scope.folder_names = response.data;
                        $scope.areFolders = true;
                        $scope.loading = false;
                    }
                    else{
                        $scope.loading = false;
                        $scope.areFolders = false;
                    }
                },function(response){
                    console.log(response)
                });
            }
            
            //call it once to display folder
            getFolders();
            
            $scope.add_folder = function(){
                var name = $("#folder_name").val();
                toggleData.toggle_data("status",false,"Creating...");
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
            
            $scope.upload_file = function(){
                $("#progress_bar").show();
                toggleData.toggle_data("upload_button",false,"Uploading...");
                var formData = new FormData();
                var fileInput = $("#file");
                var file = fileInput[0].files[0];
                formData.append('file',file);
                var folder = $("#folderName").val();
                formData.append('folder',folder);
                $.ajax({
                    
                    xhr: function(){
                        
                        var xhr = new window.XMLHttpRequest();
                        
                        xhr.upload.addEventListener('progress',function(e){
                            
                            if (e.lengthComputable){
                                var percent = Math.round((e.loaded /e.total) * 100);
                                $("#progress_bar").attr('aria-valuenow', percent).css('width', percent + "%").text(percent + "%");
                            }
                        });
                        return xhr;
                    },
                    type:"POST",
                    url: "/uploadFile",
                    data: formData,
                    processData:false,
                    contentType:false,
                    success:function(){
                        toggleData.toggle_data("upload_button",true,"Upload File");
                        $("#progress_bar").hide();
                        $("#fileUploadModel").modal("hide");
                        getFolders();
                    }
                });
                
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