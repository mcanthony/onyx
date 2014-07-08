(function (enyo, scope) {

	/**
	* One of the DatePicker's fields is selected.
	*
	* @event onyx.DatePicker#event:onSelect
	* @type {Object}
	* @property {String} name - name of the DatePicker that generated the event.
	* @property {Date} value current Date value of the control
	* @public
	*/

	/**
	* _onyx.DatePicker_ is a group of [onyx.Picker]{@link onyx.Picker} controls used for
	* displaying a date. The user may change the _day_, _month_, and _year_ values.
	*
	* By default, _DatePicker_ tries to determine the current locale and use that
	* locale's rules to format the date (including the month name). In order to do
	* this successfully, the _iLib_ library must be loaded; if it is not loaded, the
	* control defaults to using standard U.S. date formatting.
	*
	* The _day_ field is automatically populated with the proper number of days for
	* the selected month and year.
	*
	* @class  onyx.DatePicker
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends  onyx.DatePicker.prototype */ {

		/**
		* @private
		*/
		name: 'onyx.DatePicker',

		/**
		* @private
		*/
		classes: 'onyx-toolbar-inline',

		/**
		* @private
		*/
		published: {
			/**
			* If true, control is shown as disabled and user cannot select new values
			* @type {Boolean}
			* @default  false
			* @memberOf  onyx.DatePicker.prototype
			* @public
			*/
			disabled: false,

			/**
			* Current locale used for formatting; may be set after control creation, in
			* which case the control will be updated to reflect the new value
			* @type {String}
			* @default  en-US
			* @memberOf onyx.DatePicker.prototype
			* @public
			*/
			locale: 'en-US',

			/**
			* If true, the day field is hidden
			* @type {Boolean}
			* @default  false
			* @memberOf onyx.DatePicker.prototype
			* @public
			*/
			dayHidden: false,

			/**
			* If true, the month field is hidden
			* @type {Boolean}
			* @default false
			* @memberOf onyx.DatePicker.prototype
			* @public
			*/
			monthHidden: false,

			/**
			* If true, the year field is hidden
			* @type {Boolean}
			* @default false
			* @memberOf onyx.DatePicker.prototype
			* @public
			*/
			yearHidden: false,

			/**
			* Optional minimum year value
			* @type {Number}
			* @default  1900
			* @memberOf onyx.DatePicker.prototype
			* @public
			*/
			minYear: 1900,

			/**
			* Optional maximum year value
			* @type {Number}
			* @default  2009
			* @memberOf onyx.DatePicker.prototype
			* @public
			*/
			maxYear: 2099,

			/**
			* Date object representing currently selected date. When a Date object is
			* passed to _setValue()_, the passed-in object is stored here and the
			* control is updated to reflect the new date.
			* @type {Date}
			* @default  null
			* @memberOf onyx.DatePicker.prototype
			* @public
			*/
			value: null
		},

		/**
		* @private
		*/
		events: {
			onSelect: ''
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			if (ilib) {
				this.locale = ilib.getLocale();
			}
			this.initDefaults();
		},

		/**
		* Performs initial setup of the picker including creating the necessary child controls
		* @private
		*/
		initDefaults: function () {
			var months;
			//Attempt to use the ilib library if it is loaded
			if (ilib) {
				months = [];
				this._tf = new ilib.DateFmt({locale:this.locale, timezone: 'local'});
				months = this._tf.getMonthsOfYear({length: 'long'});
			}
			// Fall back to en_US as default
			else {
				months = [undefined, 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
				this.localeInfo.getMonthsOfYear = function () {
					return months;
				};
			}

			// use iLib's getTemplate as that returns locale-specific ordering
			this.setupPickers(this._tf ? this._tf.getTemplate() : 'mdy');

			this.dayHiddenChanged();
			this.monthHiddenChanged();
			this.yearHiddenChanged();

			//Fill month, year & day pickers with values
			var d = this.value = this.value || new Date();
			for (var i=0,m; (m=months[i + 1]); i++) {
				this.$.monthPicker.createComponent({content: m, value:i, active: i==d.getMonth()});
			}

			var y = d.getFullYear();
			this.$.yearPicker.setSelected(y-this.minYear);

			for (i=1; i<=this.monthLength(d.getYear(), d.getMonth()); i++) {
				this.$.dayPicker.createComponent({content:i, value:i, active: i==d.getDate()});
			}
		},

		/**
		* Determine the number of days in a particular month/year
		* @param  {Number} inYear
		* @param  {Number} inMonth
		* @return {Number} Number of days in the month/year
		* @private
		*/
		monthLength: function (inYear, inMonth) {
			// determine number of days in a particular month/year
			return 32 - new Date(inYear, inMonth, 32).getDate();
		},

		/**
		* Handler for year enyo.FlyweightPicker#onSetupItem
		* @private
		*/
		setupYear: function (inSender, inEvent) {
			this.$.year.setContent(this.minYear+inEvent.index);
			return true;
		},

		/**
		* Builds the picker components
		* @param  {String} ordering Representation of the picker order. Year, month, and day are
		* 	represented as y, m, and d, respectively. For example, if `ordering` were `'ymd'`, the
		* 	pickers would be created in that order: Year, Month, Day.
		* @private
		*/
		setupPickers: function (ordering) {
			var orderingArr = ordering.split('');
			var o,f,l;
			var createdYear = false, createdMonth = false, createdDay = false;
			for(f = 0, l = orderingArr.length; f < l; f++) {
				o = orderingArr[f];
				switch (o.toLowerCase()){
				case 'd':
					if (!createdDay) {
						this.createDay();
						createdDay = true;
					}
					break;
				case 'm':
					if (!createdMonth) {
						this.createMonth();
						createdMonth = true;
					}
					break;
				case 'y':
					if (!createdYear) {
						this.createYear();
						createdYear = true;
					}
					break;
				default:
					break;
				}
			}
		},

		/**
		* Creates the year picker
		* @private
		*/
		createYear: function () {
			var yearCount = this.maxYear - this.minYear;
			this.createComponent(
				{kind: 'onyx.PickerDecorator', onSelect: 'updateYear', components: [
					{classes: 'onyx-datepicker-year', name: 'yearPickerButton',  disabled: this.disabled},
					{name: 'yearPicker', kind: 'onyx.FlyweightPicker', count: ++yearCount, onSetupItem: 'setupYear', components: [
						{name: 'year'}
					]}
				]}
			);
		},

		/**
		* Creates the month picker
		* @private
		*/
		createMonth: function () {
			this.createComponent(
				{kind: 'onyx.PickerDecorator', onSelect: 'updateMonth', components: [
					{classes: 'onyx-datepicker-month', name: 'monthPickerButton',  disabled: this.disabled},
					{name: 'monthPicker', kind: 'onyx.Picker'}
				]}
			);
		},

		/**
		* Creates the day picker
		* @private
		*/
		createDay: function () {
			this.createComponent(
				{kind: 'onyx.PickerDecorator', onSelect: 'updateDay', components: [
					{classes: 'onyx-datepicker-day', name: 'dayPickerButton',  disabled: this.disabled},
					{name: 'dayPicker', kind: 'onyx.Picker'}
				]}
			);
		},

		/**
		* @private
		*/
		localeChanged: function () {
			this.refresh();
		},

		/**
		* @private
		*/
		dayHiddenChanged: function () {
			this.$.dayPicker.getParent().setShowing(this.dayHidden ? false : true);
		},

		/**
		* @private
		*/
		monthHiddenChanged: function () {
			this.$.monthPicker.getParent().setShowing(this.monthHidden ? false : true);
		},

		/**
		* @private
		*/
		yearHiddenChanged: function () {
			this.$.yearPicker.getParent().setShowing(this.yearHidden ? false : true);
		},

		/**
		* @private
		*/
		minYearChanged: function () {
			this.refresh();
		},

		/**
		* @private
		*/
		maxYearChanged: function () {
			this.refresh();
		},

		/**
		* @private
		*/
		valueChanged: function (){
			this.refresh();
		},

		/**
		* @private
		*/
		disabledChanged: function () {
			this.$.yearPickerButton.setDisabled(this.disabled);
			this.$.monthPickerButton.setDisabled(this.disabled);
			this.$.dayPickerButton.setDisabled(this.disabled);
		},

		/**
		* Handler for the day pickers onSelect event
		*
		* @fires onyx.DatePicker#event:onSelect
		* @private
		*/
		updateDay: function (inSender, inEvent){
			var date = this.calcDate(this.value.getFullYear(),
									this.value.getMonth(),
									inEvent.selected.value);
			this.doSelect({name:this.name, value:date});
			this.setValue(date);
			return true;
		},

		/**
		* Handler for the month pickers onSelect event
		* 
		* @fires onyx.DatePicker#event:onSelect
		* @private
		*/
		updateMonth: function (inSender, inEvent){
			var date = this.calcDate(this.value.getFullYear(),
									inEvent.selected.value,
									this.value.getDate());
			this.doSelect({name:this.name, value:date});
			this.setValue(date);
			return true;
		},

		/**
		* Handler for the year pickers onSelect event
		*
		* @fires onyx.DatePicker#event:onSelect
		* @private
		*/
		updateYear: function (inSender, inEvent){
			//if the node wasn't found (issue around FlyWeightRepeater/Picker) don't update the picker
			if (inEvent.originator.selected != -1) {
				var date = this.calcDate(this.minYear + inEvent.originator.selected,
										this.value.getMonth(),
										this.value.getDate());
				this.doSelect({name:this.name, value:date});
				this.setValue(date);
			}
			return true;
		},

		/**
		* Creates a {@link external:Date} for the given `year`, `month`, and `date`. The time component
		* is pulled from the current {@link value}.
		* 
		* @param  {Number} year
		* @param  {Number} month
		* @param  {Number} day
		* @return {Date}
		* @private
		*/
		calcDate: function (year, month, day){
			return new Date(year,month,day,
							this.value.getHours(),
							this.value.getMinutes(),
							this.value.getSeconds(),
							this.value.getMilliseconds());
		},

		/**
		* Refreshes the pickers by destroying and rebuilding the components
		* @public
		*/
		refresh: function (){
			this.destroyClientControls();
			this.initDefaults();
			this.render();
		}
	});
})(enyo, this);
