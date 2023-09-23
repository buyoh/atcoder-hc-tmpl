require 'fileutils'
require 'json'

# Copied from sol-AtCoderHC019
# TODO: 一般化する

abort 'out exists' if File.exist?('analysis/result/records.txt')

testcase_sets = Dir.each_child('analysis/input').reject do |s|
  s =~ /^_/
end

args_params = [4].product(
  [300]
  # [300, 900, 1600],
  # [2500, 10000, 50000]
)

gen_args = lambda do |params|
  # next ('--a-loop-count %d --a-pick-points %d --a-ent-dist-threshold %d' +
  #     ' --a-dig-threshold %d --a-incomplete-penalty %d --a-unknown-penalty %d' +
  #     ' --a-grid-separation %d') % params
  next ('--a-threshold-small-block %d --a-heuristic-variance %d')%params
end

gen_params_label = lambda do |params|
  next params * '-'
end

File.open('analysis/result/records.txt', 'w') do |io|
  testcase_sets.each do |file_path|
    testcases_path = 'analysis/input/' + file_path
    args_params.each do |args_param|
      a = gen_args.call(args_param)
      warn "[#{file_path}] [#{a}]", uplevel: nil
      ret = `bash run_generated_with_score.sh --list #{testcases_path} --quiet -- #{a}`
      abort 'test failed: code=' + $? unless $? == 0
      record = {
        testcase: file_path,
        param_info: gen_params_label.call(args_param),
        score: ret.to_f
      }
      io.puts JSON.generate(record)
      io.flush
    end
  end
end
