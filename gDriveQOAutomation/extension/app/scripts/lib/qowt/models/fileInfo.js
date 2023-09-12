/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview simple model wrapper to store the originalURL and
 * the displayName of a current file.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  /**
   * This returns a standard ES6 object, which any client can add properties
   * to as required. Furthermore, once Object.observe lands in chrome, any
   * client can use that to monitor changes to this "model".
   *
   * This thus provides a very simple 'singleton' model object.
   *
   * The properties currently set by other clients on this model are:
   *
   * @param {string} originalURL The URL from which the stream was generated.
   *                             Which is undefined for non HTTP Streamed files
   * @param {string} displayName The display name of the file (eg foobar.doc)
   * @param {string} format The file format, either 'OOXML', or 'CBF'
   *
   */
  return {};
});

