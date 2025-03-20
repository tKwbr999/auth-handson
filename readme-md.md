# React Authentication Sample App

認証機能を実装したReactサンプルアプリケーションです。このアプリケーションはJWTベースの認証、ソーシャルログイン、保護されたルートなど、モダンなWeb認証の主要コンセプトを実装しています。

## 機能

- ✅ JWTを使用したユーザー認証
- ✅ ソーシャルログイン（Google, GitHub）
- ✅ 保護されたルート（Protected Routes）
- ✅ アクセストークンとリフレッシュトークン
- ✅ パスワードリセット
- ✅ ユーザープロファイル管理
- ✅ セキュアなトークン保存
- ✅ レスポンシブデザイン

## 必要条件

- Node.js 18.x 以上
- npm 9.x 以上
- バックエンド API（別リポジトリで提供、または組み込みのモックサーバーを使用可能）

## インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/react-auth-sample.git
cd react-auth-sample

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env.local
```

`.env.local` ファイルを編集し、必要な環境変数を設定します：

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_AUTH_STORAGE=localStorage  # または 'cookie'
REACT_APP_ENABLE_SOCIAL_LOGIN=true
```

## 開発サーバーの起動

```bash
# 開発サーバーの起動
npm start

# モックAPIサーバーの起動（オプション）
npm run mock-api
```

アプリケーションは http://localhost:3000 で動作します。
モックAPIサーバーは http://localhost:8000 で動作します。

## テスト

```bash
# ユニットテストとインテグレーションテストの実行
npm test

# E2Eテストの実行
npm run test:e2e

# カバレッジレポートの生成
npm run test:coverage
```

## ビルド

```bash
# 本番用ビルドの作成
npm run build

# ビルドのプレビュー
npm run preview
```

## プロジェクト構造

```
react-auth-sample/
├── public/                 # 静的ファイル
├── src/
│   ├── api/                # API関連のコード
│   ├── assets/             # 画像やフォントなどのアセット
│   ├── components/         # 再利用可能なコンポーネント
│   │   ├── auth/           # 認証関連のコンポーネント
│   │   ├── ui/             # UI要素
│   ├── contexts/           # Reactコンテキスト
│   ├── hooks/              # カスタムフック
│   ├── lib/                # ユーティリティ関数
│   │   ├── auth/           # 認証関連のユーティリティ
│   ├── pages/              # ページコンポーネント
│   ├── routes/             # ルーティング設定
│   ├── types/              # TypeScript型定義
│   ├── App.tsx             # アプリケーションのルートコンポーネント
│   ├── index.tsx           # エントリーポイント
├── mock-api/               # モックAPIサーバー
├── tests/                  # テストファイル
│   ├── e2e/                # E2Eテスト
│   ├── unit/               # ユニットテスト
├── .env.example            # 環境変数の例
├── .eslintrc.js            # ESLint設定
├── .gitignore              # Git除外ファイル
├── package.json            # 依存関係とスクリプト
├── README.md               # プロジェクトの説明
├── tsconfig.json           # TypeScript設定
```

## 認証フロー

このアプリケーションでは、以下の認証フローを実装しています：

1. **ログイン**: ユーザーがメールアドレスとパスワードを入力し、サーバーに認証リクエストを送信します。
2. **トークン発行**: 認証成功時、サーバーはアクセストークンとリフレッシュトークンを発行します。
3. **トークン保存**: アクセストークンはローカルストレージまたは Cookie に保存されます。
4. **認証状態**: アプリケーションは認証コンテキストを通じて認証状態を管理します。
5. **保護されたルート**: 認証が必要なルートには ProtectedRoute コンポーネントを使用します。
6. **トークン更新**: アクセストークンの有効期限が切れた場合、リフレッシュトークンを使用して新しいトークンを取得します。
7. **ログアウト**: ユーザーがログアウトすると、トークンが削除され、認証状態がリセットされます。

詳細なシーケンス図は [SEQUENCE.md](./SEQUENCE.md) を参照してください。

## 環境変数

| 変数名 | 説明 | デフォルト値 |
|---|---|---|
| REACT_APP_API_URL | バックエンドAPIのURL | `http://localhost:8000/api` |
| REACT_APP_AUTH_STORAGE | トークンの保存場所 (`localStorage` or `cookie`) | `localStorage` |
| REACT_APP_ENABLE_SOCIAL_LOGIN | ソーシャルログインの有効化 | `true` |
| REACT_APP_GOOGLE_CLIENT_ID | Google認証のクライアントID | - |
| REACT_APP_GITHUB_CLIENT_ID | GitHub認証のクライアントID | - |

## デモアカウント（モックAPIサーバー用）

- Email: `user@example.com`
- Password: `password123`

## デバッグモード

開発中にデバッグモードを有効にするには、ブラウザのコンソールで以下のコマンドを実行します：

```javascript
localStorage.setItem('authDebug', 'true');
```

デバッグモードを無効にするには：

```javascript
localStorage.removeItem('authDebug');
```

## アーキテクチャと技術スタック

- **フロントエンド**: React, TypeScript
- **状態管理**: React Context API, React Query
- **ルーティング**: React Router
- **スタイリング**: CSS Modules, Sass
- **HTTP クライアント**: Axios
- **認証**: JWT, OAuth 2.0
- **テスト**: Jest, React Testing Library, Cypress

詳細なアーキテクチャ設計については [ARCHITECTURE.md](./ARCHITECTURE.md) を参照してください。

## データモデル

アプリケーションで使用されるデータモデルの詳細は [DATAMODEL.md](./DATAMODEL.md) を参照してください。

## ライセンス

MIT

## 貢献

バグ報告や機能リクエストは GitHub Issues を通じてお願いします。プルリクエストも歓迎です。

## 著者

Your Name (your.email@example.com)
