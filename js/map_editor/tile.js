'use strict';

function tile (options)
{
    this.set_img_id(options.img_id);
    this.set_map(options.map);

    this.set_html_element(this.create_html_element());
}

tile.prototype.get_img = function ()
{
    return GL_TILE_SET[this.get_img_id()];
}

tile.prototype.get_img_id = function ()
{
    return this.img_id;
}

tile.prototype.set_img_id = function (img_id)
{
    this.img_id = img_id;
}

tile.prototype.get_map = function ()
{
    return this.map;
}

tile.prototype.set_map = function (map)
{
    this.map = map;
}

tile.prototype.get_html_element = function ()
{
    return this.html_element;
}

tile.prototype.set_html_element = function (element)
{
    this.html_element = element;
}

tile.prototype.create_html_element = function ()
{
    var element = document.createElement('img')
    element.className = 'unselected';
    element.style.width = GL_TILE_SIZE + "px";
    element.style.height = GL_TILE_SIZE + "px";
    element.style.float = 'left';
    element.src = this.get_img();
    element.ondragstart = function () { return false; }
    return element;
}

tile.prototype.render = function (parent)
{
    parent.appendChild(this.get_html_element());
}

tile.prototype.serialize = function ()
{
    return this.get_img_id();
}