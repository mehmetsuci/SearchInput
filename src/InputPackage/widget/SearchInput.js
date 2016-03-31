/*
    SearchInput
    ========================

    @file      : SearchInput.js
    @version   : 1.0.0
    @author    : Roeland Salij
    @date      : 3/31/2016
    @copyright : Mendix 2016
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/keys",
    "dojo/html",
    "dojo/text!InputPackage/widget/template/SearchInput.html"
], function(declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoKeys, dojoHtml, widgetTemplate) {
    "use strict";

    // Declare widget's prototype.
    return declare("InputPackage.widget.SearchInput", [ _WidgetBase, _TemplatedMixin ], {
        templateString: widgetTemplate,

        // DOM elements
        searchSelectNode: null,
        searchInputNode: null,
        infoTextNode: null,

        // Parameters configured in the Modeler.
        targetAttribute: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _alertDiv: null,

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function() {
            
            this._updateRendering();
            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function(obj, callback) {

            this._contextObj = obj;
            
            if (this._contextObj) {
                this._resetSubscriptions();
                this._updateRendering(callback);
            }
            else{
                mendix.lang.nullExec(callback);
            }
        },

         // Attach events to HTML dom elements
        _setupEvents: function() {
            
            this.connect(this.searchInputNode, "onkeydown", dojoLang.hitch(this, this.onKeyUp));
            this.connect(this.searchSelectNode, "onclick", dojoLang.hitch(this, function(e) {
                this.executeMicroflow(this.mfToExecute);
            }));
            
        },

        // Rerender the interface.
        _updateRendering: function(callback) {
 
            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");

                var targetAttrivuteValue = this._contextObj.get(this.targetAttribute);

                this.searchInputNode.value = targetAttrivuteValue;

            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            // Important to clear all validations!
            this._clearValidations();
            
            mendix.lang.nullExec(callback);
        },

        onKeyUp: function(event) {
                this._contextObj.set(this.targetAttribute, this.searchInputNode.value);
                if (event.keyCode == dojoKeys.ENTER) {
                    event.preventDefault();
                    if (this.mfToExecute !== "") {  
                        this.executeMicroflow(this.mfToExecute);
                }
            }
        },


        executeMicroflow : function (mf) {
            if (mf && this._contextObj) {
               
                mx.data.action({
                    store: {
                       caller: this.mxform 
                    },
                    params: {
                        actionname  : mf,
                        applyto     : "selection",
                        guids       : [this._contextObj.getGuid()],
                        
                    },
                    callback: function () {                       
                    },
                    error: dojoLang.hitch(this, function () {
                        logger.error(this.id + ".executeMicroFlow: XAS error executing microflow");
                    })
                });
            }
        },

        // Handle validations.
        _handleValidation: function(validations) {
            this._clearValidations();

            var validation = validations[0],
                message = validation.getReasonByAttribute(this.targetAttribute);

            if (this.readOnly) {
                validation.removeAttribute(this.targetAttribute);
            } else if (message) {
                this._addValidation(message);
                validation.removeAttribute(this.targetAttribute);
            }
        },

        // Clear validations.
        _clearValidations: function() {
            dojoConstruct.destroy(this._alertDiv);
            this._alertDiv = null;
        },

        // Show an error message.
        _showError: function(message) {
            if (this._alertDiv !== null) {
                dojoHtml.set(this._alertDiv, message);
                return true;
            }
            this._alertDiv = dojoConstruct.create("div", {
                "class": "alert alert-danger",
                "innerHTML": message
            });
            dojoConstruct.place(this.domNode, this._alertDiv);
        },

        // Add a validation.
        _addValidation: function(message) {
            this._showError(message);
        },

        // Reset subscriptions.
        _resetSubscriptions: function() {
            // Release handles on previous object, if any.
            if (this._handles) {
                dojoArray.forEach(this._handles, function (handle) {
                    mx.data.unsubscribe(handle);
                });
                this._handles = [];
            }

            // When a mendix object exists create subscribtions. 
            if (this._contextObj) {
                var objectHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: dojoLang.hitch(this, function(guid) {
                        this._updateRendering();
                    })
                });

                var attrHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    attr: this.backgroundColor,
                    callback: dojoLang.hitch(this, function(guid, attr, attrValue) {
                        this._updateRendering();
                    })
                });

                var validationHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    val: true,
                    callback: dojoLang.hitch(this, this._handleValidation)
                });

                this._handles = [ objectHandle, attrHandle, validationHandle ];
            }
        }
    });
});

require(["InputPackage/widget/SearchInput"], function() {
    "use strict";
});
