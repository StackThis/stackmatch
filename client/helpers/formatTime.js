// from http://stackoverflow.com/questions/18580495/format-a-date-from-inside-a-handlebars-template-in-meteor
UI.registerHelper("formatDate", function(datetime, format) {
  if (moment) {
    return moment(datetime).format(format);
  }
  else {
    return datetime;
  }
});