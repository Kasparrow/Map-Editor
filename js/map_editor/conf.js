'use strict';

var GL_TILE_SIZE = 34;
var GL_MAP_ELEMENT = document.getElementById('map');

var GL_MAP_WINDOW = document.getElementById('map-window')
var GL_PROPERTY_WINDOW = document.getElementById('property-window');

var GL_MAP_NAME_INPUT = document.getElementById('input-map-name');
var GL_MAP_WIDTH_INPUT = document.getElementById('input-map-width');
var GL_MAP_HEIGHT_INPUT = document.getElementById('input-map-height');
var GL_TILESHEET_INPUT = document.getElementById('input-tilesheet');

var GL_EDITOR_NEW = document.getElementById('btn-new');
var GL_EDITOR_LOAD = document.getElementById('btn-load');
var GL_EDITOR_SAVE = document.getElementById('btn-save');

var GL_EDITOR_RENDER = document.getElementById('btn-render');
var GL_EDITOR_EDIT = document.getElementById('btn-edit');

var GL_TILESET_ELEMENT = document.getElementById('tileset');
var GL_LAYER_ELEMENT = document.getElementById('layers');

var GL_EDITOR_ADD_LAYER = document.getElementById('btn-add-layer');

var GL_TILE_SHEETS = {
    Summer: {
        img: 'resources/tilesheet1.png', 
        width: 32, 
        height: 32,
        padding: 1,
        col: 19,
        row: 20
    },

    Winter: {
        img: 'resources/tilesheet2.png',
        width: 32, 
        height: 32,
        padding: 1,
        col: 19,
        row: 20
    }
    
}