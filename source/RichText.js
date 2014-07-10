(function (enyo, scope) {

	/**
	* _onyx.RichText_ is an Onyx-styled rich text control, derived from
	* {@link enyo.RichText}. Typically, an _onyx.RichText_ is placed
	* inside an {@link onyx.InputDecorator}, which provides styling,
	* e.g.:
	*
	* ```
	* {kind: 'onyx.InputDecorator', components: [
	* 	{kind: 'onyx.RichText', style: 'width: 100px;', onchange: 'inputChange'}
	* ]}
	* ```
	* 
	* For more information, see the documentation on [Text
	* Fields](building-apps/controls/text-fields.html) in the Enyo Developer Guide.
	*
	* @class  onyx.RichText
	* @extends enyo.RichText
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.RichText.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.RichText',

		/**
		* @private
		*/
		kind: 'enyo.RichText',

		/**
		* @private
		*/
		classes: 'onyx-richtext'
	});

})(enyo, this);