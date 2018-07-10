java -jar combiner-0.0.1.jar -o main.js tooltip.js util.js
java -jar yuicompressor-2.4.8.jar main.js -o main.min.js --type js --nomunge
