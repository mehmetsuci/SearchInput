define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/keys",
    "dojo/html",
    "dojo/dom-prop",
    "dojo/text!SearchInput/widget/template/SearchInput.html"
], function(declare, _WidgetBase, _TemplatedMixin, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoKeys, dojoHtml, domProp, widgetTemplate) {
    "use strict";

    return declare("SearchInput.widget.SearchInput", [_WidgetBase, _TemplatedMixin], {
        templateString: widgetTemplate,

        searchFormNode: null,
        searchSelectNode: null,
        searchInputNode: null,
        infoTextNode: null,

        targetAttribute: "",

        _handles: null,
        _contextObj: null,
        _alertDiv: null,
		_hadValidationFeedback: false,

        postCreate: function() {
            logger.debug(this.id + ".postCreate");
            this._updateRendering();
            this._setupEvents();

            if (this.placeholder) {
                domProp.set(this.searchInputNode, "placeholder", this.placeholder);
            }
        },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;

            if (this._contextObj) {
                this._resetSubscriptions();
                this._updateRendering(callback);
            } else {
                mendix.lang.nullExec(callback);
            }
        },

        _setupEvents: function() {
            logger.debug(this.id + "._setupEvents");
            this.connect(this.searchInputNode, "onkeydown", dojoLang.hitch(this, this.onKeyDown));
            this.connect(this.searchFormNode, "submit", dojoLang.hitch(this, this.onSubmit));
			this.connect(this.searchFormNode, "change", dojoLang.hitch(this, this.onChange));
            this.connect(this.searchSelectNode, "onclick", dojoLang.hitch(this, function(e) {
                this.executeMicroflow(this.mfToExecute);
            }));
        },

        _updateRendering: function(callback) {
            logger.debug(this.id + "._updateRendering");
            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");

                var targetAttributeValue = this._contextObj.get(this.targetAttribute);

                this.searchInputNode.value = targetAttributeValue;

            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            // Important to clear all validations!
            this._clearValidations();

            mendix.lang.nullExec(callback);
        },

        onSubmit: function (e) {
            e.preventDefault();
            return false;
        },

		onChange: function (e) {
			this._contextObj.set(this.targetAttribute, this.searchInputNode.value);
			if (this.mfToExecuteOnChange !== "") {
				this.executeMicroflow(this.mfToExecuteOnChange);
			}
		},

        onKeyDown: function(event) {
            if (event.keyCode === dojoKeys.ENTER) {
                this._contextObj.set(this.targetAttribute, this.searchInputNode.value);
                event.preventDefault();
                if (this.mfToExecute !== "") {
                    this.executeMicroflow(this.mfToExecute);
                }
            }
        },

        executeMicroflow: function(mf) {
            logger.debug(this.id + ".executeMicroFlow");
            if (mf && this._contextObj) {
                this._clearValidations();
		if(progress) {
                    var pid = mx.ui.showProgress(this.progressBarMessage, this.isModal);
                }
                this._contextObj.set(this.targetAttribute, this.searchInputNode.value);
                mx.data.action({
                    store: {
                        caller: this.mxform
                    },
                    params: {
                        actionname: mf,
                        applyto: "selection",
                        guids: [this._contextObj.getGuid()]
                    },
                    callback: function() {
			if(progress) {
                            mx.ui.hideProgress(pid);
                        }
                    },
                    error: dojoLang.hitch(this, function() {
                        logger.error(this.id + ".executeMicroFlow: XAS error executing microflow");
			mx.ui.hideProgress(pid);
                    })
                });
            }
        },

        _handleValidation: function(validations) {
            this._clearValidations();

            var validation = validations[0],
                message = validation.getReasonByAttribute(this.targetAttribute);

            if (this.readOnly) {
                validation.removeAttribute(this.targetAttribute);
            } else if (message) {
                this._addValidation(message);

				if(!this._hadValidationFeedback) {
					this._hadValidationFeedback = true;
					this._increaseValidationNotification();
				}
                validation.removeAttribute(this.targetAttribute);
            }
			if(this._hadValidationFeedback && !message) {
				this._decreaseValidationNotification();
				this._hadValidationFeedback = false;
			}
        },

        _clearValidations: function() {
            dojoConstruct.destroy(this._alertDiv);
            this._alertDiv = null;
        },

        _showError: function(message) {
            if (this._alertDiv !== null) {
                dojoHtml.set(this._alertDiv, message);
                return true;
            }
            this._alertDiv = dojoConstruct.create("div", {
                "class": "alert alert-danger",
                "innerHTML": message
            });
            dojoConstruct.place(this._alertDiv, this.domNode);
        },

        _addValidation: function(message) {
            this._showError(message);
        },

        _resetSubscriptions: function() {
            logger.debug(this.id + "._resetSubscriptions");
            // Release handles on previous object, if any.
            if (this._handles) {
                dojoArray.forEach(this._handles, function(handle) {
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

                this._handles = [objectHandle, attrHandle, validationHandle];
            }
        },
		_increaseValidationNotification : function() {
			//increase notifications in case the widget is inside tab
			//Warning: This is not documented in official API and might break when the API changes. 
			if (this.validator) {
				this.validator.addNotification();

			}
		},
		_decreaseValidationNotification : function() {
			//decrease notifications in case the widget is inside tab
			//Warning: This is not documented in official API and might break when the API changes. 
			if (this.validator) {
				this.validator.removeNotification();
			}
		}
    });
});

require(["SearchInput/widget/SearchInput"]);
