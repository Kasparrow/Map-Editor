"use strict";

function layer (options)
{
    this.set_opacity(options.opacity);
    this.set_tiles([]);
    this.set_map(options.map);
    this.set_visibility(options.visibility);
    this.set_html_element(this.create_html_element());
}

layer.prototype.init = function ()
{
    var m = this.get_map();

    this.rescale(m.get_width(), m.get_height());
}

// - RENDER

layer.prototype.create_html_element = function ()
{
    var m = this.get_map();
    var element = document.createElement('div');

    element.style.position = 'absolute';
    element.style.top = 0;
    element.style.left = 0;
    element.style.opacity = this.get_opacity();
    element.style.width = m.get_width() * GL_TILE_SIZE  + 'px';
    element.style.height = m.get_height() * GL_TILE_SIZE + 'px';

    return element;
}

layer.prototype.render = function ()
{
    var tiles = this.get_tiles();
    var element = this.get_html_element();

    for (var i = 0; i < tiles.length; i++)
    {
        var t = tiles[i];

        element.appendChild(t.get_html_element());
    }

    GL_MAP_ELEMENT.appendChild(element);
}

// UTILS

layer.prototype.rescale = function (width, height)
{
    var tiles = this.get_tiles();
    var current_size = tiles.length;
    var new_size = width * height;
    var element = this.get_html_element();

    if (new_size < current_size)
        tiles.splice(new_size, current_size);

    if (new_size > current_size)
        for (var i = current_size; i < new_size; i++)
            tiles.push(new tile({img_id: 0, layer: this }));
    
    if (!element)
        return;

    element.style.width = width * GL_TILE_SIZE  + 'px';
    element.style.height = height * GL_TILE_SIZE + 'px';
}

layer.prototype.serialize = function ()
{
    var tiles = this.get_tiles();
    var res = '';

    for (var i = 0; i < tiles.length; i++)
        res += tiles[i].serialize();
    
    return res;
}

// - ACCESSOR

layer.prototype.get_opacity = function ()
{
    return this.opacity;
}

layer.prototype.set_opacity = function (opacity)
{
    this.opacity = opacity;
}

layer.prototype.get_tiles = function ()
{
    return this.tiles;
}

layer.prototype.set_tiles = function (tiles)
{
    this.tiles = tiles;
}

layer.prototype.add_tile = function (tile)
{
    var tiles = this.get_tiles();

    tiles.push(tile);
}

layer.prototype.get_map = function ()
{
    return this.map;
}

layer.prototype.set_map = function (map)
{
    this.map = map;
}

layer.prototype.get_html_element = function ()
{
    return this.html_element;
}

layer.prototype.set_html_element = function (html_element)
{
    this.html_element = html_element;
}

layer.prototype.get_visibility = function ()
{
    return this.visibility;
}

layer.prototype.set_visibility = function (visibility)
{
    this.visibility = visibility;
}

layer.prototype.get_index = function ()
{
    var m = this.get_map();
    var layers = m.get_layers();

    return layers.indexOf(this);
}