import { Button } from "@/components/ui/button"
import { Calendar, Users, Trophy, MessageCircle, Heart, Sparkles, Target, Globe } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="w-full py-6 px-4 bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-3xl transition-transform group-hover:scale-110">🐬</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PenaApp
              </h1>
              <p className="text-sm text-gray-600">ドルフィンズ公式アプリ</p>
            </div>
          </Link>
          <Link href="/auth">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 shadow-lg hover:shadow-xl transition-all duration-200">
              ログイン
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              サークル管理の新しいカタチ
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            サークル活動を<br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              もっと楽しく
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            上智大学KpopSDGsペナルティキック研究会ドルフィンズの<br />
            メンバー同士で繋がり、イベントに参加し、成長を記録しよう
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link href="/auth">
              <Button size="lg" className="text-lg px-10 py-4 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
                今すぐ始める
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-lg px-10 py-4 h-14 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200">
                デモを見る
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="group text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">イベント管理</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              サークルの練習やイベントに簡単に参加申込。スケジュール管理も楽々
            </p>
          </div>

          <div className="group text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">メンバー交流</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              メンバー同士で写真や動画をシェア。活動の思い出を共有しよう
            </p>
          </div>

          <div className="group text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">ゲーミフィケーション</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              活動参加でポイント獲得！バッジコレクションで成長を実感
            </p>
          </div>

          <div className="group text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">専門機能</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              K-pop、ペナルティキック、SDGs活動の記録と専用コンテンツ
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl">
            <Target className="w-10 h-10 mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-3">目標達成サポート</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              個人の目標設定から達成まで、仲間と一緒に成長できる仕組み
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-600 to-teal-600 text-white p-8 rounded-2xl shadow-xl">
            <Globe className="w-10 h-10 mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-3">SDGs活動記録</h3>
            <p className="text-green-100 text-sm leading-relaxed">
              持続可能な開発目標への取り組みを記録し、社会貢献を可視化
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-600 to-red-600 text-white p-8 rounded-2xl shadow-xl">
            <MessageCircle className="w-10 h-10 mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-3">リアルタイム交流</h3>
            <p className="text-pink-100 text-sm leading-relaxed">
              チャット機能で練習の質問や雑談まで、いつでも仲間と繋がれる
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12 border border-blue-100">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">
            一緒にサークルを盛り上げよう！
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
            PenaAppでドルフィンズの仲間たちと繋がり、<br />
            もっと楽しいサークルライフを始めませんか？
          </p>
          <Link href="/auth">
            <Button size="lg" className="text-lg px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              アカウント作成
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-4 bg-gray-900 text-white mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🐬</div>
                <h4 className="text-xl font-bold">PenaApp</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                サークル活動をもっと楽しく、<br />
                もっと繋がりのあるものに。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">機能</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>イベント管理</li>
                <li>メンバー交流</li>
                <li>ゲーミフィケーション</li>
                <li>活動記録</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">サークル</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                上智大学<br />
                KpopSDGsペナルティキック<br />
                研究会ドルフィンズ
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 PenaApp - すべての権利を保有します
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
