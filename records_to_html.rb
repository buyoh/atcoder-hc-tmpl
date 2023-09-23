require 'json'

# Copied from sol-AtCoderHC019
# TODO: 一般化する

record_sets = {}
all_records = {}
param_sets = []

Dir.glob('analysis/result/records*.txt') do |path|
  rec_name = '[head]'
  rec_name = Regexp.last_match(1) if path =~ %r{records([^/]+)\.txt}
  abort "duplicate #{record_sets[rec_name]} and #{path}" if record_sets.has_key? rec_name
  record_sets[rec_name] = path
end

abort 'no records' if record_sets.empty?

record_sets.each do |rec_name, path|
  File.open(path) do |io|
    while line = io.gets
      data = JSON.parse(line)
      testcase = data['testcase']
      param_info = data['param_info'] + '<br>' + rec_name
      score = data['score']

      all_records[testcase] ||= {}
      all_records[testcase][param_info] = { score: score }

      param_sets << param_info
    end
  end
  param_sets = param_sets.sort.uniq
end

File.open('analysis/result/records.html', 'w') do |io|
  io.puts '<html><body>'
  io.puts '<table border="1">'
  io.puts '<tr>'
  io.print '<th></th>'
  param_sets.each do |param|
    io.print '<th>'
    io.print param
    io.print '</th>'
  end
  io.puts '</tr>'
  all_records.sort.each do |testcase_name, records|
    score_min, score_max = records.each_value.map { |r| r[:score] }.minmax
    io.puts '<tr>'
    io.print '<td>' + testcase_name + '</td>'
    param_sets.each do |param|
      if records.has_key?(param)
        record = records[param]
        score = record[:score]
        h = score_max - score_min == 0 ? 120 : 240 - (score - score_min) / (score_max - score_min) * 240
        bgcolor = "hsl(#{h.to_i}deg 50% 80%)"
        io.print format('<td style="background: %s;">', bgcolor)
        io.print format('%.3f', score_min / score)
        io.print '</td>'
      else
        io.print '<td></td>'
      end
    end
    io.puts ''
    io.puts '</tr>'
  end

  io.puts '</table>'
  io.puts '</body></html>'
end
