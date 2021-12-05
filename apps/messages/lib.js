exports.pushMessage = function(event) {
  /* event is:
    {t:"add",id:int, src,title,subject,body,sender,tel, important:bool} // add new
    {t:"add",id:int, id:"music", state, artist, track, etc} // add new
    {t:"remove-",id:int} // remove
    {t:"modify",id:int, title:string} // modified
  */
  var messages, inApp = "undefined"!=typeof MESSAGES;
  if (inApp)
    messages = MESSAGES; // we're in an app that has already loaded messages
  else   // no app - load messages
    messages = require("Storage").readJSON("messages.json",1)||[];
  // now modify/delete as appropriate
  var mIdx = messages.findIndex(m=>m.id==event.id);
  if (event.t=="remove") {
    if (mIdx>=0) messages.splice(mIdx, 1); // remove item
    mIdx=-1;
  } else { // add/modify
    if (event.t=="add") event.new=true; // new message
    if (mIdx<0) {
      mIdx=0;
      messages.unshift(event); // add new messages to the beginning
    }
    else Object.assign(messages[mIdx], event);
  }
  require("Storage").writeJSON("messages.json",messages);
  // if in app, process immediately
  if (inApp) return onMessagesModified(mIdx<0 ? {id:event.id} : messages[mIdx]);
  // ok, saved now - we only care if it's new
  if (event.t!="add") return;
  // otherwise load after a delay, to ensure we have all the messages
  if (exports.messageTimeout) clearTimeout(exports.messageTimeout);
  exports.messageTimeout = setTimeout(function() {
    exports.messageTimeout = undefined;
    // if we're in a clock or it's important, go straight to messages app
    if (Bangle.CLOCK || event.important) return load("messages.app.js");
    if (!global.WIDGETS || !WIDGETS.messages) return Bangle.buzz(); // no widgets - just buzz to let someone know
    WIDGETS.messages.show();
  }, 500);
}
exports.clearAll = function(event) {
  var messages, inApp = "undefined"!=typeof MESSAGES;
  if (inApp) {
    MESSAGES = [];
    messages = MESSAGES; // we're in an app that has already loaded messages
  } else   // no app - empty messages
    messages = [];
  // Save all messages
  require("Storage").writeJSON("messages.json",messages);
  // update app if in app
  if (inApp) return onMessagesModified();
  // if we have a widget, update it
  if (global.WIDGETS && WIDGETS.messages)
    WIDGETS.messages.hide();
}