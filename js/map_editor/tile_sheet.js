'use strict';

function tile_sheet(options)
{
    this.set_width(options.width);
    this.set_height(options.height);
    this.set_img(options.img);
    this.set_padding(options.padding);
    this.set_col(options.col);
    this.set_row(options.row);
    this.load();
}

tile_sheet.prototype.load = function ()
{
    var load_timer;
    var img_object = new Image();
    img_object.crossOrigin = "anonymous";
    img_object.src = this.get_img();
    img_object.onload = on_img_loaded.bind(this);

    function on_img_loaded() 
    {
      if (load_timer != null) 
        clearTimeout(load_timer);
      
      if (!img_object.complete) 
      {
        load_timer = setTimeout(function() 
        {
            on_img_loaded();
        }, 3);

      } 
      
      else 
      {
        this.on_preload_complete(img_object);
        
        gl_editor.render_map();
      }
    }
}

tile_sheet.prototype.on_preload_complete = function (img_object)
{
    var res = [];
    var width = this.get_width();
    var height = this.get_height();
    var padding = this.get_padding();
    var col = this.get_col();
    var row = this.get_row();

    for (var j = 0; j < row; j++)
    {
        for (var i = 0; i < col; i++)
        {
            var x = (width + padding) * i;
            var y = (height + padding) * j;
            var ratio = 1;
            var tile_src = this.crop(img_object, width, height, x, y, ratio);

            var id = j * col + i;

            res.push(tile_src);
        }
    }

    this.set_tiles_src(res);
}

tile_sheet.prototype.crop = function (img_obj, width, height, x, y, ratio)
{
    /* the parameters: - the image element - the new width - the new height - the x point we start taking pixels - the y point we start taking pixels - the ratio */
    //set up canvas for thumbnail
    var tmp_canvas = document.createElement('canvas');
    var tmp_context = tmp_canvas.getContext('2d');
    tmp_canvas.width = width; 
    tmp_canvas.height = height;

    /* use the sourceCanvas to duplicate the entire image. This step was crucial for iOS4 and under devices. Follow the link at the end of this post to see what happens when you don’t do this */
    var buffer_canvas = document.createElement('canvas');
    var buffer_context = buffer_canvas.getContext('2d');
    buffer_canvas.width = img_obj.width;
    buffer_canvas.height = img_obj.height;
    buffer_context.drawImage(img_obj, 0, 0);

    /* now we use the drawImage method to take the pixels from our bufferCanvas and draw them into our thumbnail canvas */
    tmp_context.drawImage(buffer_canvas, x, y, width * ratio, height * ratio, 0, 0, width, height);
    return tmp_canvas.toDataURL();
}

// ACCESSOR

tile_sheet.prototype.get_img = function ()
{
    return this.img;
}

tile_sheet.prototype.set_img = function (img)
{
    this.img = img;
}

tile_sheet.prototype.get_width = function ()
{
    return this.width;
}

tile_sheet.prototype.set_width = function (width)
{
    this.width = width;
}

tile_sheet.prototype.get_height = function ()
{
    return this.height;
}

tile_sheet.prototype.set_height = function (height)
{
    this.height = height;
}

tile_sheet.prototype.get_padding = function ()
{
    return this.padding;
}

tile_sheet.prototype.set_padding = function (padding)
{
    this.padding = padding;
}

tile_sheet.prototype.get_col = function ()
{
    return this.col;
}

tile_sheet.prototype.set_col = function (col)
{
    this.col = col;
}

tile_sheet.prototype.get_row = function ()
{
    return this.row;
}

tile_sheet.prototype.set_row = function (row)
{
    this.row = row;
}

tile_sheet.prototype.get_tiles_src = function()
{
    return this.tiles_src;
}

tile_sheet.prototype.set_tiles_src = function(src)
{
    this.tiles_src = src;
}

tile_sheet.prototype.get_tile_src = function (x, y)
{
    var tiles_src = this.get_tiles_src();
    
    if (!tiles_src)
        return { 
            id: 0,
            src: 'resources/default_tile.png'
        };

    var id = x;


    if (arguments.length === 2)
        id = y * this.get_col() + x;
    
    return {
        id: id, 
        src: tiles_src[id]
    };
}

