#!/bin/sh

# Transforms every '==' to '==='
find client -type f -name "*.js*" | xargs sed -i -e 's/ == / === /g';
find server -type f -name "*.js*" | xargs sed -i -e 's/ == / === /g';
find imports -type f -name "*.js*" | xargs sed -i -e 's/ == / === /g';

# Transforms every snake_case occurence to camelCase
#source venv/bin/activate;
#find client -type f -name "*.js*" | xargs python ./scripts/sed_snake_case.py;
#find client -type f -name "*.js*.e" | xargs mv -n2

# Fix indentation by removing tabs
find client -type f -name "*.js*" | xargs sed -i -e 's/      /  /g';
find server -type f -name "*.js*" | xargs sed -i -e 's/      /  /g';
find imports -type f -name "*.js*" | xargs sed -i -e 's/      /  /g';
