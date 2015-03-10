import Ember from 'ember';

export default Ember.Mixin.create({
  getDayName: function(day) {
    "use strict";
    switch(day)
    {
      case "MO":
        return "Monday";
      case "TU":
        return "Tuesday";
      case "WE":
        return "Wednesday";
      case "TH":
        return "Thursday";
      case "FR":
        return "Friday";
      case "SA":
        return "Saturday";
      case "SU":
        return "Sunday";
      default:
        return "";
    }
  },
  getMonthName: function(monthNumber) {
    "use strict";
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1];
  },
  getFrequencyText: function(freq) {
    "use strict";
    switch(freq) {
      case 'SECONDLY':
        return 'second';
      case 'MINUTELY':
        return 'minute';
      case 'HOURLY':
        return 'hour';
      case 'DAILY':
        return 'day';
      case 'WEEKLY':
        return 'week';
      case 'MONTHLY':
        return 'month';
      case 'YEARLY':
        return 'year';
    }
  },
  recurrenceRuleToText: function(rrule) {
    "use strict";
    var text = '';

    var everyTemplate = "Every %@";

    var rules = rrule.split(';');
    var rRules = [];
    var length = rules.length;
    for (var i = 0; i < length; i++) {
      var options = rules[i].split('=');
      var ruleName = options[0];
      var ruleValue = options[1];
      rRules[ruleName] = ruleValue;
    }

    var interval = rRules['INTERVAL'];
    var freqText = this.getFrequencyText(rRules['FREQ']);
    var everyText = everyTemplate.fmt(
      (interval && interval !== '1') ?
      interval + ' ' + freqText + 's' :
      freqText);

    var daysText = '';
    if(rRules['BYDAY']) {
      var byDayTemplate = ' on %@';
      var daysArray = rRules['BYDAY'].split(',');
      var daysArrayLength = daysArray.length;
      for (var d = 0; d < daysArrayLength; d++) {
        daysText += this.getDayName(daysArray[d]) + ((daysArrayLength - d !== 1) ? ', ' : '');
      }
      daysText = byDayTemplate.fmt(daysText);
    }

    var monthsText = '';
    if(rRules['BYMONTH']) {
      var byMonthTemplate = ' in %@';
      var monthsArray = rRules['BYMONTH'].split(',');
      var monthsArrayLength = monthsArray.length;
      for (var m = 0; m < monthsArrayLength; m++) {
        var last = monthsArrayLength - m === 1;
        var beforeLast = monthsArrayLength - m === 2;
        var separator = last ? '' : beforeLast ? ' and ' : ', ';
        monthsText += this.getMonthName(monthsArray[m]) + separator;
      }
      monthsText = byMonthTemplate.fmt(monthsText);
    }

    var startsOnText = '';
    if (rRules['DTSTART']) {
      var startsOnTemplate = ' starting on %@';
      var startsOnDate = moment(rRules['DTSTART'], 'YYYYMMDDHHmmssZ');
      startsOnText = startsOnTemplate.fmt(
        startsOnDate.format('MMMM Do YYYY [at] hh:mm:ss A Z')
      );
    }

    var untilText = '';
    if (rRules['UNTIL']) {
      var untilTemplate = ' until %@';
      var untilDate = moment(rRules['UNTIL'], 'YYYYMMDDHHmmssZ');
      untilText = untilTemplate.fmt(
        untilDate.format('MMMM Do YYYY hh:mm:ss A Z')
      );
    }

    var countText = '';
    if (rRules['COUNT'] && !rRules['UNTIL']) {
      var countTemplate = ' for %@ times';
      countText = countTemplate.fmt(rRules['COUNT']);
    }

    text = everyText + monthsText + daysText + startsOnText + untilText + countText;
    Ember.$.each(rules, function(index, rule) {
      switch(rule) {
        //case 'FREQ':
        //  break;
        //case 'DTSTART':
        //  break;
        //case 'UNTIL':
        //  break;
        //case 'COUNT':
        //  break;
        //case 'INTERVAL':
        //  break;
        //case 'WKST':
        //  break;
        //case 'BYDAY':
        //  break;
        //case 'BYMONTH':
        //  break;
        case 'BYSETPOS':
          break;
        case 'BYMONTHDAY':
          break;
        case 'BYYEARDAY':
          break;
        case 'BYWEEKNO':
          break;
        case 'BYHOUR':
          break;
        case 'BYMINUTE':
          break;
        case 'BYSECOND':
          break;
        case 'BYEASTER':
          break;
      }
    });

    return text;
  }
});
