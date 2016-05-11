import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Today = new Mongo.Collection( "today" );
Schedule = new Mongo.Collection( "schedule" );

Meteor.startup(() => {
  // code to run on server at startup
  console.log( "Running Startup again" );
  SyncedCron.start();
});

Meteor.methods({
  getServerTime: function() { return new Date(); }
});

Meteor.methods({
  getCurrentHour: function() { return new Date().getHours(); }
});

SyncedCron.add({
  name: 'Update Today Tags',
  schedule: function( parser ) {
    return parser.text('every 1 minute');
  },
  job: function() {
    var c_hour = new Date().getHours();
    Today.update( {"hour": {$lt: c_hour}}, {$set: {"display":"none"}}, {multi:true} );
    Today.update( {"hour": {$gte: c_hour}}, {$set: {"display":"block"}}, {multi:true} );
  }
});
