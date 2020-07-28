mw.Editor.controllers = {
    align: function (scope, api, rootScope) {
        this.root = mw.Editor.core.element();
        this.root.$node.addClass('mw-editor-state-component mw-editor-state-component-align');
        this.buttons = [];

        var arr = [
            {align: 'left', icon: 'left', action: 'justifyLeft'},
            {align: 'center', icon: 'center', action: 'justifyCenter'},
            {align: 'right', icon: 'right', action: 'justifyRight'},
            {align: 'justify', icon: 'justify', action: 'justifyFull'}
        ];
        this.render = function () {
            var scope = this;
            arr.forEach(function (item) {
                var el = mw.Editor.core.button({
                    props: {
                        className: 'mdi-format-align-' + item.icon
                    }
                });
                el.$node.on('mousedown touchstart', function (e) {
                    api.execCommand(item.action);
                });
                scope.root.append(el);
                scope.buttons.push(el);
            });
            return scope.root;
        };
        this.checkSelection = function (opt) {
            var align = opt.css.alignNormalize();
            for (var i = 0; i< this.buttons.length; i++) {
                var state = arr[i].align === align;
                rootScope.controllerActive(this.buttons[i].node, state);
            }
        };
        this.element = this.render();
    },
    bold: function (scope, api, rootScope) {
        this.render = function () {
            var scope = this;
            var el = mw.Editor.core.button({
                props: {
                    className: 'mdi-format-bold'
                }
            });

            el.$node.on('mousedown touchstart', function (e) {
                api.execCommand('bold');
            });
            return el;
        };
        this.checkSelection = function (opt) {
            if(opt.css.is().bold) {
                rootScope.controllerActive(opt.controller.element.node, true);
            } else {
                rootScope.controllerActive(opt.controller.element.node, false);
            }
            opt.controller.element.node.disabled = !opt.api.isSelectionEditable(opt.selection);
        };
        this.element = this.render();
    },
    'italic': function(scope, api, rootScope){
        this.render = function () {
            var el = mw.Editor.core.button({
                props: {
                    className: 'mdi-format-italic'
                }
            });
            el.$node.on('mousedown touchstart', function (e) {
                api.execCommand('italic');
            });
            return el;
        };
        this.checkSelection = function (opt) {
            opt.controller.element.node.disabled = !opt.api.isSelectionEditable(opt.selection);
            if(opt.css.is().italic) {
                rootScope.controllerActive(opt.controller.element.node, true);
            } else {
                rootScope.controllerActive(opt.controller.element.node, false);
            }
        };
        this.element = this.render();
    },
    'media': function(scope, api, rootScope){
        this.render = function () {
            var el = mw.Editor.core.button({
                props: {
                    className: 'mdi-folder-multiple-image'
                }
            });
            el.$node.on('click', function (e) {
                mw.fileWindow({
                    types: 'images',
                    change: function (url) {
                        url = url.toString();
                        api.insertImage(url);
                    }
                });
            });
            return el;
        };
        this.checkSelection = function (opt) {
            opt.controller.element.node.disabled = !opt.api.isSelectionEditable(opt.selection);
        };
        this.element = this.render();
    },
    'link': function(scope, api, rootScope){

        this.render = function () {
            var el = mw.Editor.core.button({
                props: {
                    className: 'mdi-link'
                }
            });
            el.$node.on('click', function (e) {
                api.saveSelection();
                var picker = mw.component({
                    url: 'link_editor_v2',
                    options: {
                        target: true,
                        text: true,
                        controllers: 'page, custom, content, section, layout, email, file',
                        values: {
                            url: 1,
                            text: 1,
                            targetBlank: el ? el.target === '_blank' : ''
                        }
                    }
                });
                $(picker).on('Result', function(e, result){
                    api.restoreSelection();
                    var sel = scope.getSelection();
                    var el = api.elementNode(sel.focusNode);
                    var elLink = el.nodeName === 'A' ? el : mw.tools.firstParentWithTag(el, 'a');
                    if (elLink) {
                        elLink.href = result.url;
                        if (result.text && result.text !== elLink.innerHTML) {
                            elLink.innerHTML = result.text;
                        }
                    } else {
                        api.insertHTML('<a href="'+ result.url +'">'+ (result.text || (sel.toString().trim()) || result.url) +'</a>');
                    }
                    console.log(el, result, elLink)
                    console.log(scope, api, rootScope)
                });
            });
            return el;
        };
        this.checkSelection = function (opt) {
            opt.controller.element.node.disabled = !opt.api.isSelectionEditable(opt.selection);
        };
        this.element = this.render();
    },
    fontSize: function (scope, api, rootScope) {
        this.checkSelection = function (opt) {
            var css = opt.css;
            var font = css.font();
            var size = font.size;
            opt.controller.element.$select.displayValue(size);
        };
        this.render = function () {
            var dropdown = new mw.Editor.core.dropdown({
                data: [
                    { label: '8px', value: 8 },
                    { label: '22px', value: 22 },
                ]
            });
            $(dropdown.select).on('change', function (e, val) {
                api.fontSize(val.value);
            });
            return dropdown.root;
        };
        this.element = this.render();
    },
    format: function (scope, api, rootScope) {
        this._availableTags = [
            { label: 'H1', value: 'h1' },
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' },
            { label: 'Paragraph', value: 'p' },
            { label: 'Block', value: 'div' }
        ];

        this.availableTags = function () {
            if(this.__availableTags) {
                return this.__availableTags;
            }
            this.__availableTags = this._availableTags.map(function (item) {
                return item.value;
            });
            return this.availableTags();
        };

        this.getTagDisplayName = function (tag) {
            tag = (tag || '').trim().toLowerCase();
            if(!tag) return;
            for (var i = 0; i < this._availableTags.length; i++) {
                if(this._availableTags[i].value === tag) {
                    return this._availableTags[i].label;
                }
            }
        };

        this.checkSelection = function (opt) {
            var el = opt.api.elementNode(opt.selection.focusNode);
            var parentEl = mw.tools.firstParentOrCurrentWithTag(el, this.availableTags());
            opt.controller.element.$select.displayValue(parentEl ? this.getTagDisplayName(parentEl.nodeName) : '');
        };
        this.render = function () {
            var dropdown = new mw.Editor.core.dropdown({
                data: this._availableTags
            });
            $(dropdown.select).on('change', function (e, val) {
                var sel = scope.getSelection();
                var range = sel.getRangeAt(0);
                var el = scope.actionWindow.document.createElement(val.value);

                var disableSelection = true;

                if(sel.isCollapsed || disableSelection) {
                    var selectionElement = api.elementNode(sel.focusNode);
                    if(scope.$editArea[0] !== selectionElement) {
                        mw.tools.setTag(selectionElement, val.value);
                    } else {
                        while (selectionElement.firstChild) {
                            el.appendChild(selectionElement.firstChild);
                        }
                        selectionElement.appendChild(el);
                    }
                    var newRange = scope.actionWindow.document.createRange();
                    newRange.setStart(sel.anchorNode, sel.anchorOffset);
                    newRange.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else {
                    range.surroundContents(el);
                }
            });
            return dropdown.root;
        };
        this.element = this.render();
    },
    fontSelector: function (scope, api, rootScope) {
        this.checkSelection = function (opt) {
            var css = opt.css;
                var font = css.font();
                var family_array = font.family.split(','), fam;
                if (family_array.length === 1) {
                    fam = font.family;
                } else {
                    fam = family_array.shift();
                }
                fam = fam.replace(/['"]+/g, '');
                opt.controller.element.$select.displayValue(fam);

        };
        this.render = function () {
            var dropdown = new mw.Editor.core.dropdown({
                data: [
                    { label: 'Arial 1', value: 'Arial' },
                    { label: 'Verdana 1', value: 'Verdana' },
                ]
            });
            $(dropdown.select).on('change', function (e, val) {
                api.fontFamily(val.value);
            });
            return dropdown.root;
        };
        this.element = this.render();
    },
    undoRedo: function(scope, api, rootScope) {
        this.render = function () {
            this.root = mw.Editor.core.element();
            this.root.$node.addClass('mw-ui-btn-nav mw-editor-state-component')
            var undo = mw.Editor.core.button({
                props: {
                    className: 'mdi-undo'
                }
            });
            undo.$node.on('mousedown touchstart', function (e) {
                rootScope.state.undo();
            });

            var redo = mw.Editor.core.button({
                props: {
                    className: 'mdi-redo'
                }
            });
            redo.$node.on('mousedown touchstart', function (e) {
                rootScope.state.redo();
            });
            this.root.node.appendChild(undo.node);
            this.root.node.appendChild(redo.node);
            $(rootScope.state).on('stateRecord', function(e, data){
                undo.node.disabled = !data.hasNext;
                redo.node.disabled = !data.hasPrev;
            })
            .on('stateUndo stateRedo', function(e, data){
                if(!data.active || !data.active.target) {
                    undo.node.disabled = !data.hasNext;
                    redo.node.disabled = !data.hasPrev;
                    return;
                }
                if(scope.actionWindow.document.body.contains(data.active.target)) {
                    mw.$(data.active.target).html(data.active.value);
                } else{
                    if(data.active.target.id) {
                        mw.$(scope.actionWindow.document.getElementById(data.active.target.id)).html(data.active.value);
                    }
                }
                if(data.active.prev) {
                    mw.$(data.active.prev).html(data.active.prevValue);
                }
                // mw.drag.load_new_modules();
                undo.node.disabled = !data.hasNext;
                redo.node.disabled = !data.hasPrev;
                $(scope).trigger(e.type, [data]);
            });
            setTimeout(function () {
                var data = rootScope.state.eventData();
                undo.node.disabled = !data.hasNext;
                redo.node.disabled = !data.hasPrev;
            }, 78);
            return this.root;
        };
        this.element = this.render();
    },
};
