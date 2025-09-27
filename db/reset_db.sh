#!/bin/bash

rm -f lcbru.db

ruby db_create.rb

ruby db_populate_test.rb