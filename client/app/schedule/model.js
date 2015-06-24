import Ember from 'ember';

export default Ember.Object.extend({
  rrule:null,
  toText: function()
  {
    var self = this;
    var rrule = this.get('rrule');
    var repeatRules = ['Yearly', 'Monthly', 'Weekly', 'Daily', 'Hourly', 'Minutely'];

    var recText = '';

    var dtStart = moment(rrule.options.dtStart);
    var dtEnd = null;
    if(rrule.options.until) {
      dtEnd = moment(rrule.options.until);
    }

    var tsEnd = Math.abs(dtStart - dtEnd);
    var calType = '';
    recText = 'Occurs ' + repeatRules[rrule.options.freq];

    var timeToAdd = 0;
    if(rrule.options.count) {
      timeToAdd = rrule.options.count;
    }
    switch(rrule.options.freq)
    {
      case 3:
        var days = rrule.options.byweekday;
        recText += self.getDateNames(days);
        if(dtEnd) {
          dtEnd.add(timeToAdd, 'days');
        }
        calType = "days";
        break;
      case 2:
        calType = "weeks";
        if(dtEnd) {
          dtEnd.add(timeToAdd * 7, 'days');
        }
        days = rrule.options.byweekday;
        recText += self.getDateNames(days);
        break;
      case 1:
        calType = "months";
        if(dtEnd) {
          dtEnd.add(timeToAdd, 'month');
        }

        if(rrule.options.bysetpos && rrule.options.bysetpos.length > 0)
        {
          var bspDay = self.getDayEnding(rrule.options.bysetpos);
          recText += " on the " + bspDay + " " + self.getDateNames(rrule.options.byweekday).replace(" every ", "");
        }
        else
        {
          //Ok, no BYSETPOS, let's go for BYMONTHDAY
          var bspMonth = self.getDayEnding('' + rrule.options.bymonthday[0]);
          recText += " on the " + bspMonth + " day of each month";
        }
        break;
      case 0:
        calType = "years";
        if(dtEnd) {
          dtEnd.add(timeToAdd, 'year');
        }
        //looks a lot like monthly....
        var mName = rrule.options.bymonth;
        //see if it's positional
        if(rrule.options.bysetpos && rrule.options.bysetpos.length > 0)
        {
          var bspYears = self.getDayEnding(rrule.options.bysetpos);
          recText += " on the " + bspYears + " " + self.getDateNames(rrule.options.byweekday).replace(" every ", "") + " of " + mName;
        }
        else
        {
          //Ok, no BYSETPOS, let's go for BYMONTHDAY
          var bspForMonth = self.getDayEnding('' + rrule.options.bymonthday[0]);
          recText += " on the " + bspForMonth + " day of " + mName;
        }
        break;
      case 4:
        calType = "hours";
        if(dtEnd) {
          dtEnd.add(timeToAdd, 'hour');
        }
        break;
      default:
        break;

    }

    recText += " starting on " + dtStart.format('DD/MM/YYYY') + " at " + dtStart.format('HH:mm');

    if (timeToAdd > 0) {
      recText += " for the next " + rrule.options.count + " " + calType;
      if (dtEnd) {
        recText += " ending on " + dtEnd.format('DD/MM/YYYY') + " at " + dtStart.add(tsEnd).format('HH:mm');
      }
    }

    return recText;
  },
  getDateNames: function(days)
  {

    var retString = "";
    if(days)
    {
      if (days.length < 7)
      {
        retString += " every";
        for (var d = 0; d < days.length; d++)
        {
          days[d] = this.getDayName(days[d]);

          if ((d === (days.length - 1)) && days.length > 1)
          {
            days[d] = " and " + days[d];
          }
          else
          {
            if ((days.length - d) > 2)
            {
              days[d] += ",";
            }
          }
          retString += " " + days[d];
        }
      }
    }
    return retString;
  },
  getDayName:function(day)
  {
    switch (day)
    {
      case "MO",0:
        return "Monday";
      case "TU",1:
        return "Tuesday";
      case "WE",2:
        return "Wednesday";
      case "TH",3:
        return "Thursday";
      case "FR",4:
        return "Friday";
      case "SA",5:
        return "Saturday";
      case "SU",6:
        return "Sunday";
      default:
        return "";
    }
  },
  getDayEnding: function(d)
  {
    if (d.endsWith("1") && d !== "11")
    {
      d += "st";
    }
    if (d.endsWith("2") && d !== "12")
    {
      d += "nd";
    }
    if (d.endsWith("3") && d !== "13")
    {
      d += "rd";
    }
    if (d.length < 3)
    {
      d += "th";
    }
    return d;
  }
});
