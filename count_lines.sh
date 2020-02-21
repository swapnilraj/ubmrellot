cat *.js | sed '/^\s*\/\//d;/^\s*$/d' | wc -l
