/**
 * This code is taken from http://govuk-elements.herokuapp.com/ which is made
 * available under the open government licence version 3
 * https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/
 */
;(function (global) {
    'use strict'

    var $ = global.jQuery

    var SelectionButtons = function (elmsOrSelector, opts) {
        this.selectedClass = 'sb-selected'
        this.focusedClass = 'sb-focused'
        this.radioClass = 'sb-radio'
        this.checkboxClass = 'sb-checkbox'
        if (opts !== undefined) {
            $.each(opts, function (optionName, optionObj) {
                this[optionName] = optionObj
            }.bind(this))
        }
        if (typeof elmsOrSelector === 'string') {
            this.selector = elmsOrSelector
            this.setInitialState($(this.selector))
        } else if (elmsOrSelector !== undefined) {
            this.$elms = elmsOrSelector
            this.setInitialState(this.$elms)
        }
        this.addEvents()
    }
    SelectionButtons.prototype.addEvents = function () {
        if (typeof this.$elms !== 'undefined') {
            this.addElementLevelEvents()
        } else {
            this.addDocumentLevelEvents()
        }
    }
    SelectionButtons.prototype.setInitialState = function ($elms) {
        $elms.each(function (idx, elm) {
            var $elm = $(elm)

            var labelClass = $elm.attr('type') === 'radio' ? this.radioClass : this.checkboxClass
            $elm.parent('label').addClass(labelClass)
            if ($elm.is(':checked')) {
                this.markSelected($elm)
            }
        }.bind(this))
    }
    SelectionButtons.prototype.markFocused = function ($elm, state) {
        if (state === 'focused') {
            $elm.parent('label').addClass(this.focusedClass)
        } else {
            $elm.parent('label').removeClass(this.focusedClass)
        }
    }
    SelectionButtons.prototype.markSelected = function ($elm) {
        var radioName

        if ($elm.attr('type') === 'radio') {
            radioName = $elm.attr('name')
            $($elm[0].form).find('input[name="' + radioName + '"]')
                .parent('label')
                .removeClass(this.selectedClass)
            $elm.parent('label').addClass(this.selectedClass)
        } else { // checkbox
            if ($elm.is(':checked')) {
                $elm.parent('label').addClass(this.selectedClass)
            } else {
                $elm.parent('label').removeClass(this.selectedClass)
            }
        }
    }
    SelectionButtons.prototype.addElementLevelEvents = function () {
        this.clickHandler = this.getClickHandler()
        this.focusHandler = this.getFocusHandler({ 'level': 'element' })

        this.$elms
            .on('click', this.clickHandler)
            .on('focus blur', this.focusHandler)
    }
    SelectionButtons.prototype.addDocumentLevelEvents = function () {
        this.clickHandler = this.getClickHandler()
        this.focusHandler = this.getFocusHandler({ 'level': 'document' })

        $(document)
            .on('click', this.selector, this.clickHandler)
            .on('focus blur', this.selector, this.focusHandler)
    }
    SelectionButtons.prototype.getClickHandler = function () {
        return function (e) {
            this.markSelected($(e.target))
        }.bind(this)
    }
    SelectionButtons.prototype.getFocusHandler = function (opts) {
        var focusEvent = (opts.level === 'document') ? 'focusin' : 'focus'

        return function (e) {
            var state = (e.type === focusEvent) ? 'focused' : 'blurred'

            this.markFocused($(e.target), state)
        }.bind(this)
    }
    SelectionButtons.prototype.destroy = function () {
        if (typeof this.selector !== 'undefined') {
            $(document)
                .off('click', this.selector, this.clickHandler)
                .off('focus blur', this.selector, this.focusHandler)
        } else {
            this.$elms
                .off('click', this.clickHandler)
                .off('focus blur', this.focusHandler)
        }
    }

    global.SelectionButtons = SelectionButtons
})(window)
