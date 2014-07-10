﻿(function (enyo, scope) {

	/**
	* _onyx.Scrim_ provides an overlay that will prevent taps from propagating to
	* the controls that it covers.  A scrim may be 'floating' or 'non-floating'. A
	* floating scrim will fill the entire viewport, while a non-floating scrim
	* will be constrained by the dimensions of its container.
	*
	* The scrim should have a CSS class of `onyx-scrim-transparent`,
	* `onyx-scrim-translucent`, or any other class that has
	* `pointer-events: auto` in its style properties.
	* 
	* You may specify the `z-index` at which you want the scrim to appear by calling
	* {@link onyx.Scrim#showAtZIndex}. If you do so, you must call {@link onyx.Scrim#hideAtZIndex} 
	* with the same value to hide the scrim.
	*
	* @class  onyx.Scrim
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.Scrim.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.Scrim',

		/** 
		* Current visibility state of scrim
		* @type {Boolean}
		* @private
		*/
		showing: false,

		/**
		* @private
		*/
		classes: 'onyx-scrim enyo-fit',
		
		/**
		* If true, the scrim is rendered in a floating layer outside of other
		* controls. This can be used to guarantee that the scrim will be shown
		* on top of other controls.
		* 
		* @type {Boolean}
		* @default  false
		* @public
		*/
		floating: false,

		/**
		* @private
		*/
		create: function() {
			this.inherited(arguments);
			this.zStack = [];
			if (this.floating) {
				this.setParent(enyo.floatingLayer);
			}
		},

		/**
		* @private
		*/
		showingChanged: function() {
			// auto render when shown.
			if (this.floating && this.showing && !this.hasNode()) {
				this.render();
			}
			this.inherited(arguments);
			//this.addRemoveClass(this.showingClassName, this.showing);
		},

		/**
		* @private
		*/
		addZIndex: function(inZIndex) {
			if (enyo.indexOf(inZIndex, this.zStack) < 0) {
				this.zStack.push(inZIndex);
			}
		},

		/**
		* @private
		*/
		removeZIndex: function(inControl) {
			enyo.remove(inControl, this.zStack);
		},

		/**
		* Shows scrim at the specified z-index. Note that if you call
		* _showAtZIndex()_, you must call _hideAtZIndex()_ to properly unwind the
		* z-index stack.
		* 
		* @param  {Number} inZIndex - z-index for the scrim
		* @public
		*/
		showAtZIndex: function(inZIndex) {
			this.addZIndex(inZIndex);
			if (inZIndex !== undefined) {
				this.setZIndex(inZIndex);
			}
			this.show();
		},

		/**
		* Hides scrim at the specified z-index.
		* 
		* @param  {Number} inZIndex - z-index of the scrim
		* @public
		*/
		hideAtZIndex: function(inZIndex) {
			this.removeZIndex(inZIndex);
			if (!this.zStack.length) {
				this.hide();
			} else {
				var z = this.zStack[this.zStack.length-1];
				this.setZIndex(z);
			}
		},

		/**
		* @private
		*/
		setZIndex: function(inZIndex) {
			this.zIndex = inZIndex;
			this.applyStyle('z-index', inZIndex);
		},

		/**
		* @private
		*/
		make: function() {
			return this;
		}
	});

	/**
	* Scrim singleton exposing a subset of Scrim API;
	* is replaced with a proper enyo.Scrim instance.
	*
	* @class  onyx.scrimSingleton
	* @private
	*/
	enyo.kind(
		/** @lends  onyx.scrimSingleton.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.scrimSingleton',

		/**
		* @private
		*/
		kind: null,

		/**
		* @private
		*/
		constructor: function(inName, inProps) {
			this.instanceName = inName;
			enyo.setPath(this.instanceName, this);
			this.props = inProps || {};
		},

		/**
		* @private
		*/
		make: function() {
			var s = new onyx.Scrim(this.props);
			enyo.setPath(this.instanceName, s);
			return s;
		},

		/**
		* @private
		*/
		showAtZIndex: function(inZIndex) {
			var s = this.make();
			s.showAtZIndex(inZIndex);
		},

		/**
		* In case somebody does this out of order
		* 
		* @private
		*/
		hideAtZIndex: enyo.nop,

		/**
		* @private
		*/
		show: function() {
			var s = this.make();
			s.show();
		}
	});

	new onyx.scrimSingleton('onyx.scrim', {floating: true, classes: 'onyx-scrim-translucent'});
	new onyx.scrimSingleton('onyx.scrimTransparent', {floating: true, classes: 'onyx-scrim-transparent'});

})(enyo, this);
