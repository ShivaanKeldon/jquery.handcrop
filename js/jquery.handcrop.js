/**
 * jQuery plugin : handcrop
 *      allow image cropping
 * 
 * @author Shivaan Keldon (Conflikt Arts)
 * @description allow image cropping, use bootstrap for modal
 * @version 1.0
 * 
 * require jQuery 1.11.0, jQuery.UI 1.10.4 and Bootstrap 3
 * 
 * The MIT License (MIT)

Copyright (c) 2014 Shivaan Keldon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 * 
 */
(function($){
    var ce = function(o,i,c){var e = document.createElement(o); if(i){e.id=i;} if(c){e.className=c;} return e;},
        ac = function(p,c){p.appendChild(c);},
        cropTop, cropLeft,
        modalBody;
    
    function cropCallback(options){
        options.end({left:cropLeft, top:cropTop});
    }

    function generateModal(options){
        var modal = ce("DIV","handcrop_modal","modal fade large"),
            dialog = ce("DIV","handcrop_modal_dialog","modal-dialog modal-lg"),
            content = ce("DIV",null,"modal-content"),
            modalBody = ce("DIV","handcrop_modal_body","modal-body"),
            modalFooter = ce("DIV",null,"modal-footer"),
            btSubmit = ce("BUTTON", "handcrop_modal_submit", "btn btn-primary");
        
        btSubmit.setAttribute("data-dismiss","modal");
        modal.setAttribute("data-backdrop","static");
        btSubmit.innerHTML = "Crop";

        ac(document.body,modal);
        ac(modal,dialog);
        ac(dialog,content);
        ac(content,modalBody);
        ac(content,modalFooter);
        ac(modalFooter,btSubmit);
        
        if(true===options.debug){
            var debug = ce("DIV","modal_debug");
            ac(modalFooter,debug);
        }
        
        $("#handcrop_modal_submit").bind("mouseup",function(){
            cropCallback(options);
        });
        
        return modalBody;
    }
    
    function generateCrop(url,options){
        $(modalBody).empty();
        var crop = ce("DIV","handcrop_crop"),
            container = ce("DIV","handcrop_container"),
            img = new Image(),
            loop;
        ac(modalBody,crop);
        ac(crop,container);
        ac(container,img);
        
        $(crop).css({
            "width": (options.width+2)+"px",
            "height": (options.height+2)+"px"
        });
        $(img).attr("src",url);
        if(Math.abs($(img).width()-$(crop).width()) > Math.abs($(img).height()-$(crop).height())){
            $(img).css("width",options.width+"px");
        }
        else{
            $(img).css("height",options.height+"px");
        }
        
        loop = function(callback){
            if(0===$(img).height() || 0===$(img).width()) return setTimeout(function(){loop(callback);},20);
            callback();
        };
        loop(function(){
            var iHeight = $(img).height(),
                iWidth = $(img).width(),
                diffH = Math.abs(iHeight - $(crop).height()),
                diffW = Math.abs(iWidth - $(crop).width());
            $(container).css({
                width: (iWidth+diffW)+"px",
                height: (iHeight+diffH)+"px",
                top: -(diffH)+"px",
                left: -(diffW)+"px"
            });
            $(img).css({
                top: (diffH/2)+"px",
                left: (diffW/2)+"px"
            });
            cropTop = diffH-parseInt($(img).css("top").substr(0,($(img).css("top")).length-2),10);
            cropLeft = diffW-parseInt($(img).css("left").substr(0,($(img).css("left")).length-2),10);
            
            options.dragOptions.containment = "parent";
            options.dragOptions.drag = function(event,ui){
                var img = $("#handcrop_crop img");
                cropTop = diffH-parseInt(img.css("top").substr(0,(img.css("top")).length-2),10);
                cropLeft = diffW-parseInt(img.css("left").substr(0,(img.css("left")).length-2),10);
                if(true===options.debug){
                    $("#modal_debug").html("x: "+cropLeft+", y: "+cropTop);
                }
            };

            $("#handcrop_crop img").disableSelection().draggable(options.dragOptions);
            $("#handcrop_modal_dialog").css("width",($(crop).width()+50)+"px");
        });
    }
    
    $.fn.handcrop = function(params){
        this.each(function(){
            var options = {
                width: 320,
                height: 200,
                debug: false,
                dragOptions: {},
                end:function(){}
            };
            $.extend(options,params);
            
            $(this).bind("mouseup",function(){
                if(0===$("#handcrop_modal").length) modalBody = generateModal(options);
                generateCrop($(this).attr("src"),options);

                $("#handcrop_modal").modal();
            });

        });

        return this;
    };
})(jQuery);