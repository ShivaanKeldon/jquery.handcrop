jquery.handcrop
===============

jQuery plugin for images cropping

Requires jQuery 1.11.0, jQuery UI 1.10.4 and Bootstrap 3

##Demo

    $(function(){
        $("#image1").handcrop({
            width: 300,
            height: 400,
            end:function(data){
                alert("left: "+data.left+", top: "+data.top);
            }
        });
    });
