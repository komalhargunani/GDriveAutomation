package com.automation.utils;

import java.io.IOException;
import java.util.logging.FileHandler;
import java.util.logging.Handler;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;


public class ELogger extends Logger {

  /**
   * The Singleton INSTANCE of the logger
   */
  private static final ELogger INSTANCE = new ELogger("ELogger");

  private ELogger(String name) {
    super(name, null);


    try {
      /**
       * The filename of the log
       */
      String filename = "./src/main/resources/config/logs.txt";

      FileHandler hand = new FileHandler(filename, true);
      hand.setFormatter(new SimpleFormatter());
      this.addHandler(hand);
    }
    catch (IOException e) {

    }
  }

  /**
   * Gets the singleton INSTANCE of the logger
   * 
   * @return the Logger singleton INSTANCE
   */
  public static ELogger getInstance() {
    return INSTANCE;
  }

  /**
   * Closes all the open log handlers
   */
  public void close() {
    Handler[] handlers = this.getHandlers();
    this.info(String.format("Closing log %d", handlers.length));
    for (Handler handler : handlers) {
      handler.close();
    }
  }

  @Override
  public void info(String s) {
    super.info(String.format("[INFO] - %s", s));
  }

  @Override
  public void warning(String s) {
    super.info(String.format("[WARNING] - %s", s));
  }

  @Override
  public void severe(String s) {
    super.info(String.format("[SEVERE] - %s", s));
  }

}
