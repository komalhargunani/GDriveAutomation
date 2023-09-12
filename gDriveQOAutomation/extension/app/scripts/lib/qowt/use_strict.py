"""Adds 'use strict'; to all of our JavaScript files.

Copyright 2014 Google Inc. All Rights Reserved.

Adds 'use strict'; to all of our JavaScript files
so that they will run in strict mode.

author: davidshimel@google.com (David Shimel)
"""

# Copyright 2014 Google Inc. All Rights Reserved.
#
# Adds 'use strict'; to all of our JavaScript files
# so that they will run in strict mode.
#
# author: davidshimel@google.com (David Shimel)
import os
import re

LOG_TO_FILE = False
LOG_TO_CONSOLE = True


def log(msg, file_for_log):
  if LOG_TO_CONSOLE:
    print msg
  if file_for_log:
    file_for_log.write(msg + "\n")

logfile = open("./log_use_strict.txt", "w") if LOG_TO_FILE else None

# verify that this script is in the right directory
script_directory = os.path.dirname(os.path.realpath(__file__))
qowt_dir = "/html-office/crx/app/scripts/lib/qowt"
if not script_directory.endswith(qowt_dir):
  log("I need to be in " + qowt_dir +
      ", but I'm currently in %s. Exiting." % script_directory, logfile)
  exit(0)

# http://stackoverflow.com/questions/2186525/
#   use-a-glob-to-find-files-recursively-in-python
# get all the non-third-party JS files
files = []
for root, dirnames, filenames in os.walk(script_directory):
  for filename in filenames:
    if filename.endswith(".js") and "third_party" not in root:
      files.append(os.path.join(root, filename))

# match the function passed as the final argument to define()
# we want to add 'use strict'; within this function
# comments within define() and within function()'s arguments can make
# these regexes fail sometimes
define_regex_str = r"define\s*\(\s*\[(?P<modules>[:/,\s\w\d'\"\-\.\*]*)\]\s*"
function_regex_str = r",\s*function\s*\([/\w\s,\*]*\)\s*{"
use_strict_regex_str = r"\s*(?P<quote>['\"])use strict(?P=quote)\;\s*"
empty_define_regex = re.compile(define_regex_str + r"\)\s*\;")
define_function_regex = re.compile(define_regex_str + function_regex_str)
use_strict_regex = re.compile(use_strict_regex_str)
def_func_use_strict_regex = re.compile(define_regex_str + function_regex_str +
                                       use_strict_regex_str)


def contains_use_strict(file_text):
  use_strict_match = use_strict_regex.search(file_text)
  return use_strict_match.span(0) if use_strict_match else None


def find_number_of_use_stricts(file_text):
  first_span = contains_use_strict(file_text)
  if not first_span:
    return 0
  second_span = contains_use_strict(file_text[first_span[1]:])
  return 2 if second_span else 1

files_with_use_strict = []
files_to_check = []
files_written_to = []


def log_and_append_file(msg, file_for_log, file_to_append):
  log(msg, file_for_log)
  files_to_check.append(file_to_append)

for filename in files:
  text = ""
  with open(filename, "r") as script:
    text = script.read()

  numUseStricts = find_number_of_use_stricts(text)

  if numUseStricts >= 2:
    log_and_append_file("'use strict'; is in %s at least twice, " % filename +
                        "please investigate", logfile, filename)
    continue

  # verify that 'use strict'; is in the right place
  elif numUseStricts == 1:
    defFuncUseStrictMatch = def_func_use_strict_regex.search(text)
    if defFuncUseStrictMatch:
      files_with_use_strict.append(filename)
      continue
    else:
      log_and_append_file("%s has 'use strict';, " % filename +
                          "but it's somewhere unusual", logfile, filename)
      continue

  # add 'use strict'; to the right place
  elif numUseStricts == 0:
    defFuncMatch = define_function_regex.search(text)
    if defFuncMatch:
      # this is where we would write the file
      insertIndex = defFuncMatch.end(0)
      newText = text[:insertIndex] + "\n  'use strict';\n" + text[insertIndex:]
      with open(filename, "w") as outfile:
        outfile.write(newText)
      files_written_to.append(filename)
      continue
    else:
      log_and_append_file("could not find function within define() in " +
                          filename +
                          ", so I don't know where to add 'use strict';, " +
                          "please investigate", logfile, filename)
      continue

  else:
    raise ValueError("Didn't expect %s 'use strict';s!" % numUseStricts)

if files_with_use_strict:
  pass  # otherwise it's too verbose
  # log("\n'use strict'; is already in these files:", logfile)
  # for filename in files_with_use_strict:
  #   log(filename, logfile)

if files_to_check:
  log("\nyou should check these files manually because either I couldn't "
      "figure out where to add 'use strict'; or it was somewhere "
      "unexpected: ", logfile)
  for filename in files_to_check:
    log(filename, logfile)

if files_written_to:
  log("\nI wrote 'use strict'; to these files:", logfile)
  for filename in files_written_to:
    log(filename, logfile)

if logfile:
  logfile.close()
