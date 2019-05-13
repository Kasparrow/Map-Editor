'use strict';

function map (options)
{
    this.set_editor(options.editor);
    this.set_width(options.width);
    this.set_height(options.height);
    this.set_tiles([]);
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
}

map.prototype.get_height = function ()
{
    return this.height;
}

map.prototype.set_height = function (height)
{
    this.height = height;
}

map.prototype.set_tile = function (index, tile)
{
    this.tiles[index] = tile;
}

map.prototype.render = function (parent)
{
    var tiles = this.get_tiles();
    GL_MAP_ELEMENT.style.width = this.get_width() * GL_TILE_SIZE  + 'px';
    GL_MAP_ELEMENT.style.height = this.get_height() * GL_TILE_SIZE + 'px';

    for (var i = 0; i < tiles.length; i++)
        tiles[i].render(parent);
}

map.prototype.init = function ()
{
    this.rescale_tile_array();
    this.bind_event();
}

map.prototype.rescale_tile_array = function ()
{
    var tiles = this.get_tiles();
    var new_size = this.get_width() * this.get_height();
    var current_size = tiles.length;

    if (new_size < current_size)
        tiles.splice(new_size, current_size);

    if (new_size > current_size)
        for (var i = current_size; i < new_size; i++)
            tiles.push(new tile({img_id: 40, map: this }));
}

map.prototype.bind_event = function ()
{   
    GL_MAP_ELEMENT.onmousedown = this.on_mousedown.bind(this);
    GL_MAP_ELEMENT.onmousemove = this.on_mousemove.bind(this);
    GL_MAP_ELEMENT.onmouseup = this.on_mouseup.bind(this);
}

map.prototype.on_mousedown = function (e)
{
    if (this.get_editor().get_mode() === editor_mode.render)
        return;

    this.is_mouse_down = true;

    var  { x, y } = this.get_event_coordinates(e);

    this.clear_selection();
    this.start_x = Math.floor(x / GL_TILE_SIZE);
    this.start_y = Math.floor(y / GL_TILE_SIZE);

    this.on_mousemove(e);
}

map.prototype.on_mousemove = function (e)
{
    if (this.get_editor().get_mode() === editor_mode.render)
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

    for (var j = min_x; j <= max_x; j++)
    {
        for (var i = min_y; i <= max_y; i++)
        {
            var tile_index = i * this.get_width() + j;
            this.tiles[tile_index].get_html_element().className = "selected";

            selection.push(this.tiles[tile_index]);
        }
    }

    this.set_selection(selection);
}

map.prototype.serialize = function ()
{
    var tiles = this.get_tiles();
    var res = this.get_width() + " " + this.get_height() + '\r\n';

    for (var i = 0; i < tiles.length; i++)
        res += tiles[i].serialize() + "\r\n";

    return res;
}

map.prototype.load_from_array = function (tiles)
{
    var new_tiles = [];

    for (var i = 0; i < tiles.length; i++)
        new_tiles.push(new tile({img_id: tiles[i], map: this }));

    this.set_tiles(new_tiles);
}

map.prototype.on_mouseup = function ()
{
    this.is_mouse_down = false;
}

map.prototype.get_selection = function ()
{
    return this.selection || [];
}

map.prototype.set_selection = function (selection)
{
    this.selection = selection;
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

map.prototype.get_event_coordinates = function (e)
{
    return {
        x: e.x - GL_MAP_ELEMENT.offsetLeft + GL_MAP_ELEMENT.parentNode.parentNode.scrollLeft,
        y: e.y - GL_MAP_ELEMENT.offsetTop - 56 + GL_MAP_ELEMENT.parentNode.parentNode.scrollTop
    }
}

map.prototype.get_editor = function ()
{
    return this.editor;
}

map.prototype.set_editor = function (editor)
{
    this.editor = editor;
}