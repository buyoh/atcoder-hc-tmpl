require 'fileutils'

# Copied from sol-AtCoderHC019
# TODO: 一般化する

groups = {}
all_inputs = []

Dir.each_child('out/cases') do |file_path|
  line = nil
  File.open('out/cases/' + file_path) do |io|
    line = io.gets
  end

  n, _ = line.split.map(&:to_i)
  group = [(n-5)/2]
  group_name = group * ''

  groups[group_name] ||= []
  groups[group_name] << file_path
  all_inputs << file_path
end

FileUtils.mkdir_p('analysis/input')

groups.each do |name, list|
  File.open('analysis/input/' + name + '.txt', 'w') do |io|
    list.sort.each do |f|
      io.puts f
    end
  end
end

# special
File.open('analysis/input/_all.txt', 'w') do |io|
  all_inputs.sort.each do |f|
    io.puts f
  end
end
