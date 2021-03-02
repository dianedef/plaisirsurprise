/*!
 * jQuery Countdown plugin v1.0
 * http://www.littlewebthings.com/projects/countdown/
 *
 * Copyright 2010, Vassilis Dourdounis
 * Copyright 2010, Marcello Barnaba <marcello.barnaba@gmail.com>
 * 
 */
(function($) {

	$.fn.countDown = function (options) {
		// Public methods invocation
		//
		if (typeof options == 'string') {
			return $(this).data('countDown')[options].apply(this) || this;
		}

		return this.each (function () {
			// Initialization
			//
			var element = $(this), targetTime = new Date(), timer;

			if (element.data ('countDown'))
				return; // Already initialized

			if (options.targetDate)
			{
				targetTime = new Date(
					options.targetDate.month + '/' + options.targetDate.day + '/' + options.targetDate.year + ' ' +
					options.targetDate.hour + ':' + options.targetDate.min + ':' + options.targetDate.sec +
					(options.targetDate.utc ? ' UTC' : '')
				);
			}
			else if (options.targetOffset)
			{
				targetTime.setFullYear(options.targetOffset.year + targetTime.getFullYear());
				targetTime.setMonth(options.targetOffset.month   + targetTime.getMonth());
				targetTime.setDate(options.targetOffset.day      + targetTime.getDate());
				targetTime.setHours(options.targetOffset.hour    + targetTime.getHours());
				targetTime.setMinutes(options.targetOffset.min   + targetTime.getMinutes());
				targetTime.setSeconds(options.targetOffset.sec   + targetTime.getSeconds());
			}

			element.find('.digit').html('<div class="top"></div><div class="bottom"></div>');

			// Public methods definition
			//
			element.data ('countDown', {
				stop: function () {
					if (timer == undefined)
						return;

					clearInterval(timer);
					timer = undefined
				},

				start: function () {
					if (timer != undefined)
						return;

					var diffSecs = Math.floor((+targetTime - +new Date())/1000);
					var duration = 500;

					if (diffSecs < 0)
						diffSecs = 0;

					var loop = function () {
						render(diffSecs, duration);
						diffSecs -= 1;
					}

					loop();
					if (diffSecs > 0)
						timer = setInterval (loop, 1000)
				}
			});

			// Private method to render the whole thing
			//
			function render (diffSecs, duration) {
				secs = diffSecs % 60;
				mins = Math.floor(diffSecs/60)%60;
				hours = Math.floor(diffSecs/60/60)%24;
				if (options.omitWeeks)
				{
					days = Math.floor(diffSecs/60/60/24);
					weeks = Math.floor(diffSecs/60/60/24/7);
				}
				else
				{
					days = Math.floor(diffSecs/60/60/24)%7;
					weeks = Math.floor(diffSecs/60/60/24/7);
				}

				dashChangeTo('.seconds_dash', secs,  duration);
				dashChangeTo('.minutes_dash', mins,  duration);
				dashChangeTo('.hours_dash',   hours, duration);
				dashChangeTo('.days_dash',    days,  duration);
				dashChangeTo('.weeks_dash',   weeks, duration);

				if (diffSecs <= 0)
					complete();
			}

			// Privat method invoked by render() when the countdown is over
			//
			function complete() {
				element.data('countDown').stop ();

				if (options.onComplete)
					options.onComplete.apply(element);

				return true;
			}

			// Private method to update a single digit couple
			//
			function dashChangeTo (selector, n, duration) {
				element.find (selector + ' .digit').each (function (i) {
					// The first digit is i=0, the second i=1
					digitChangeTo($(this), i == 0 ? Math.floor(n/10) : n%10, duration);
				})
			};

			// Private method to update a single digit
			//
			function digitChangeTo (digit, n, duration) {
				var top = digit.find('.top'),
						bot = digit.find('.bottom');

				if (top.html() != n + '')
				{
					top.html(n || '0').slideDown(duration);

					bot.animate({height: 0}, duration, function() {
						bot.html(n || '0').css({height: '100%'});
						top.hide();
					});
				}
			};

			element.data('countDown').start();
		});
	};

})(jQuery);