
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, BookOpen, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">커뮤니티 플랫폼</h1>
            <nav className="flex gap-4">
              <Link to="/board">
                <Button variant="ghost">게시판</Button>
              </Link>
              <Link to="/create-post">
                <Button>글쓰기</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            소통과 공유의 공간
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            자유로운 의견 교환과 유용한 정보를 나누는 커뮤니티입니다
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/board">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="w-5 h-5 mr-2" />
                게시판 둘러보기
              </Button>
            </Link>
            <Link to="/create-post">
              <Button size="lg" variant="outline">
                <BookOpen className="w-5 h-5 mr-2" />
                글 작성하기
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>자유로운 소통</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                다양한 주제로 자유롭게 대화하고 의견을 나누세요
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <CardTitle>활발한 커뮤니티</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                많은 사용자들과 함께 지식과 경험을 공유하세요
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <CardTitle>유용한 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                실시간으로 업데이트되는 유용한 정보를 확인하세요
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">지금 시작해보세요!</h3>
          <p className="text-gray-600 mb-6">
            커뮤니티의 일원이 되어 다양한 사람들과 소통해보세요
          </p>
          <Link to="/board">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              게시판 바로가기
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 커뮤니티 플랫폼. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
