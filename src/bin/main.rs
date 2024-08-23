use std::{collections::*, io::Read, io::Write, ops::Sub};

fn take_token<R: std::io::BufRead>(cin: &mut R) -> String {
    cin.bytes()
        .map(|c| c.unwrap() as char)
        .skip_while(|c| c.is_whitespace())
        .take_while(|c| !c.is_whitespace())
        .collect::<String>()
}
#[allow(unused)]
macro_rules! scan {
    ($io:expr => $t:ty) => (take_token(&mut $io).parse::<$t>().unwrap());
    ($io:expr => $t:tt * $n:expr) => ((0..$n).map(|_| scan!($io => $t)).collect::<Vec<_>>());
    ($io:expr => $($t:tt),*) => (($(scan!($io => $t)),*));
    ($io:expr => $($t:tt),* * $n:expr) => ((0..$n).map(|_| ($(scan!($io => $t)),*)).collect::<Vec<_>>());
}

// ----------------------------------------------------------------------------

// TODO: implementations
struct Rect {
    y: i32,
    x: i32,
    h: i32,
    w: i32,
}

// ----------------------------------------------------------------------------

// TODO: This code is a sample for AHC031

#[derive(Clone)]
struct PInput {
    w: i32,  // width, height // 1000 固定
    days: i32,  // 5 <= days <= 50
    n: i32,  // number of reservations 5 <= n <= 50
    reservations: Vec<Vec<i32>>,  // required area
}

struct POutput {
    allocations: Vec<Vec<Rect>>,
}

trait Judge {
    fn input(&mut self) -> PInput;
    fn output(&mut self, output: POutput);
}

trait Solver {
    fn solve(judge: &mut impl Judge);
}

// ----------------------------------------------------------------------------

struct JudgeStdin<'a, R: std::io::BufRead, W: std::io::Write> {
    input: Option<PInput>,
    stdin: &'a mut R,
    stdout: &'a mut W,
}

impl<'a, R: std::io::BufRead, W: std::io::Write> Judge for JudgeStdin<'a, R, W> {
    fn input(&mut self) -> PInput {
        let mut input = PInput {
            w: 1000,
            days: 0,
            n: 0,
            reservations: Vec::new(),
        };

        input.days = scan!(self.stdin => i32);
        input.n = scan!(self.stdin => i32);
        for d in 0..input.days {
            let reservation = scan!(self.stdin => i32 * input.n);
            input.reservations.push(reservation);
        }

        self.input = Some(input.clone());
        input
    }

    fn output(&mut self, output: POutput) {
        for (i, rects) in output.allocations.iter().enumerate() {
            for rect in rects {
                std::writeln!(self.stdout, "{} {} {} {} ", rect.y, rect.x, rect.y + rect.h - 1, rect.x + rect.w - 1).unwrap();
            }
        }
    }
}

// ----------------------------------------------------------------------------

struct Solver1 {
    //
}

impl Solver1 {
    fn new() -> Self {
        Self {}
    }

    fn solve_internal(&mut self, judge: &mut impl Judge) {
        let input = judge.input();
        let mut output = POutput {
            allocations: Vec::new(),
        };

        for _ in 0..input.days {
            let mut rects = Vec::new();
            let mut y = 0;
            let mut x = 0;
            for _ in 0..input.n {
                rects.push(Rect {
                    y: y,
                    x: x,
                    h: 1,
                    w: 1,
                });
                x += 1;
                if x == input.w {
                    x = 0;
                    y += 1;
                }
            }
            output.allocations.push(rects);
        }

        judge.output(output);
    }
}

impl Solver for Solver1 {
    fn solve(judge: &mut impl Judge) {
        let mut solver = Self::new();
        solver.solve_internal(judge);
    }
}

// ----------------------------------------------------------------------------


fn main() {
    let mut stdin = std::io::stdin().lock();
    let mut stdout = std::io::stdout();

    let mut judge = JudgeStdin {
        input: None,
        stdin: &mut stdin,
        stdout: &mut stdout,
    };

    Solver1::solve(&mut judge);

}