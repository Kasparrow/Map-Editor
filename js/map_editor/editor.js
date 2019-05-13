"use strict";

var editor_mode = {
    edit: 0,
    render: 1
}

function editor ()
{

}

editor.prototype.create_new = function ()
{
    this.init_map();

    GL_MAP_WIDTH_INPUT.value = 10;
    GL_MAP_HEIGHT_INPUT.value = 10;
}

editor.prototype.init = function ()
{
    this.create_new();
    this.init_tileset_ui();
    this.update_layers_ui();
    this.init_dom_events();
    this.set_mode(editor_mode.edit);
}

editor.prototype.init_map = function ()
{
    var m = new map({editor: this, width: 10, height: 10});
    var l = new layer({map: m, opacity: 1, visibility: true});

    l.init();
    m.add_layer(l);
    m.init();

    this.set_map(m);
}

editor.prototype.init_tileset_ui = function ()
{
    for (var i = 0; i < GL_TILE_SET.length; i++)
    {
        var tile_ui = document.createElement('img');
        tile_ui.src = GL_TILE_SET[i];
        tile_ui.width = 32;
        tile_ui.height = 32;
        tile_ui.style.float = 'left';
        tile_ui.style.padding = '1px';
        tile_ui.onclick = this.create_tile_ui_handler(i);
        GL_TILESET_ELEMENT.appendChild(tile_ui);
    }
}

editor.prototype.update_layers_ui = function ()
{
    var layers = this.get_map().get_layers();

    var form = document.createElement('form');
    form.className = "mt-3"

    for (var i = 0; i < layers.length; i++)
    {
        var element = document.createElement('div');
        element.className = "form-check row ml-0 mr-0";
        var input = document.createElement('input');
        input.type = "checkbox";
        input.className = "form-check-input";
        input.id = "layer_" + i;
        var label = document.createElement('label');
        label.className = "form-check-label";
        label.setAttribute('for', "layer_" + i);
        label.innerText = "Layer " + i;

        element.appendChild(input);
        element.appendChild(label);
        form.appendChild(element);
    }

    GL_LAYER_ELEMENT.appendChild(form);
}

editor.prototype.create_tile_ui_handler = function (id)
{
    return function () {
        console.log(id);
        var selection = gl_editor.get_map().get_selection();
        for (var i = 0; i < selection.length; i++)
        {
            selection[i].set_img_id(id);
            selection[i].get_html_element().src = GL_TILE_SET[id];
        }
    }.bind(this);
}

editor.prototype.render_map = function ()
{
    this.get_map().render(GL_MAP_ELEMENT);
}

editor.prototype.clear_map = function ()
{
    this.get_map().clear();
}

editor.prototype.load = function (data)
{
    var tiles_info = data.split('\r\n');
    var m = this.get_map();
    var dim = tiles_info[0].split(' ');

    m.set_width(dim[0]);
    m.set_height(dim[1]);

    GL_MAP_WIDTH_INPUT.value = dim[0];
    GL_MAP_HEIGHT_INPUT.value = dim[1];
    
    // remove first row, which contains dimension
    tiles_info.splice(0, 1);

    // remove last row which is an empty line
    tiles_info.splice(tiles_info.length -1, 1);

    this.get_map().load_from_array(tiles_info);
    this.clear_map();
    this.render_map();
}

editor.prototype.init_dom_events = function ()
{
    // must be called once to init map wrapper
    this.on_window_resize();

    GL_MAP_WIDTH_INPUT.onchange = this.on_map_width.bind(this);
    GL_MAP_HEIGHT_INPUT.onchange = this.on_map_height.bind(this);
    
    GL_EDITOR_NEW.onclick = this.on_new.bind(this);
    GL_EDITOR_LOAD.onclick = this.on_load.bind(this);
    GL_EDITOR_SAVE.onclick = this.on_save.bind(this);

    GL_EDITOR_RENDER.onclick = this.on_render.bind(this);
    GL_EDITOR_EDIT.onclick = this.on_edit.bind(this);

    window.onresize = this.on_window_resize.bind(this);
}

// DOM EVENT

editor.prototype.on_map_width = function (e)
{
    var map = this.get_map();

    map.set_width(GL_MAP_WIDTH_INPUT.value);

    map.clear();
    this.render_map();
}

editor.prototype.on_map_height = function (e)
{
    var map = this.get_map();

    map.set_height(GL_MAP_HEIGHT_INPUT.value);
    map.clear();
    
    this.render_map();
}

editor.prototype.on_window_resize = function (e)
{
    var wrappers = document.getElementsByClassName('ui-wrapper');
    var viewport_height = this.get_viewport_dim().height;

    for (var i = 0; i < wrappers.length; i++)
    {
        var wrapper = wrappers[i];
        wrapper.style.height = viewport_height;
        wrapper.style.maxHeight = viewport_height;
    }

    GL_MAP_WINDOW.style.maxHeight = viewport_height + 'px';
    GL_PROPERTY_WINDOW.style.height = viewport_height + 'px';
}

editor.prototype.on_new = function (e)
{
    this.create_new();
    this.clear_map();
    this.render_map();
}

editor.prototype.on_load = function (e)
{
    open_file(this.load.bind(this));
}

editor.prototype.on_save = function (e)
{
    var data = this.get_map().serialize();

    download(data, GL_MAP_NAME_INPUT.value, "map"); 
}

editor.prototype.on_render = function (e)
{
    this.set_mode(editor_mode.render);
}

editor.prototype.on_edit = function (e)
{
    this.set_mode(editor_mode.edit);
}

// UTILS

editor.prototype.get_viewport_dim = function ()
{
    var w = window;
    var d = document;
    var e = d.documentElement;
    var g = d.getElementsByTagName('body')[0];

    return {
        width: (w.innerWidth || e.clientWidth || g.clientWidth),
        height: (w.innerHeight|| e.clientHeight|| g.clientHeight) - 56
    };
}

// ACCESSORS

editor.prototype.get_map = function ()
{
    return this.map;
}

editor.prototype.set_map = function (map)
{
    this.map = map;
}

editor.prototype.get_mode = function ()
{
    return this.mode;
}

editor.prototype.is_edit_mode = function ()
{
    return this.get_mode() === editor_mode.edit;
}

editor.prototype.is_render_mode = function ()
{
    return this.get_mode() === editor_mode.render;
}

editor.prototype.set_mode = function (mode)
{
    this.mode = mode;
    var tiles = this.get_map().get_active_layer().get_tiles();

    for (var i = 0; i < tiles.length; i++)
    {
        var t = tiles[i];

        if (mode === editor_mode.render)
            t.get_html_element().className = '';

        if (mode === editor_mode.edit)
            t.get_html_element().className = 'unselected';
    }
}