/**
 * Due Date.
 *
 * @author gabor.klausz
 */
var DueDate =
{
	date: {},

	init: function()
	{
		this.date = new Date();

		this.View.init();
	},

	View:
	{
		init: function()
		{
			this.setRenderForm();
			this.setRenderResultField();
			this.setDefaultValues();

			$('select').change(this.chanegDateEvent);

			$('input[type="submit"]').click(this.showResult);
		},

		setRenderForm: function()
		{
			$('#App').prepend('<form>');

			var formElement = $('form'),
				i;

			formElement.append('<h1>Due date</h1>')
				.append('<select name="year">')
				.append('<select name="month">')
				.append('<select name="day">')
				.append('<select name="hour">')
				.append('<select name="min">');

			for (i = DueDate.date.getFullYear(); i <= DueDate.date.getFullYear() + 4 ; ++i) {
				$('select[name="year"]').append('<option value="' + i + '">' + i + '</option>');
			}

			for (i = 1; i <= 12 ; ++i) {
				$('select[name="month"]').append('<option value="' + i + '">' + i + '</option>');
			}

			this.setDaysSelectorElement();

			for (i = 0; i <= 23 ; ++i) {
				$('select[name="hour"]').append('<option value="' + i + '">' + i + '</option>');
			}

			for (i = 0; i <= 59 ; ++i) {
				$('select[name="min"]').append('<option value="' + i + '">' + i + '</option>');
			}

			formElement.append('<br /><br />')
				.append('<label>Days: </label>')
				.append('<input type="number" name="day" value="0" /><br />')
				.append('<label>Hours: </label>')
				.append('<input type="number" name="hour" value="0" /><br />')
				.append('<label>Minutes: </label>')
				.append('<input type="number" name="minute" value="0" /><br />')
				.append('<input type="submit" name="" />');
		},

		setDaysSelectorElement: function(month, year)
		{
			var selectedMonth = DueDate.date.getMonth() + 1,
				selectedYear  = DueDate.date.getFullYear();

			if (typeof month !== 'undefined' && typeof year !== 'undefined') {
				selectedMonth = month;
				selectedYear  = year;

				$('select[name="day"] option').remove();
			}

			for (i = 1; i <= this.daysInMonth(selectedMonth, selectedYear) ; ++i) {
				$('select[name="day"]').append('<option value="' + i + '">' + i + '</option>');
			}
		},

		setRenderResultField: function()
		{
			$('#App').append('<div><h2>Calculated due date</h2><p></p></div>');
		},

		showResult: function(e)
		{
			e.preventDefault();

			var days     = parseInt($('input[name="day"]').val()) || 0,
				hours    = parseInt($('input[name="hour"]').val()) || 0,
				minute   = parseInt($('input[name="minute"]').val()) || 0,
				totelMin = (days !== 0 ? (days * 8) : 0) + (hours !== 0 ? hours : 0) + (minute !== 0 ? (minute / 60) : 0);

			$('p').html(
				totelMin > 0
					? DueDate.Logic.calculateDueDate(
					new Date(
						$('select[name="year"] option:selected').val(),
						$('select[name="month"] option:selected').val() - 1,
						$('select[name="day"] option:selected').val(),
						$('select[name="hour"] option:selected').val(),
						$('select[name="min"] option:selected').val()
					),
					totelMin)
					: 'DONE'
			);
		},

		setDefaultValues: function()
		{
			$('select[name="year"]').val(DueDate.date.getFullYear());
			$('select[name="month"]').val(DueDate.date.getMonth() + 1);
			$('select[name="day"]').val(DueDate.date.getDate());
			$('select[name="hour"]').val(DueDate.date.getHours());
			$('select[name="min"]').val(DueDate.date.getMinutes());

			this.setDiableSelectValues('month', DueDate.date.getMonth() + 1);
			this.setDiableSelectValues('day', DueDate.date.getDate());
			this.setDiableSelectValues('hour', DueDate.date.getHours());
			this.setDiableSelectValues('min', DueDate.date.getMinutes());
		},

		chanegDateEvent: function()
		{
			var selectedValue = $('select[name="day"] option:selected').val();
			DueDate.View.setDaysSelectorElement($('select[name="month"] option:selected').val(), DueDate.date.getFullYear());
			$('select[name="day"] option[value="' + selectedValue + '"]').attr('selected', 'selected');

			DueDate.View.setDiableSelectValues('month', DueDate.date.getMonth() + 1);
			DueDate.View.setDiableSelectValues('day', DueDate.date.getDate());
			DueDate.View.setDiableSelectValues('hour', DueDate.date.getHours());
			DueDate.View.setDiableSelectValues('min', DueDate.date.getMinutes());
		},

		setDiableSelectValues: function(type, selectedValue)
		{
			var currentDate,
				year = parseInt($('select[name="year"] option:selected').val());

			switch (type) {
				case 'month':
					currentDate = 1;

					if (year === DueDate.date.getFullYear()) {
						currentDate = DueDate.date.getMonth() + 1;
					}
					break;

				case 'day':
					currentDate = 1;

					if (
						year === DueDate.date.getFullYear() &&
						parseInt($('select[name="month"] option:selected').val()) === DueDate.date.getMonth() + 1
					) {
						currentDate = DueDate.date.getDate();
					}
					break;

				case 'hour':
					currentDate = 1;

					if (
						year === DueDate.date.getFullYear() &&
						parseInt($('select[name="month"] option:selected').val()) === DueDate.date.getMonth() +1  &&
						parseInt($('select[name="day"] option:selected').val()) === DueDate.date.getDate()
					) {
						currentDate = DueDate.date.getHours();
					}
					break;

				case 'min':
					currentDate = 0;

					if (
						year === DueDate.date.getFullYear() &&
						parseInt($('select[name="month"] option:selected').val()) === DueDate.date.getMonth() + 1 &&
						parseInt($('select[name="day"] option:selected').val()) === DueDate.date.getDate() &&
						parseInt($('select[name="hour"] option:selected').val()) === DueDate.date.getHours()
					) {
						currentDate = DueDate.date.getMinutes();
					}
					break;
			}

			if (currentDate === selectedValue) {
				$('select[name="' + type + '"] option').each(function(i, v){
					if (currentDate > $($('select[name="' + type + '"] option')[i]).val()) {
						$($('select[name="' + type + '"] option')[i]).attr('disabled', true);
					}
				});
			}
			else {
				$('select[name="' + type + '"] option').attr('disabled', false);
			}
		},

		daysInMonth: function(month, year)
		{
			return new Date(year, month, 0).getDate();
		}
	},

	Logic:
	{
		calculateDueDate: function(submitDate, turnAround)
		{
			var remainigHours   = turnAround,
				checkedDate     = new Date(submitDate),
				nonWorkingHours = 0;

			do {
				checkedDate.setTime(checkedDate.getTime() + 60 * 60 * 1000);

				if (
					(checkedDate.getDay() === 0) ||
					(checkedDate.getDay() === 6) ||
					(checkedDate.getHours() < 9) ||
					(checkedDate.getHours() >= 17)
				) {
					nonWorkingHours++;
				}
				else {
					remainigHours--;
				}
			}
			while (remainigHours > 0);

			return new Date(submitDate.getTime() + (turnAround + nonWorkingHours) * 60 * 60 * 1000);
		}
	}
};

DueDate.init();