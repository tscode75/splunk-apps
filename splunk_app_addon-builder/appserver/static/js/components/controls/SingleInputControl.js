import $ from "jquery";
import _ from "lodash";
import Control from "views/shared/controls/Control";
import "select2/select2";

export default Control.extend({
    events: {
        "change input": function(e) {
            this.setValue(e.val, false);
        }
    },
    initialize: function() {
        Control.prototype.initialize.apply(this, arguments);
        if (this.options.modelAttribute === "log_level") {
            this.setValue("DEBUG", false);
        }
        this.options.placeholder = this.options.placeholder || "";
        this.placeholder = this.options.placeholder;
    },
    /**
     * @constructor
     * @param {Object} options {
     *     {String, required} modelAttribute The attribute on the model to observe and update on selection
     *     {Model, required} model The model to operate on
     *     {String, optional} placeholder The placeholder text for an empty input
     *     {Boolean, optional} allowClear Whether to allow clear select items, default is false
     *     {Array<String>, optional} autoCompleteFields A list of fields to use for auto-complete,
     *     {Array<String>, optional} unselectableFields A list of disabled fields
     *     {String, optional} inputClassName A class name to apply to the input element
     *     {Function, optional} tooltip A function to add tooltip on items based on rules
     */
    render: function() {
        if (this.$("input")) {
            this.$("input").select2("destroy");
        }
        this.$el.html(
            this.compiledTemplate({
                options: this.options
            })
        );
        var $input = this.$("input");
        if (this.options.unselectableFields) {
            _.each(
                this.options.autoCompleteFields,
                function(field) {
                    if (
                        _.find(this.options.unselectableFields, function(
                            unselectable
                        ) {
                            return (
                                unselectable.value === field.value &&
                                unselectable.label === field.label
                            );
                        })
                    ) {
                        field.disabled = true;
                    } else {
                        field.disabled = false;
                    }
                }.bind(this)
            );
        }
        var data = [];
        _.each(this.options.autoCompleteFields, function(field) {
            data.push({
                id: field.value,
                text: field.label,
                disabled: field.disabled
            });
        });
        var options = {
            placeholder: this.options.placeholder,
            data: data,
            formatNoMatches: function() {
                return "&nbsp;";
            },
            dropdownCssClass: "empty-results-allowed",
            // SPL-77050, this needs to be false for use inside popdowns/modals
            openOnEnter: false,
            multiple: false,
            combobox: true,
            allowClear: this.options.allowClear || false
        };
        if (this.options.disableSearch) {
            $.extend(options, {
                minimumResultsForSearch: Infinity
            });
        }
        if (_.isFunction(this.options.formatResult)) {
            options.formatResult = this.options.formatResult;
        }
        if (
            _.isFunction(this.options.formatNoMatches) ||
            _.isString(this.options.formatNoMatches)
        ) {
            options.formatNoMatches = this.options.formatNoMatches;
        }
        $input
            .select2(options)
            .select2("val", this._value == null ? null : this._value);
        if (this.options.disabled) {
            this.disable();
        }
        // add tooltip in case
        if (typeof this.options.tooltip === "function") {
            var tooltipFun = this.options.tooltip;
            $input.on("select2-open", function() {
                _.each($("li.select2-result"), function(ele) {
                    tooltipFun(ele);
                });
            });
        }
        return this;
    },
    setAutoCompleteFields: function(fields, render, unselectableFields) {
        render = render != null ? render : true;
        if (fields != null) {
            this.options.autoCompleteFields = fields;
        }
        // Peter: add unselectable fields support. This parameter can be null
        // when it is set, all matched item in autoCompleteFields will be disabled
        if (unselectableFields) {
            this.options.unselectableFields = unselectableFields;
        }
        if (render) {
            // enable and render
            this.enable(false);
            this.render();
        }
    },
    remove: function() {
        this.$("input").select2("close").select2("destroy");
        return Control.prototype.remove.apply(this, arguments);
    },
    validate: function() {
        return (
            this.getValue() != null &&
            this.$("input").select2("val").length > 0 &&
            this.getValue() === this.$("input").select2("val") &&
            !this.options.disabled
        );
    },
    disable: function() {
        this.options.disabled = true;
        this.$("input").prop("disabled", true);
    },
    startLoading: function() {
        this.options.placeholder = "Loading ...";
        this.disable();
        this.render();
    },
    enable: function(render) {
        if (this.options.placeholder !== this.placeholder) {
            this.options.placeholder = this.placeholder;
            if (render) {
                this.render();
            }
        }
        this.options.disabled = false;
        this.$("input").prop("disabled", false);
    },
    template: '<input type="hidden" class="<%= options.inputClassName %>" />'
});
