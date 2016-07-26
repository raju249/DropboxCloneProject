/* global angular */
/* global $ */
angular.module("saveItApp")
        .service("toggleData",[function(){
            this.toggle_data = function(id,bool,data){
                $("#" + id).addClass("disabled");
                if (bool){
                    $("#" + id).removeClass("disabled");
                }
                $("#" + id).text(data);
            };
        }]);