#include "header.hpp"

//

namespace appenv {
// 起動引数
int g_k_parameter = 4;
} // namespace appenv

// ----------------------------------------------------------------------------

// オンラインクエリなら不要
// オフラインクエリなら実装する
struct PInput {
  int N, C;
  vector<array<int, 2>> items; // value, weight
};

struct PAnswer {
  vector<int> selectedItems;
};

// ------------------------------------

class Judge {
public:
  // オフラインクエリなら実装をそのまま使う
  virtual const PInput& input() = 0;
  virtual void output(const PAnswer &ans) = 0;
  virtual int score() = 0;
};

//

class JudgeStdio : public Judge {
  bool loaded_ = false;
  PInput pi_;
  int score_ = 0;

public:
  const PInput& input() override{
    if (loaded_)
      return pi_;
    loaded_ = true;
    scanner >> pi_.N >> pi_.C;
    pi_.items.reserve(pi_.N);
    repeat(i, pi_.N) {
      int v, w;
      scanner >> v >> w;
      pi_.items.push_back({v, w});
    }
    return pi_;
  }

  void output(const PAnswer &ans) override{
    printer.join(all(ans.selectedItems));
    printer << "\n";
    score_ = calcScore(pi_, ans);
  }

  int score() override {
    return score_;
  }

  static int calcScore(const PInput& input, const PAnswer& answer) {
    int vtotal = 0;
    int wtotal = 0;
    for (auto i : answer.selectedItems) {
      vtotal += input.items[i][0];
      wtotal += input.items[i][1];
    }
    assert(wtotal <= input.C);
    return vtotal;
  }
};

// ----------------------------------------------------------------------------

// オフラインクエリ用（使うのはPInput）
class SolverOfflineSample {
  const PInput &input_;

  SolverOfflineSample(const PInput &input)
      : input_(input) {}

  PAnswer solve() {
    vector<array<int, 3>> items; // value, weight, index
    repeat(i, input_.N) {
      auto &item = input_.items[i];
      items.push_back({item[0], item[1], i});
    }

    vector<int> selectedItems;
    sort(all(items));
    int totalWeight = 0;
    iterate(it, items.rbegin(), items.rend()) {
      auto &item = *it;
      totalWeight += item[1];
      if (totalWeight > input_.C) {
        totalWeight -= item[1];
        break;
      }
      selectedItems.push_back(item[2]);
    }

    return {selectedItems};
  }

public:
  const static void solve(Judge& judge) {
    const PInput& input = judge.input();
    SolverOfflineSample solver(input);
    judge.output(solver.solve());
  }
};

// オンラインクエリ用（主に使うのはjudge）
class SolverOnlineSample {
  Judge &judge_;
  SolverOnlineSample(Judge &judge)
      : judge_(judge) {}

  void solve() {
    PInput input = judge_.input();

    vector<array<int, 3>> items; // value, weight, index
    repeat(i, input.N) {
      auto &item = input.items[i];
      items.push_back({item[0], item[1], i});
    }

    vector<int> selectedItems;
    sort(all(items));
    int totalWeight = 0;
    iterate(it, items.rbegin(), items.rend()) {
      auto &item = *it;
      totalWeight += item[1];
      if (totalWeight > input.C) {
        totalWeight -= item[1];
        break;
      }
      selectedItems.push_back(item[2]);
    }

    judge_.output({selectedItems});
  }

public:
  const static void solve(Judge& judge) {
    SolverOnlineSample solver(judge);
    solver.solve();
  }
};

//

void appMain() {
  JudgeStdio judge;

  SolverOfflineSample::solve(judge);

  clog << "score = " << judge.score() << endl;
}

//

#define LOAD_CONSTANT_FROM_ARGS(konst, arg)                                    \
  {                                                                            \
    const string &v = CommandLine::get().str(arg);                             \
    if (!v.empty())                                                            \
      konst = atoi(v.c_str());                                                 \
  }

int main(int argc, char **argv) {
  using namespace appenv;
  CommandLine::initialize(argc, argv);
  LOAD_CONSTANT_FROM_ARGS(g_k_parameter,
                          "--a-parater");
  appMain();
  return 0;
}
