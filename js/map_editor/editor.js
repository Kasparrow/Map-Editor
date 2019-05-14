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
    this.update_tileset_ui();
    this.update_layers_ui();
    this.init_tilesheet_list();
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

editor.prototype.update_tileset_ui = function ()
{
    GL_TILESET_ELEMENT.innerHTML = '';
    var tileset = document.createElement('img');
    tileset.src = gl_tile_sheet.get_img();
    tileset.onclick = this.on_tileset_click.bind(this);
    GL_TILESET_ELEMENT.appendChild(tileset);
}

editor.prototype.init_tilesheet_list = function ()
{
    var tilesheet_ids = Object.keys(GL_TILE_SHEETS);

    for (var i = 0; i < tilesheet_ids.length; i++)
    {
        var option = document.createElement('option');
        option.id = tilesheet_ids[i];
        option.innerText = tilesheet_ids[i];
        GL_TILESHEET_INPUT.appendChild(option);
    }
}

editor.prototype.update_layers_ui = function ()
{
    GL_LAYER_ELEMENT.innerHTML = "";

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
        input.checked = true;
        input.onchange = this.create_layer_ui_handler(i);
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
        var selection = gl_editor.get_map().get_selection();
        for (var i = 0; i < selection.length; i++)
        {
            selection[i].set_img_id(id);
            selection[i].get_html_element().src = GL_TILE_SET[id];
        }
    }.bind(this);
}

editor.prototype.create_layer_ui_handler = function (index)
{
    return function () {
        var layers = this.get_map().get_layers();
        layers[index].toggle();
        this.on_layer_toggle();
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

    m.set_width(dim[1]);
    m.set_height(dim[2]);

    GL_MAP_WIDTH_INPUT.value = dim[0];
    GL_MAP_HEIGHT_INPUT.value = dim[1];
    
    // remove first row, which contains dimension
    tiles_info.splice(0, 1);

    // remove last row which is an empty line
    tiles_info.splice(tiles_info.length -1, 1);

    this.get_map().load_from_array(tiles_info);
    this.clear_map();
    this.render_map();
    this.update_layers_ui();
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

    GL_EDITOR_ADD_LAYER.onclick = this.on_add_layer.bind(this);

    GL_TILESHEET_INPUT.onchange = this.on_tilesheet_change.bind(this);

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

editor.prototype.on_add_layer = function (e)
{
    var m = this.get_map();

    var l = new layer({map: m, opacity: 0.25, visibility: true });
    l.init();
    m.add_layer(l);

    this.update_layers_ui();
}

editor.prototype.on_layer_toggle = function ()
{
    var m = this.get_map();
    var layers = m.get_layers();

    for (var i = layers.length - 1; i >= 0; i--)
    {
        if (layers[i].get_visibility())
        {
            m.set_active_layer(layers[i]);
            break;
        }
    }
}

editor.prototype.on_tileset_click = function (e)
{
    var img = e.target;

    var x = e.x - compute_offset_left(img) + img.parentNode.parentNode.scrollLeft + window.scrollX;
    var y = e.y - compute_offset_top(img) + img.parentNode.parentNode.scrollTop + window.scrollY;

    var col = Math.floor(x / 33);
    var row = Math.floor(y / 33);

    var tile_info = gl_tile_sheet.get_tile_src(col, row);

    var selection = gl_editor.get_map().get_selection();

        for (var i = 0; i < selection.length; i++)
        {
            selection[i].set_img_id(tile_info.id);
            selection[i].get_html_element().src = tile_info.src;
        }
    
}

editor.prototype.on_tilesheet_change = function (e)
{
    var tilesheet = e.target.options[e.target.selectedIndex].value;
    gl_tile_sheet = new tile_sheet(GL_TILE_SHEETS[tilesheet]);
    this.update_tileset_ui();
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