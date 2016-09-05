/*global $*/
$(document).ready(function(){
    $("#progress-bar").hide();
    $("#loginBtn").click(function(){
        $("#loginModal").modal("show");
    });
    
    $("#new_folder").click(function(){
        $("#folderNameModal").modal("show");
    });
    
    $("#new_file").click(function(){
        $("#fileUploadModel").modal("show");    
    });
    
    $("#first").click(function(){
        show(this.id);
    });
    
    $("#second").click(function(){
        show(this.id);
    });
    
    $("#third").click(function(){
        show(this.id);
    });
    
    $("#fourth").click(function(){
        show(this.id);
    });
    var show = function(id){
        var target = $("#" + id + "-content");
        target.toggle("slide");
        target.scroll();
        
    };
});