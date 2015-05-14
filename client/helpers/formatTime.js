// from http://stackoverflow.com/questions/18580495/format-a-date-from-inside-a-handlebars-template-in-meteor
UI.registerHelper("formatDate", function(datetime) {
  if (moment) {
    return moment(datetime).calendar().toLowerCase();
  }
  else {
    return datetime;
  }
});