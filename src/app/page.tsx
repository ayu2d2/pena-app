import { Button } from "@/components/ui/button"
import { Calendar, Users, Trophy, Heart, Sparkles, Target, Globe, Star, ChevronRight, Play } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* 視認性重視のアニメーション背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/8 to-blue-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/12 to-purple-500/12 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* 高コントラストヘッダー */}
      <header className="relative w-full py-6 px-4 bg-white/95 backdrop-blur-xl border-b border-gray-200/80 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl text-white text-2xl transform transition-transform group-hover:scale-110">
                🐬
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                PenaApp
              </h1>
              <p className="text-sm text-gray-600 font-medium">ドルフィンズ公式アプリ</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium">
              機能
            </Button>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                ログイン
                <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 高視認性ヒーローセクション */}
      <main className="relative max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-28">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-300 text-blue-900 px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-md">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <Sparkles className="w-4 h-4" />
              サークル管理の新しいカタチ
              <Star className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
            サークル活動を<br />
            <span className="text-blue-600">
              もっと楽しく
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            上智大学 <span className="font-bold text-blue-700">KpopSDGsペナルティキック研究会</span><br />
            <span className="font-bold text-indigo-700">ドルフィンズ</span>の
            メンバー同士で繋がり、成長を記録しよう
          </p>
          
          {/* 高コントラストCTAボタン */}
          <div className="flex gap-6 justify-center flex-col sm:flex-row mb-16">
            <Link href="/auth">
              <Button size="lg" className="text-xl px-12 py-6 h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group border-2 border-blue-700">
                <Play className="w-6 h-6 mr-3 transition-transform group-hover:scale-110" />
                今すぐ始める
                <ChevronRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-xl px-12 py-6 h-16 border-2 border-gray-400 text-gray-800 bg-white hover:bg-gray-50 font-bold transition-all duration-300 transform hover:scale-105">
              機能を見る
            </Button>
          </div>

          {/* 視認性重視の信頼指標 */}
          <div className="flex justify-center items-center gap-8 text-sm text-gray-700 mb-20 font-medium">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              50+ アクティブメンバー
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              毎週イベント開催
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              実績トラッキング
            </div>
          </div>
        </div>

        {/* 高視認性機能グリッド */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-28">
          {[
            {
              icon: Calendar,
              title: "イベント管理",
              description: "K-pop、PK練習、学習会まで多彩なイベントを簡単管理",
              bgColor: "bg-blue-50",
              iconColor: "bg-blue-600",
              textColor: "text-blue-900"
            },
            {
              icon: Trophy,
              title: "成長記録",
              description: "ポイントシステムとバッジで成長を可視化",
              bgColor: "bg-indigo-50",
              iconColor: "bg-indigo-600",
              textColor: "text-indigo-900"
            },
            {
              icon: Users,
              title: "メンバー交流",
              description: "プロフィール共有とコミュニケーション機能",
              bgColor: "bg-cyan-50",
              iconColor: "bg-cyan-600",
              textColor: "text-cyan-900"
            },
            {
              icon: Target,
              title: "ペナルティキック",
              description: "スキルレベル記録と練習管理",
              bgColor: "bg-emerald-50",
              iconColor: "bg-emerald-600",
              textColor: "text-emerald-900"
            }
          ].map((feature, index) => (
            <div key={index} className={`group text-center p-8 ${feature.bgColor} rounded-3xl shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer`}>
              <div className={`w-16 h-16 mx-auto mb-6 ${feature.iconColor} rounded-2xl flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl font-bold ${feature.textColor} mb-3`}>{feature.title}</h3>
              <p className="text-gray-700 leading-relaxed font-medium">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* 高コントラスト統計セクション */}
        <div className="grid md:grid-cols-3 gap-8 mb-28">
          <div className="bg-blue-600 text-white p-10 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-700">
            <Target className="w-12 h-12 mb-6" />
            <h3 className="text-3xl font-bold mb-4">多様な活動</h3>
            <p className="text-blue-100 leading-relaxed font-medium">K-pop、ペナルティキック、SDGs学習、交流会まで、幅広い活動をサポート</p>
          </div>
          <div className="bg-cyan-600 text-white p-10 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-cyan-700">
            <Users className="w-12 h-12 mb-6" />
            <h3 className="text-3xl font-bold mb-4">活発なコミュニティ</h3>
            <p className="text-cyan-100 leading-relaxed font-medium">上智大学の学生が中心となって運営する、活気あふれるサークル</p>
          </div>
          <div className="bg-emerald-600 text-white p-10 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-emerald-700">
            <Globe className="w-12 h-12 mb-6" />
            <h3 className="text-3xl font-bold mb-4">グローバルな視点</h3>
            <p className="text-emerald-100 leading-relaxed font-medium">K-popとSDGsを通じて、国際的な視野を養う特色ある活動</p>
          </div>
        </div>

        {/* 高視認性CTAセクション */}
        <div className="text-center bg-blue-50 rounded-3xl p-16 border-2 border-blue-200 shadow-xl">
          <h3 className="text-4xl font-bold mb-6 text-gray-900">
            一緒にサークルを盛り上げよう！
          </h3>
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            PenaAppでドルフィンズライフをもっと充実させよう。仲間と繋がり、成長し、思い出を作る新しい体験が待っています。
          </p>
          <Link href="/auth">
            <Button size="lg" className="text-xl px-16 py-6 h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 group border-2 border-blue-700">
              <Heart className="w-6 h-6 mr-3 transition-transform group-hover:scale-125" />
              今すぐ参加する
              <Sparkles className="w-6 h-6 ml-3 transition-transform group-hover:rotate-12" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="relative w-full py-16 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl text-2xl">🐬</div>
              <div>
                <h3 className="text-2xl font-bold">PenaApp</h3>
                <p className="text-gray-400">ドルフィンズ公式アプリ</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-md">
              上智大学KpopSDGsペナルティキック研究会ドルフィンズの公式アプリケーション。
              メンバー同士の交流と成長をサポートします。
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">機能</h4>
            <ul className="space-y-2 text-gray-300">
              <li>イベント管理</li>
              <li>メンバープロフィール</li>
              <li>ポイントシステム</li>
              <li>バッジコレクション</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">サークル活動</h4>
            <ul className="space-y-2 text-gray-300">
              <li>K-popイベント</li>
              <li>ペナルティキック練習</li>
              <li>SDGs学習会</li>
              <li>メンバー交流会</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2025 上智大学KpopSDGsペナルティキック研究会ドルフィンズ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}