// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * Message Bus
 * ===========
 *
 * @fileoverview The Message Bus is a singleton object which is loaded within
 * a HTML document. If there are several different HTML documents and each one
 * has its own instance of the message bus then the instances can ask to be
 * 'connected' to one another and then used to relay messages between the
 * different documents.
 *
 * For example, the Message Bus is used to allow safe communication to occur
 * between the app (which lives in the top-level HTML document) and QOWT
 * (which lives in an iframe, which is a different HTML document).
 * The term 'safe' is used to refer to the decoupled nature of QOWT<->app
 * communication using the message bus, as opposed to unsafe techniques that
 * rely on the presence of the 'allow-same-origin' flag in the QOWT iframe's
 * 'sandbox' attribute to allow QOWT to underhandledly manipulate the app's
 * document directly.
 *
 * @see MessageBusImpl
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/messageBus/messageBusImpl'],
  function(
    MessageBusImpl) {

  'use strict';

  return new MessageBusImpl();
});
