import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import './main.html';
import './templates/LavarAgora.html';
import './templates/AgendarHorario.html';

c_hour = 0;

Today = new Mongo.Collection( "today" );
Schedule = new Mongo.Collection( "schedule" );

Template.main.onCreated( function helloOnCreated() {
  // counter starts at 0
  function setServerTime() {
    //get server time (it's in milliseconds)
    Meteor.call( "getServerTime", function( error, result ) {
      Session.set( "serverTime", result );
      Session.set( "today", dataAtualFormatada() );
      Session.set( "tomorrow", dataAtualFormatada( 1 ) );
      Session.set( "today_plus_2", dataAtualFormatada( 2 ) );
      Session.set( "today_plus_3", dataAtualFormatada( 3 ) );
    });
    Meteor.call( "getCurrentHour", function( error, result ) {
      Session.set( "cur_hour", result );
    });
  }
  setServerTime();
  setInterval( function updateServerTime() { setServerTime(); }, 1000);
});

Template.main.helpers({
  date_server: function() { return Session.get( "serverTime" ); },
  today: function() { return Session.get( "today" ); },
  tomorrow: function() { return Session.get( "tomorrow" ); },
  today_plus_2: function() { return Session.get( "today_plus_2" ); },
  today_plus_3: function() { return Session.get( "today_plus_3" ); },
  cur_hour: function() { c_hour = Session.get( "cur_hour" ); return c_hour; },
  todays: function() {
    return Today.find( {}, {sort: {hour: 1}} );
  }
});

Template.main.events({
  'click #ec-lavar-agora': function() {
    BootstrapModalPrompt.prompt({
      dialogTemplate: Template.LavarAgora
    });
  },
  'click .ec-no-link': ()=> {
    console.log( "clicked on " + this._id );
    BootstrapModalPrompt.prompt({
      dialogTemplate: Template.AgendarHorario
    });
  }
});

Template.LavarAgora.events({
  'click #ec-lavar-agora-continuar-1': function() {
    BootstrapModalPrompt.prompt({
      dialogTemplate: Template.LavarAgora2
    });
  }  
});


// Funções
function dataAtualFormatada( plus = 0 ) {
  var data = new Date( new Date().getTime() + plus*( 24 * 60 * 60 * 1000 ));
  var dia = data.getDate();
  if( dia.toString().length == 1 ) { dia = "0" + dia; }
  var month = data.getMonth() + 1;
  var mes;
  switch( month ) {
    case 1 : mes = "janeiro"; break;
    case 2 : mes = "fevereiro"; break;
    case 3 : mes = "março"; break;
    case 4 : mes = "abril"; break;
    case 5 : mes = "maio"; break;
    case 6 : mes = "junho"; break;
    case 7 : mes = "julho"; break;
    case 8 : mes = "agosto"; break;
    case 9 : mes = "setembro"; break;
    case 10: mes = "outubro"; break;
    case 11: mes = "novembro"; break;
    case 12: mes = "dezembro"; break;
  }
  var ano = data.getFullYear();
  return dia + " de " + mes + " de " + ano;
}

