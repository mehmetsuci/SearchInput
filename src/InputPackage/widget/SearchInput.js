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
	"dojo/text!SearchInput/widget/template/SearchInput.html"
], function(declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoKeys, dojoHtml, widgetTemplate) {
	"use strict";

	return declare("SearchInput.widget.SearchInput", [_WidgetBase, _TemplatedMixin], {
		templateString: widgetTemplate,

		searchSelectNode: null,
		searchInputNode: null,
		infoTextNode: null,

		targetAttribute: "",

		_handles: null,
		_contextObj: null,
		_alertDiv: null,

		postCreate: function() {

			this._updateRendering();
			this._setupEvents();

			if (this.placeholder) {
				domProp.set(this.searchInputNode, "placeholder", this.placeholder);
			}
		},

		update: function(obj, callback) {

			this._contextObj = obj;

			if (this._contextObj) {
				this._resetSubscriptions();
				this._updateRendering(callback);
			}
			else {
				// Try to execute as function, otherwise fail silently
				mendix.lang.nullExec(callback);
			}
		},

		_setupEvents: function() {

			this.connect(this.searchInputNode, "onkeydown", dojoLang.hitch(this, this.onKeyUp));
			this.connect(this.searchSelectNode, "onclick", dojoLang.hitch(this, function(e) {
				this.executeMicroflow(this.mfToExecute);
			}));

		},

		_updateRendering: function(callback) {
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

		onKeyUp: function(event) {
			this._contextObj.set(this.targetAttribute, this.searchInputNode.value);
			if (event.keyCode == dojoKeys.ENTER) {
				event.preventDefault();
				if (this.mfToExecute !== "") {
					this.executeMicroflow(this.mfToExecute);
				}
			}
		},


		executeMicroflow: function(mf) {
			if (mf && this._contextObj) {

				mx.data.action({
					store: {
						caller: this.mxform
					},
					params: {
						actionname: mf,
						applyto: "selection",
						guids: [this._contextObj.getGuid()],

					},
					callback: function() {
					},
					error: dojoLang.hitch(this, function() {
						logger.error(this.id + ".executeMicroFlow: XAS error executing microflow");
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
				validation.removeAttribute(this.targetAttribute);
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
			dojoConstruct.place(this.domNode, this._alertDiv);
		},

		_addValidation: function(message) {
			this._showError(message);
		},

		_resetSubscriptions: function() {
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
		}
	});
});

require(["InputPackage/widget/SearchInput"], function() {
	"use strict";
});
