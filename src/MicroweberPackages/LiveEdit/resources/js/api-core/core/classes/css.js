



export const CSSParser = function(el) {
    if(!el || !el.nodeName) return false;
    if(el.nodeName === '#text') return false;



    const css = window.getComputedStyle(el, null);



    var f = {};

    f.display = function(){
        return css.display;
    };

    f.is = function(){
        return {
            bold: parseFloat(css.fontWeight) >= 600 || css.fontWeight === 'bold' || css.fontWeight === 'bolder',
            italic: css.fontStyle === 'italic'||css.fontStyle === 'oblique',
            underlined: css.textDecoration === 'underline',
            striked: css.textDecoration.indexOf('line-through') === 0,
        };
    };
    f.font = function(){
        if(css === null) return false;
        return {
            size:css.fontSize,
            weight:css.fontWeight,
            style:css.fontStyle,
            height:css.lineHeight,
            family:css.fontFamily,
            color:css.color
        };
    }
    f.alignNormalize = function(){
        if(!!css){
            var a = css.textAlign;
            return a.contains('left')?'left':a.contains('center')?'center':a.contains('justify')?'justify':a.contains('right')?'right':'left';
        }
    }
    f.border = function(parse){
        if(!parse){
            return {
                top:{width:css.borderTopWidth, style:css.borderTopStyle, color:css.borderTopColor},
                left:{width:css.borderLeftWidth, style:css.borderLeftStyle, color:css.borderLeftColor},
                right:{width:css.borderRightWidth, style:css.borderRightStyle, color:css.borderRightColor},
                bottom:{width:css.borderBottomWidth, style:css.borderBottomStyle, color:css.borderBottomColor}
            }
        }
        else{
            return {
                top:{width:parseFloat(css.borderTopWidth), style:css.borderTopStyle, color:css.borderTopColor},
                left:{width:parseFloat(css.borderLeftWidth), style:css.borderLeftStyle, color:css.borderLeftColor},
                right:{width:parseFloat(css.borderRightWidth), style:css.borderRightStyle, color:css.borderRightColor},
                bottom:{width:parseFloat(css.borderBottomWidth), style:css.borderBottomStyle, color:css.borderBottomColor}
            }
        }

    }
    f.width = function(){
        return css.width;
    }
    f.position = function(){
        return css.position;
    }
    f.textTransform  = function(){
        return css.textTransform ;
    }
    f.background = function(){
        return {
            image:css.backgroundImage,
            color:css.backgroundColor,
            position:css.backgroundPosition,
            repeat:css.backgroundRepeat
        }
    }
    f.margin = function(parse, actual){
        if(actual){
            var _parent = el.parentNode;
            var parentOff = mw.$(_parent).offset();
            var elOff = mw.$(el).offset();
            if(elOff.left > parentOff.left && css.marginLeft === css.marginRight && elOff.left - parentOff.left === parseInt(css.marginLeft, 10)){
                return {
                    top:css.marginTop,
                    left:'auto',
                    right:'auto',
                    bottom:css.marginBottom
                };
            }
        }
        if(!parse){
            return {
                top:css.marginTop,
                left:css.marginLeft,
                right:css.marginRight,
                bottom:css.marginBottom
            }
        }
        else{
            return {
                top:parseFloat(css.marginTop),
                left:parseFloat(css.marginLeft),
                right:parseFloat(css.marginRight),
                bottom:parseFloat(css.marginBottom)
            }
        }
    }
    f.padding = function(parse){
        if(!parse){
            return {
                top:css.paddingTop,
                left:css.paddingLeft,
                right:css.paddingRight,
                bottom:css.paddingBottom
            }
        }
        else{
            return {
                top:parseFloat(css.paddingTop),
                left:parseFloat(css.paddingLeft),
                right:parseFloat(css.paddingRight),
                bottom:parseFloat(css.paddingBottom)
            }
        }
    }
    f.opacity = function(){return css.opacity}

    f.radius = function(parse){
        if(!parse){
            return {
                tl:css.borderTopLeftRadius,
                tr:css.borderTopRightRadius,
                br:css.borderBottomRightRadius,
                bl:css.borderBottomLeftRadius
            }
        }
        else{
            return {
                tl:parseFloat(css.borderTopLeftRadius),
                tr:parseFloat(css.borderTopRightRadius),
                br:parseFloat(css.borderBottomRightRadius),
                bl:parseFloat(css.borderBottomLeftRadius)
            }
        }
    }

    f.transform = function(){
        let transform = css['transform'] || css['WebkitTransform'];
        if(transform==="" || transform==="none"){
            return [1, 0, 0, 1, 0, 0];
        }
        else{
            transform = transform.substr(7, transform.length - 8).split(", ");
            return transform;
        }
    }

    f.shadow = function(){
         const shadow = (css['boxShadow'] || css['WebkitBoxShadow']).replace(/, /g, ",").split(" ");
        return {
            color: shadow[0],
            left: shadow[1],
            top: shadow[2],
            blur: shadow[3],
            spread: shadow[3]
        }
    }

    return {
        el: el,
        css: css,
        get: f
    }
}


