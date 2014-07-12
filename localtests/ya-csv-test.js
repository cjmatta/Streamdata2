// A simple echo program:
var csv = require('ya-csv');
var reader = csv.createCsvFileReader('./server/data/pumpdata.csv', {
      'separator': ',',
      'quote': '"',
      'escape': '"',
      'comment': '',
});
var writer = new csv.CsvWriter(process.stdout);
reader.addListener('data', function(data) {
      writer.writeRecord([ data[0] ]);
});
