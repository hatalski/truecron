import Ember from 'ember';
import OccurenceDate from 'true-cron/occurrence-date/model';

export default Ember.Mixin.create({
  weekdays: [{
      name:"Monday",
      value: RRule.MO,
      selected: false
    },
    {
      name:"Tuesday",
      value: RRule.TU,
      selected: false
    },
    {
      name:"Wednesday",
      value: RRule.WE,
      selected: false
    },
    {
      name:"Thursday",
      value: RRule.TH,
      selected: false
    },
    {
      name:"Friday",
      value: RRule.FR,
      selected: false
    },
    {
      name:"Saturday",
      value: RRule.SA,
      selected: false
    },
    {
      name:"Sunday",
      value: RRule.SU,
      selected: false
    }],
  rruleText: '',
  months: moment.months(),
  currentDate: moment().format('YYYY-MM-DD'),
  currentTime: moment().format('HH:mm'),
  currentZone: moment.tz(),
  endsOn: 'never',
  endsOnDate: moment().format('YYYY-MM-DD'),
  endsAfter: 1,
  dtStart: function()
  {
    var returnDate = moment(this.get('currentDate') + ' ' + (this.get('currentTime')?this.get('currentTime'):''));
    var timezone = this.get('currentZone');
    if(timezone.name)
    {
      returnDate = returnDate.tz(timezone.name);
    }
    return returnDate.toDate();
  }.property('currentDate', 'currentTime', 'currentZone'),
  rrule: function(sender){
    if(sender && !sender.model)
    {
      return;
    }

    var self = this;

    var weekDays = this.get('weekdays').filterBy('selected', true).mapBy('value');
    var rruleOptions = {
      freq: self.get('repeatRules').indexOf(self.get('selectedRepeatRule')),
      interval: self.get('selectedRepeatEvery'),
      byweekday: weekDays,
      dtstart: self.get('dtStart')
    };

    if(this.get("endsOn") === 'on')
    {
      rruleOptions.until = moment(this.get('endsOnDate')).toDate();
    }
    else if(this.get("endsOn") === 'after')
    {
      rruleOptions.count = this.get('endsAfter');
    }

    var recRule = new RRule(
      rruleOptions
    );
    this.set('rruleText', recRule.toText());

    self.occurrenceDates.clear();

    recRule.all(function (date, i){return i < 10;}).forEach(function(o, i)
    {
      var occurence = OccurenceDate.create({occDateText:o});
      occurence.number = i + 1;
      self.occurrenceDates.addObject(occurence);
    });
    self.updateExDate();
    return recRule.toString();
  }.observes('selectedRepeatRule', 'weekdays.@each.selected', 'currentDate', 'currentTime', 'endsOn', 'endsAfter', 'endsOnDate', 'selectedRepeatEvery').on('init'),
  updateExDate: function()
  {
    var self = this;
    var ranges = [];
    for(var i=0; i< self.exDates.length; i++)
    {
      var o = self.exDates[i];
      ranges.push(moment().range(o.fromDate, (o.toDate == null ? o.fromDate : o.toDate)));
    }

    self.occurrenceDates.forEach(function(o) {
      for(var i=0; i<ranges.length; i++)
      {
        o.set('excluded', ranges[i].contains(o.occDate));
        if(o.get('excluded'))
        {
          break;
        }
      }
    });

  }.observes('exDates.@each'),
  exDates: Ember.A([]),
  occurrenceDates: Ember.A([]),
  selectedRepeatRule: 'Daily',
  repeatRules: ['Yearly', 'Monthly', 'Weekly', 'Daily', 'Hourly', 'Minutely'],
  selectedRepeatEvery: 1,
  repeatEvery: function() {
    switch (this.get('selectedRepeatRule')) {
      case 'Minutely':
        return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60];
      case 'Hourly':
        return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
      default:
        return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
    }
  }.property('selectedRepeatRule'),
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
  // timezone is optional
  recurrenceRuleToText: function(rrule, timezone) {
    "use strict";
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

    var text = everyText + monthsText + daysText + startsOnText + untilText + countText;
    //Ember.$.each(rules, function(index, rule) {
    //  switch(rule) {
    //    //case 'FREQ':
    //    //  break;
    //    //case 'DTSTART':
    //    //  break;
    //    //case 'UNTIL':
    //    //  break;
    //    //case 'COUNT':
    //    //  break;
    //    //case 'INTERVAL':
    //    //  break;
    //    //case 'WKST':
    //    //  break;
    //    //case 'BYDAY':
    //    //  break;
    //    //case 'BYMONTH':
    //    //  break;
    //    case 'BYSETPOS':
    //      break;
    //    case 'BYMONTHDAY':
    //      break;
    //    case 'BYYEARDAY':
    //      break;
    //    case 'BYWEEKNO':
    //      break;
    //    case 'BYHOUR':
    //      break;
    //    case 'BYMINUTE':
    //      break;
    //    case 'BYSECOND':
    //      break;
    //    case 'BYEASTER':
    //      break;
    //  }
    //});

    return text;
  }
});
