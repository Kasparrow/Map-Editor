'use strict';

function map (options)
{
    this.set_editor(options.editor);
    this.set_width(options.width);
    this.set_height(options.height);
    this.set_layers([]);
    //this.set_tiles([]);
}

map.prototype.init = function ()
{
    this.bind_event();
}

// DOM EVENTS

map.prototype.bind_event = function ()
{   
    GL_MAP_ELEMENT.onmousedown = this.on_mousedown.bind(this);
    GL_MAP_ELEMENT.onmousemove = this.on_mousemove.bind(this);
    GL_MAP_ELEMENT.onmouseup = this.on_mouseup.bind(this);
}

map.prototype.on_mousedown = function (e)
{
    if (!this.get_editor().is_edit_mode())
        return;

    this.is_mouse_down = true;

    var  { x, y } = this.get_event_coordinates(e);

    this.clear_selection();
    this.start_x = Math.floor(x / GL_TILE_SIZE);
    this.start_y = Math.floor(y / GL_TILE_SIZE);

    this.on_mousemove(e);
}

map.prototype.on_mouseup = function ()
{
    this.is_mouse_down = false;
}

map.prototype.on_mousemove = function (e)
{
    if (!this.get_editor().is_edit_mode())
        return;
        
    if (!this.is_mouse_down)
        return;

    this.clear_selection();
    var  { x, y } = this.get_event_coordinates(e);

    this.end_x = Math.floor(x / GL_TILE_SIZE);
    this.end_y = Math.floor(y / GL_TILE_SIZE);

    var selection = [];
    var min_x = Math.min(this.start_x, this.end_x);
    var max_x = Math.max(this.start_x, this.end_x);
    var min_y = Math.min(this.start_y, this.end_y);
    var max_y = Math.max(this.start_y, this.end_y);
    var tiles = this.get_active_layer().get_tiles();

    for (var j = min_x; j <= max_x; j++)
    {
        for (var i = min_y; i <= max_y; i++)
        {
            var tile_index = i * this.get_width() + j;
            tiles[tile_index].get_html_element().className = "selected";

            selection.push(tiles[tile_index]);
        }
    }

    this.set_selection(selection);
}

// RENDER 

map.prototype.render = function (parent)
{
    var layers = this.get_layers();

    for (var i = 0; i < layers.length; i++)
        layers[i].render();
}

map.prototype.clear = function ()
{
    GL_MAP_ELEMENT.innerHTML = "";
}

map.prototype.clear_selection = function ()
{
    var selection = this.get_selection();

    for (var i = 0; i < selection.length; i++)
    {
        selection[i].get_html_element().className = 'unselected';
    }

    this.set_selection([]);
}

// UTILS

map.prototype.get_event_coordinates = function (e)
{
    return {
        x: e.x - GL_MAP_ELEMENT.offsetLeft + GL_MAP_ELEMENT.parentNode.parentNode.scrollLeft,
        y: e.y - GL_MAP_ELEMENT.offsetTop - 56 + GL_MAP_ELEMENT.parentNode.parentNode.scrollTop
    }
}

map.prototype.serialize = function ()
{
    var layers = this.get_layers();
    var res = "SIZE " + this.get_width() + " " + this.get_height() + '\r\n';
    res += "DEFAULT_FRICTION 1.0 1.0\r\n";
    res += "SHEET Sheet1.tilesheet\r\n";
    res += "|ENTITY|Name|x|y|elevation|\r\n";
    res += "ENTITY Player 715 360 1\r\n";
    res += "|TILE|ID|x|y|layer|solid|\r\n";

    for (var i = 0; i < layers.length; i++)
        res += layers[i].serialize();

    return res;
}

map.prototype.load_from_array = function (tiles)
{
    var layers = [];

    for (var i = 0; i < tiles.length; i++)
    {
        var datas = tiles[i].split(' ');
        var type = datas[0];

        if (type !== 'TILE')
            continue;

        var tile_id = datas[1];
        var layer_index = datas[4];

        if (layer_index >= layers.length)
            layers.push(new layer({map: this, opacity: 1, visibility: true}));

        var l = layers[layer_index];
        l.add_tile(new tile({img_id: tile_id, layer: l }));
    }

    this.set_layers(layers);
}

map.prototype.on_rescale = function ()
{
    var layers = this.get_layers();
    var width = this.get_width();
    var height = this.get_height();

    if (!layers)
        return;

    for (var i = 0; i < layers.length; i++)
        layers[i].rescale(width, height);
}

// ACCESSORS

map.prototype.get_selection = function ()
{
    return this.selection || [];
}

map.prototype.set_selection = function (selection)
{
    this.selection = selection;
}

map.prototype.get_editor = function ()
{
    return this.editor;
}

map.prototype.set_editor = function (editor)
{
    this.editor = editor;
}


map.prototype.get_tiles = function ()
{
    return this.tiles;
}

map.prototype.set_tiles = function (tiles)
{
    this.tiles = tiles;
}

map.prototype.get_width = function ()
{
    return this.width;
}

map.prototype.set_width = function (width)
{
    this.width = width;
    this.on_rescale();
}

map.prototype.get_height = function ()
{
    return this.height;
}

map.prototype.set_height = function (height)
{
    this.height = height;
    this.on_rescale();
}

map.prototype.set_tile = function (index, tile)
{
    this.tiles[index] = tile;
}

map.prototype.get_layers = function ()
{
    return this.layers;
}

map.prototype.set_layers = function (layers)
{
    this.layers = layers;

    this.set_active_layer(layers[layers.length - 1]);
}

map.prototype.add_layer = function (layer)
{
    var layers = this.get_layers();

    layers.push(layer);
    this.set_active_layer(layer);
    this.render();
}

map.prototype.remove_layer = function (layer)
{
    var layers = this.get_layers();
    var index = layers.indexOf(layer);

    if (index !== -1)
        layers.splice(index, 1);
}

map.prototype.get_active_layer = function ()
{
    return this.active_layer;
}

map.prototype.set_active_layer = function (layer)
{
    this.active_layer = layer;
}