# 365LITE (365ライト) - 毎日自動投稿システム 開発ガイド (AGENTS.md)

本ドキュメントは、Googleビジネスプロフィール（GBP / Googleマップ）への**最新情報・毎日自動投稿機能に特化した独立システム「365ライト（365LITE）」**のローカル開発・動作検証、および本番環境への導入に関するガイドです。

---

## 🛠️ 基本コマンド一覧

### 1. 依存ライブラリのインストール
フロントエンド・バックエンドそれぞれでインストールが必要です。
```bash
# バックエンド
cd backend
npm install

# フロントエンド
cd ../frontend
npm install
```

### 2. データベースのセットアップとシード投入 (Prisma)
365ライトでは、マジックリンクや口コミ関連の外部連携を排除し、**`Shop`（店舗情報）と `ShopKeywords`（投稿・キーワード設定）の2モデルのみ**で構成されています。

```bash
cd backend
# データベーススキーマの反映
npx prisma db push

# テスト用初期データの投入
npx prisma db seed
```

#### 💡 本番環境（PostgreSQL / Supabase等）の設定
`backend/.env` に本番用PostgreSQLの接続文字列を設定してください。
```env
DATABASE_URL="postgresql://user:password@hostname:5432/dbname"
```
その後、`npx prisma db push` を実行することでテーブルが自動生成されます。

### 3. アプリケーションの起動
```bash
# バックエンド開発サーバー起動 (localhost:3000)
cd backend
npm run dev

# フロントエンド開発サーバー起動 (localhost:5173)
cd frontend
npm run dev
```

### 4. ビルド（本番用コンパイルチェック）
本番環境にデプロイする前の型チェックおよびコンパイルが正常に通るか確認するコマンドです。
```bash
# バックエンドビルド
cd backend
npm run build

# フロントエンドビルド
cd frontend
npm run build
```

---

## 🔑 初期デモアカウント一覧

`npx prisma db seed` を実行すると、以下のテストアカウントが利用可能です：

1. **マスター管理者アカウント**
   * メールアドレス: `admin@365lite.jp`
   * パスワード: `silver-ringo-815-park`
   * 権限: 全店舗・全代理店の閲覧および代理操作、自動投稿シミュレーターの実行が可能

2. **店舗オーナーアカウント（デモ店舗：美髪改善サロン Avenir Hair）**
   * メールアドレス: `meoseiha@avenir`
   * パスワード: `meoseiha@avenir`
   * 権限: 自店舗の投稿ダッシュボード、AI下書き編集、Google Drive写真管理、投稿キーワード設定

3. **代理店アカウント（代理店X）**
   * メールアドレス: `lite@dairiten.x`
   * パスワード: `lite@dairiten.x`
   * 権限: 傘下の店舗一覧管理

---

## 🔒 必要な環境変数 (.env) 設定

Googleドライブからストック写真を同期し、Googleマップに毎日投稿するために、以下のキーを `backend/.env` に記述してください。

* `PORT`: サーバーポート（デフォルト: 3000）
* `DATABASE_URL`: PostgreSQLデータベース接続URL
* `GEMINI_API_KEY`: Google AI Studio APIキー（AIによる毎日投稿の文章作成に利用）
* `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REFRESH_TOKEN`: GCP OAuth 2.0 接続情報（Googleドライブの写真取得・GBPへの投稿に利用）
* `CRON_SECRET`: 外部CRONスケジューラ連携用シークレットキー
