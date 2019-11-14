'use strict';

function download(data, filename, type) 
{
    var file = new Blob([data], {type: type});

    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    
    else 
    {
        var a = document.createElement("a");
        var url = URL.createObjectURL(file);

        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function open_file (callback)
{
    var read_file = function(e) 
    {
		var file = e.target.files[0];
        
        if (!file)
			return;
		
		var reader = new FileReader();
        
        reader.onload = function(e) 
        {
			var contents = e.target.result;
			file_input.func(contents)
			document.body.removeChild(file_input)
		}
		reader.readAsText(file)
    }
    
	var file_input = document.createElement("input");
	file_input.type = 'file';
	file_input.style.display = 'none';
	file_input.onchange = read_file;
	file_input.func = callback;
    document.body.appendChild(file_input)
    
	click_elem(file_input)
}

function click_elem (elem) 
{
	var event_mouse = document.createEvent("MouseEvents")
	event_mouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
	elem.dispatchEvent(event_mouse)
}

function compute_offset_left (element)
{
    var offset = 0;

    element = element.parentNode;

    while (element.parentNode !== document.body)
    {
        offset += element.offsetLeft;
        element = element.parentNode;
    }

    return offset;
}

function compute_offset_top (element)
{
    var offset = -56;

    element = element.parentNode;

    while (element.parentNode !== document.body)
    {
        offset += element.offsetTop;
        element = element.parentNode;
    }

    return offset;
}

function to_png (element)
{
   html2canvas(element).then(function (canvas) {
       var image = new Image();
        image.src = canvas.toDataURL();
        
        var tab = window.open("");
        tab.document.write(image.outerHTML);
    });
}