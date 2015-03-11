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
  // timezone is optional
  recurrenceRuleToText: function(rrule, timezone) {
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

    var setPosText = '';
    if (rRules['BYSETPOS']) {
      var setPosArray = rRules['BYSETPOS'].split(',');
      var setPosArrayLength = setPosArray.length;
      for (var s = 0; s < setPosArrayLength; s++) {
        if (setPosArray[s] === '1') {
          setPosText += '1st';
        } else if (setPosArray[s] === '2') {
          setPosText += '2nd';
        } else if (setPosArray[s] === '3') {
          setPosText += '3rd';
        } else {
          setPosText += setPosArray[s] + 'th';
        }
        var lastSetPos = setPosArrayLength - s === 1;
        var beforeLastSetPos = setPosArrayLength - s === 2;
        var sep = lastSetPos ? ' ' : beforeLastSetPos ? ' and ' : ', ';
        setPosText += sep;
      }
    }

    var daysText = '';
    if(rRules['BYDAY']) {
      var byDayTemplate = ' on %@%@';
      var daysArray = rRules['BYDAY'].split(',');
      var daysArrayLength = daysArray.length;
      for (var d = 0; d < daysArrayLength; d++) {
        daysText += this.getDayName(daysArray[d]) + ((daysArrayLength - d !== 1) ? ', ' : '');
      }
      daysText = byDayTemplate.fmt(setPosText, daysText);
    }

    var monthsText = '';
    if(rRules['BYMONTH']) {
      var byMonthTemplate = ' in %@';
      if (freqText === 'month') {
        byMonthTemplate = '%@';
        everyText = 'Every ';
      }
      var monthsArray = rRules['BYMONTH'].split(',');
      var monthsArrayLength = monthsArray.length;
      for (var m = 0; m < monthsArrayLength; m++) {
        var last = monthsArrayLength - m === 1;
        var beforeLast = monthsArrayLength - m === 2;
        var separator = last ? '' : beforeLast ? ' and ' : ', ';
        monthsText += moment.months()[monthsArray[m]-1] + separator;
      }
      monthsText = byMonthTemplate.fmt(monthsText);
    }

    var startsOnText = '';
    if (rRules['DTSTART']) {
      var startsOnTemplate = ' starting on %@';
      var startsOnDate = timezone ?
        moment(rRules['DTSTART'], 'YYYYMMDDHHmmssZ').zone(timezone) :
        moment(rRules['DTSTART'], 'YYYYMMDDHHmmssZ');
      startsOnText = startsOnTemplate.fmt(
        startsOnDate.format('MMMM Do YYYY [at] hh:mm:ss A Z')
      );
    }

    var untilText = '';
    if (rRules['UNTIL']) {
      var untilTemplate = ' until %@';
      var untilDate = timezone ?
        moment(rRules['UNTIL'], 'YYYYMMDDHHmmssZ').zone(timezone) :
        moment(rRules['UNTIL'], 'YYYYMMDDHHmmssZ');
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
