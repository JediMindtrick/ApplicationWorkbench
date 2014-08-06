define([
    'Lib/jquery'
    ],function($){

    var Point = function(x,y){
        this.x = x;
        this.y = y;
    };  

    Point.prototype.isUnderOf = function(p){
        return this.y >= p.y;
    };
    Point.prototype.isAboveOf = function(p){
        return this.y <= p.y;
    };
    Point.prototype.isRightOf = function(p){
        return this.x >= p.x;
    };
    Point.prototype.isLeftOf = function(p){
        return this.x <= p.x;
    };
    Point.prototype.isUnderRight = function(p){
        return this.isUnderOf(p) && this.isRightOf(p);
    };
    Point.prototype.isUnderLeft = function(p){
        return this.isUnderOf(p) && this.isLeftOf(p);
    };
    Point.prototype.isAboveRight = function(p){
        return this.isAboveOf(p) && this.isRightOf(p);
    };        
    Point.prototype.isAboveLeft = function(p){
        return this.isAboveOf(p) && this.isLeftOf(p);
    };

    var Rectangle = function(ctrl){
        if(typeof ctrl === 'undefined'){
            return;
        }

        var x = parseInt($(ctrl).attr('x'));
        var y = parseInt($(ctrl).attr('y'));

        var _w = parseInt($(ctrl).attr('w'));
        var _h = parseInt($(ctrl).attr('h'));
        var w = _w === -1 ? parseInt($(ctrl).attr('measuredW')) : _w;
        var h = _h === -1 ? parseInt($(ctrl).attr('measuredH')) : _h;

        this.ul = new Point(x,y);
        this.ur = new Point(x+w,y);
        this.bl = new Point(x,y+h);
        this.br = new Point(x+w,y+h);
    };

    Rectangle.fromUIRectangle = function(rect){
        toReturn = new Rectangle();

        toReturn.ul = new Point(rect.ul.x,rect.ul.y);
        toReturn.ur = new Point(rect.ur.x,rect.ur.y);
        toReturn.bl = new Point(rect.bl.x,rect.bl.y);
        toReturn.br = new Point(rect.br.x,rect.br.y);

        return toReturn;
    };

    Rectangle.fromXml = function(ctrl){
        var toReturn = new Rectangle();

        var x = parseInt($(ctrl).attr('x'));
        var y = parseInt($(ctrl).attr('y'));

        var _w = parseInt($(ctrl).attr('w'));
        var _h = parseInt($(ctrl).attr('h'));
        var w = _w === -1 ? parseInt($(ctrl).attr('measuredW')) : _w;
        var h = _h === -1 ? parseInt($(ctrl).attr('measuredH')) : _h;

        toReturn.ul = new Point(x,y);
        toReturn.ur = new Point(x+w,y);
        toReturn.bl = new Point(x,y+h);
        toReturn.br = new Point(x+w,y+h);

        return toReturn;
    };

    Rectangle.prototype.isWithin = function(outer) {
        var one = this.ul.isUnderRight(outer.ul);
        var two = this.ur.isUnderLeft(outer.ur);
        var three = this.bl.isAboveRight(outer.bl);
        var four = this.br.isAboveLeft(outer.br);

        return one &&
            two &&
            three &&
            four;
    };
    Rectangle.prototype.isAfter = function(prior){
        return this.ul.isUnderOf(prior.bl) &&
            this.ur.isUnderOf(prior.br);
    };
    Rectangle.prototype.isBefore = function(after){
        return this.bl.isAboveOf(after.ul) &&
            this.br.isAboveOf(after.ur);
    };

    //STILL NEED:
    //isAround (inverse of isWithin)

    //REFACTOR towards these, so that we can have better detection
    //of where to insert elements in the DOM, i.e. to handle 
    //elements that are laid-out beside each other
    //isBelow (current isAfter)
    //isAbove (current isBefore)
    //isLeftOf (like isAfter only on x axis)
    //isRightOf (see isLeftOf)

    /*
I believe we might only need isAround() and isRightOf()

algorithm then becomes:
    if isAround() then wrap...and then the current algorithm

isAfter() becomes:
    if isRightOf() or isBelowOf() then return true

I think this will handle *most* cases of layout we will use
*/

    return Rectangle;
});