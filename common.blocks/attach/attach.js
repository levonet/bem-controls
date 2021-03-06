modules.define('i-bem__dom', ['jquery'],
    function(provide, $, BEMDOM) {

/**
 * @namespace
 * @name Attach
 */
BEMDOM.decl('attach', /** @lends Attach.prototype */ {

    onSetMod : {

        'js' : {

            'inited': function() {

                this._noFileText = this.elem('text').text();
                this._update();

                this.bindTo('reset', 'click', this.resetFile);

                this._getButton()
                    .on('focus', this._onButtonFocus, this)
                    .on('blur', this._onButtonBlur, this);
            }

        }

    },

    _onButtonFocus : function() {
        this._isControlFocused() || this.elem('control').focus();
    },

    _onButtonBlur : function() {
        this._isControlFocused() && this.elem('control').blur();
    },

    /**
     * Возвращает значение контрола, путь к выбранному файлу
     * @returns {String}
     */
    val : function() {

        return this.elem('control').val();

    },

    /**
     * Сбросить выбранное значение контрола
     * @returns {BEM.DOM}
     */
    resetFile : function() {

        var buttonControl = this.elem('control');

        buttonControl.replaceWith(BEM.HTML.build({
            block: 'attach',
            elem: 'control',
            tag: 'input',
            attrs: {
                name: buttonControl.attr('name'),
                type: 'file',
                tabindex: buttonControl.attr('tabindex')
            }
        }));

        this.dropElemCache('control');

        this._update();
        this.delMod(this.elem('reset'), 'visibility');

        return this.trigger('reset');
    },

    /**
     * @private
     */
    _update : function() {

        var fileName = this._getFileByPath(this.val());

        this._setFile(fileName);
        this._setExtension(this._getExtension(fileName));

        this.setMod(this.elem('reset'), 'visibility', 'visible');

        fileName && this.trigger('change');
    },

    /**
     * @private
     * @param {String} path
     * @returns {String}
     */
    _getFileByPath : function(path) {

        return path.split('\\').pop();

    },

    /**
     * @private
     * @param {String} fileName
     */
    _setFile : function(fileName) {

        this.setMod(this.elem('holder'), 'state', fileName ? '' : 'hidden');
        this.elem('text').html(fileName || this._noFileText);
    },

    _extensionsToMods : {
        'zip' : 'archive',
        'rar' : 'archive',
        'tar' : 'archive',
        'gz' : 'archive',
        '7z' : 'archive',
        'gif' : 'gif',
        'jpg' : 'jpg',
        'jpeg' : 'jpg',
        'png' : 'png',
        'eml' : 'eml',
        'exe' : 'exe',
        'm4a' : 'audio',
        'ogg' : 'audio',
        'mp3' : 'mp3',
        'wav' : 'wav',
        'wma' : 'wma',
        'flv' : 'video',
        'mov' : 'mov',
        'wmv' : 'wmv',
        'mp4' : 'mp4',
        'avi' : 'avi',
        'xls' : 'xls',
        'doc' : 'doc',
        'docx' : 'doc',
        'txt' : 'txt',
        'pdf' : 'pdf',
        'ppt' : 'ppt'
    },

    /**
     * @private
     * @param {String} fileName
     * @returns {String}
     */
    _getExtension : function(fileName) {

        return this._extensionsToMods[fileName.split('.').pop().toLowerCase()] || '';

    },

    /**
     * @private
     * @param {String} extension
     */
    _setExtension : function(extension) {

        this.setMod(this.elem('holder'), 'file', extension || this.params.unknownType);

    },

    getDefaultParams : function() {

        return {
            unknownType : 'unknown'
        }
    },

    /**
     * @private
     * @returns {BEM.DOM}
     */
    _getButton : function() {
        return this._button || (this._button = this.findBlockOn('button', 'button'));
    },

    /**
     * Проверяет в фокусе ли контрол
     * @private
     * @returns {Boolean}
     */
    _isControlFocused : function() {

        try {
            return this.containsDomElem($(document.activeElement));
        } catch(e) {
            return false;
        }

    }

}, /** @lends Attach */{

    live : function() {

        this
            .liveBindTo('change', function() {
                this._update();
            })
            .liveBindTo('control', 'focusin focusout',  function(e) {
                this._getButton().toggleMod('focused', 'yes', '', e.type === 'focusin');
            });

        if ($.browser.msie && parseInt($.browser.version) <= 8) {

            var intervalId,
                prevPath;

            this.liveBindTo('click', function() {

                if (typeof prevPath == 'undefined')
                    prevPath = this.val();

                var that = this;

                intervalId = setInterval(function() {
                    var path = that.val();
                    if (prevPath != path) {
                        clearInterval(intervalId);
                        prevPath = path;
                        that._update();
                    }
                }, 300);

            });

        }

        return false;

    }

});

provide(BEMDOM);

});
