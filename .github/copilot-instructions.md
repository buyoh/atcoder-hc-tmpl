# 概要

ヒューリスティックコンテストの問題を解くコード。

## ドキュメント

AI 向けのドキュメントは `docs-ai/` ディレクトリにある

- src/problem.md : 問題文
- docs-ai/tasks.md: 開発タスク一覧と進捗管理
- docs-ai/plan.md: プロジェクト設計書

## コマンド

- `./bin/build.sh` : ビルドをし実行ファイルを生成する。実行ファイルは `./out/main` に生成される。
- `./run_preset_stdin.sh`: `./stdin` ディレクトリにある標準入力のサンプルを使ってコードを実行する。実行結果は、`./out/in_<sample_name>.out.txt` や`./out/in_<sample_name>.err.txt` に保存される。ソースコード変更後の動作確認に使う。
- `./run_generated_with_score.sh`: 大量のテストケースに対して実行し、スコアを計算する。スコアの評価はこちらを使う。

## コーディングについて

- コードは `src/` ディレクトリに配置する。新たにファイルを追加したり削除してはいけない。

## Git について

コミットには以下のアカウントを設定してください

- name: buyoh
- email: 15198247+buyoh@users.noreply.github.com
