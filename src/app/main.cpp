#include "header.hpp"

//

struct Problem {
  int N, C;
  vector<array<int, 2>> items; // value, weight

  void input(MaiScanner &scanner) {
    scanner >> N >> C;
    items.reserve(N);
    repeat(i, N) {
      int v, w;
      scanner >> v >> w;
      items.push_back({v, w});
    }
  }

  int calcScore(const vector<int> &selectedItems) {
    int vtotal = 0;
    int wtotal = 0;
    for (auto i : selectedItems) {
      vtotal += items[i][0];
      wtotal += items[i][1];
    }
    assert(wtotal <= C);
    return vtotal;
  }
};

//

class Solver {
public:
  Solver() {}
  vector<int> solve(const Problem &problem) {
    vector<array<int, 3>> items; // value, weight, index
    repeat(i, problem.N) {
      auto &item = problem.items[i];
      items.push_back({item[0], item[1], i});
    }

    vector<int> selectedItems;
    sort(all(items));
    int totalWeight = 0;
    iterate(it, items.rbegin(), items.rend()) {
      auto &item = *it;
      totalWeight += item[1];
      if (totalWeight > problem.C) {
        totalWeight -= item[1];
        break;
      }
      selectedItems.push_back(item[2]);
    }
    return selectedItems;
  }
};

//

void appMain(MaiScanner &scanner, MaiPrinter &printer) {
  //
  Problem problem;
  problem.input(scanner);
  Solver solver;
  auto ans = solver.solve(problem);
  //
  printer.join(all(ans));
  printer << "\n";
  clog << "score = " << problem.calcScore(ans) << endl;
}

//

struct AutoFcloser {
  vector<FILE *> fps;
  ~AutoFcloser() {
    for (auto p : fps)
      fclose(p);
    fps.clear();
  }
} autofcloser;

MaiScanner selectScanner(int argc, char **argv) {
  if (argc >= 2) {
    FILE *fp = fopen(argv[1], "r");
    if (fp != nullptr) {
      autofcloser.fps.push_back(fp);
      return MaiScanner(fp);
    }
  }
  return MaiScanner(stdin);
}

MaiPrinter selectPrinter(int argc, char **argv) {
  //
  return MaiPrinter(stdout);
}

int main(int argc, char **argv) {
  MaiScanner scanner = selectScanner(argc, argv);
  MaiPrinter printer = selectPrinter(argc, argv);
  appMain(scanner, printer);
  return 0;
}
