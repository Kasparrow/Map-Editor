'use strict';

var GL_TILE_SIZE = 34;
var GL_MAP_ELEMENT = document.getElementById('map');

var GL_MAP_WINDOW = document.getElementById('map-window')
var GL_PROPERTY_WINDOW = document.getElementById('property-window');

var GL_MAP_NAME_INPUT = document.getElementById('input-map-name');
var GL_MAP_WIDTH_INPUT = document.getElementById('input-map-width');
var GL_MAP_HEIGHT_INPUT = document.getElementById('input-map-height');

var GL_EDITOR_NEW = document.getElementById('btn-new');
var GL_EDITOR_LOAD = document.getElementById('btn-load');
var GL_EDITOR_SAVE = document.getElementById('btn-save');

var GL_EDITOR_RENDER = document.getElementById('btn-render');
var GL_EDITOR_EDIT = document.getElementById('btn-edit');

var GL_TILESET_ELEMENT = document.getElementById('tileset');
var GL_LAYER_ELEMENT = document.getElementById('layers')

var GL_TILE_SET = ['resources/default_tile.png'];

// add forrest tiles
for (var i = 1; i < 35; i++)
    GL_TILE_SET.push("resources/forrest_" + i + ".png");

// add grass_rock tiles
for (var i = 1; i < 14; i++)
    GL_TILE_SET.push("resources/grass_rock_" + i + ".png");

// rock mud
for (var i = 1; i < 39; i++)
    GL_TILE_SET.push("resources/rock_mud_" + i + ".png");

// mud
for (var i = 1; i < 48; i++)
    GL_TILE_SET.push("resources/mud_" + i + ".png");

// mud
for (var i = 1; i < 32; i++)
    GL_TILE_SET.push("resources/mud_water_" + i + ".png");

// grass
for (var i = 1; i < 49; i++)
    GL_TILE_SET.push("resources/grass_" + i + ".png");

// mud grass
for (var i = 1; i < 31; i++)
    GL_TILE_SET.push("resources/mud_grass_" + i + ".png");

// water
for (var i = 1; i < 34; i++)
    GL_TILE_SET.push("resources/water_" + i + ".png");

GL_TILE_SET.push('resources/tower.png');
GL_TILE_SET.push('resources/wall_bottom_end.png');
GL_TILE_SET.push('resources/wall_bottom_left_corner.png');
GL_TILE_SET.push('resources/wall_bottom_right_corner.png');
GL_TILE_SET.push('resources/wall_bottom_triway.png');
GL_TILE_SET.push('resources/wall_cross_way.png');
GL_TILE_SET.push('resources/wall_left_end.png');
GL_TILE_SET.push('resources/wall_left_triway.png');
GL_TILE_SET.push('resources/wall_right_end.png');
GL_TILE_SET.push('resources/wall_right_triway.png');
GL_TILE_SET.push('resources/wall_top.png');
GL_TILE_SET.push('resources/wall_top_end.png');
GL_TILE_SET.push('resources/wall_top_left_corner.png');
GL_TILE_SET.push('resources/wall_top_right_corner.png');
GL_TILE_SET.push('resources/wall_top_triway.png');
GL_TILE_SET.push('resources/wall_vertical_1.png');
GL_TILE_SET.push('resources/wall_vertical_2.png');