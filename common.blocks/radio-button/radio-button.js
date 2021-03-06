modules.define('i-bem__dom', ['next-tick'], function(provide, nextTick, BEMDOM) {

/**
 * @namespace JS-API блока radio-button
 * @name block
 */
BEMDOM.decl({ block : 'radio-button', baseBlock : 'radiobox' }, /** @lends block.prototype */ {

    onElemSetMod : {

        'radio' : {

            'checked' : function(elem, modName, modVal) {
                this.__base.apply(this, arguments);

                this.setMod(elem, 'pressed', modVal);
            },

            'next-for-pressed' : {

                'yes' : function() {
                    this.delMod(this.elem('radio', 'next-for-pressed', 'yes'), 'next-for-pressed');
                }

            },

            'pressed' : {

                'yes' : function(elem) {
                    this
                        .delMod(this.elem('radio'), 'pressed')
                        .setMod(elem.next(), 'next-for-pressed', 'yes');
                },

                '' : function(elem) {
                    this.delMod(elem.next(), 'next-for-pressed');
                }

            }

        }

    },

    _onMouseDown : function(e) {

        var radio = e.data.domElem;

        if(this.isDisabled(radio) || this.hasMod(radio, 'checked', 'yes'))
            return;

        this.setMod(radio, 'pressed', 'yes');

        this.bindToDoc('mouseup', function(e) {
            var _this = this;
            nextTick(function() {

                if(!_this.findElem(radio, 'control').prop('checked')) {
                    _this
                        .delMod(radio, 'pressed')
                        .setMod(_this.elem('radio', 'checked', 'yes'), 'pressed', 'yes');
                }

            });

            this.unbindFromDoc('mouseup');
        });

    }

}, /** @lends block */ {

    live : function() {
        this.__base.apply(this, arguments);

        this.liveBindTo('radio', 'mousedown', function(e) {
            this._onMouseDown(e);
        });

        return false;
    }

});

provide(BEMDOM);


});
