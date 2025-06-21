import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Paper, Typography, Box, CircularProgress, Button, Chip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CategoryIcon from '@mui/icons-material/Category';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
  },
});

interface Quote {
  _id: string;
  text: string;
  author: string;
  category: string;
  used?: boolean;
  source?: string;
}

// GitHub Raw URL for quotes data
const GITHUB_QUOTES_URL = 'https://raw.githubusercontent.com/chanho-krc/qoute/main/my-quote-app/github-database/quotes.json';

function App() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['전체', '성공', '인생', '도전', '희망', '자기계발'];

  const fetchQuotesFromGitHub = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from GitHub first
      try {
        const response = await fetch(GITHUB_QUOTES_URL);
        if (response.ok) {
          const githubQuotes = await response.json();
          setQuotes(githubQuotes);
          console.log(`✅ GitHub에서 ${githubQuotes.length}개 명언 로드 완료`);
          return githubQuotes;
        }
      } catch (githubError) {
        console.log('GitHub 연결 실패, 로컬 데이터 사용');
      }

      // Fallback to local data if GitHub fails
      const localQuotes = generateLocalQuotes();
      setQuotes(localQuotes);
      console.log(`✅ 로컬에서 ${localQuotes.length}개 명언 로드 완료`);
      return localQuotes;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '명언을 불러오는데 실패했습니다.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateLocalQuotes = (): Quote[] => {
    return [
      { _id: 'local_001', text: '성공은 준비된 자에게 찾아오는 기회다.', author: '루이 파스퇴르', category: '성공' },
      { _id: 'local_002', text: '노력은 절대 배신하지 않는다.', author: '이치로', category: '성공' },
      { _id: 'local_003', text: '재능은 노력으로 완성된다.', author: '박지성', category: '성공' },
      { _id: 'local_004', text: '인생은 가까이서 보면 비극이지만 멀리서 보면 희극이다.', author: '찰리 채플린', category: '인생' },
      { _id: 'local_005', text: '살아있는 한 희망은 있다.', author: '키케로', category: '인생' },
      { _id: 'local_006', text: '실패를 두려워하지 마라. 시도하지 않는 것을 두려워하라.', author: '마이클 조던', category: '도전' },
      { _id: 'local_007', text: '천 리 길도 한 걸음부터.', author: '한국 속담', category: '도전' },
      { _id: 'local_008', text: '희망은 깃털 달린 새다.', author: '에밀리 디킨슨', category: '희망' },
      { _id: 'local_009', text: '절망은 신에 대한 죄악이다.', author: '톨스토이', category: '희망' },
      { _id: 'local_010', text: '배우기를 멈추는 사람은 늙은 것이다.', author: '헨리 포드', category: '자기계발' },
    ];
  };

  const selectRandomQuote = (quotesArray: Quote[]) => {
    if (quotesArray.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * quotesArray.length);
    return quotesArray[randomIndex];
  };

  const filterQuotesByCategory = (quotesArray: Quote[], category: string) => {
    if (category === '전체') return quotesArray;
    return quotesArray.filter(quote => quote.category === category);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const filtered = filterQuotesByCategory(quotes, category);
    setFilteredQuotes(filtered);
    if (filtered.length > 0) {
      const newQuote = selectRandomQuote(filtered);
      setCurrentQuote(newQuote);
    }
  };

  const handleRefresh = async () => {
    const targetQuotes = filteredQuotes.length > 0 ? filteredQuotes : quotes;
    if (targetQuotes.length > 0) {
      const newQuote = selectRandomQuote(targetQuotes);
      setCurrentQuote(newQuote);
    } else {
      await fetchQuotesFromGitHub().then(quotesArray => {
        if (quotesArray.length > 0) {
          const filtered = filterQuotesByCategory(quotesArray, selectedCategory);
          const newQuote = selectRandomQuote(filtered);
          setCurrentQuote(newQuote);
        }
      });
    }
  };

  useEffect(() => {
    fetchQuotesFromGitHub().then(quotesArray => {
      if (quotesArray.length > 0) {
        const filtered = filterQuotesByCategory(quotesArray, selectedCategory);
        setFilteredQuotes(filtered);
        const randomQuote = selectRandomQuote(filtered);
        setCurrentQuote(randomQuote);
      }
    });

    // 6시간마다 GitHub에서 새 데이터 확인
    const interval = setInterval(() => {
      fetchQuotesFromGitHub().then(quotesArray => {
        if (quotesArray.length > 0) {
          const filtered = filterQuotesByCategory(quotesArray, selectedCategory);
          setFilteredQuotes(filtered);
        }
      });
    }, 6 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '성공': '#4caf50',
      '인생': '#2196f3',
      '도전': '#ff9800',
      '희망': '#e91e63',
      '자기계발': '#9c27b0'
    };
    return colors[category] || '#757575';
  };

  const getDataSource = () => {
    if (quotes.length > 0 && quotes[0]._id.startsWith('remote_')) {
      return '🌐 GitHub';
    }
    return '💾 Local';
  };

  const getCategoryStats = () => {
    if (selectedCategory === '전체') {
      return `총 ${quotes.length}개`;
    }
    return `${selectedCategory} ${filteredQuotes.length}개`;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          {/* 헤더 */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              🌟 오늘의 명언
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
              GitHub 기반 실시간 업데이트 | {getDataSource()} | {getCategoryStats()}
            </Typography>
            
            {/* 카테고리 선택 버튼 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'contained' : 'outlined'}
                  size="small"
                  startIcon={<CategoryIcon />}
                  onClick={() => handleCategoryChange(category)}
                  sx={{
                    borderRadius: 20,
                    textTransform: 'none',
                    minWidth: 'auto',
                    px: 2,
                    py: 0.5,
                    fontSize: '0.85rem',
                    backgroundColor: selectedCategory === category ? getCategoryColor(category) : 'transparent',
                    borderColor: getCategoryColor(category),
                    color: selectedCategory === category ? 'white' : getCategoryColor(category),
                    '&:hover': {
                      backgroundColor: selectedCategory === category ? getCategoryColor(category) : `${getCategoryColor(category)}20`,
                    }
                  }}
                >
                  {category}
                </Button>
              ))}
            </Box>
          </Box>

          {/* 명언 카드 */}
          <Paper
            elevation={6}
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: 'background.paper',
              borderRadius: 3,
              width: '100%',
              maxWidth: 600,
              mb: 3,
              background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
            }}
          >
            {loading ? (
              <Box sx={{ py: 6 }}>
                <CircularProgress size={60} />
                <Typography sx={{ mt: 2 }}>GitHub에서 명언을 불러오는 중...</Typography>
              </Box>
            ) : error ? (
              <Box sx={{ py: 4 }}>
                <Typography color="error" variant="h6" gutterBottom>
                  ⚠️ {error}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleRefresh}
                  startIcon={<RefreshIcon />}
                  sx={{ mt: 2 }}
                >
                  다시 시도
                </Button>
              </Box>
            ) : currentQuote ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Chip 
                    label={currentQuote.category}
                    sx={{ 
                      backgroundColor: getCategoryColor(currentQuote.category),
                      color: 'white',
                      fontWeight: 'bold',
                      mb: 2
                    }}
                  />
                </Box>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 3, 
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    fontWeight: 300,
                    fontSize: { xs: '1.2rem', md: '1.5rem' }
                  }}
                >
                  "{currentQuote.text}"
                </Typography>
                
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ fontWeight: 'bold', mb: 2 }}
                >
                  - {currentQuote.author}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button 
                    variant="outlined" 
                    onClick={handleRefresh}
                    startIcon={<RefreshIcon />}
                  >
                    새 명언 보기
                  </Button>
                  
                  <Button 
                    variant="text" 
                    onClick={fetchQuotesFromGitHub}
                    size="small"
                  >
                    🔄 GitHub 동기화
                  </Button>
                </Box>
              </>
            ) : null}
          </Paper>

          {/* 통계 정보 */}
          <Box sx={{ textAlign: 'center', opacity: 0.7 }}>
            <Typography variant="body2">
              📊 총 {quotes.length}개 명언 | {getDataSource()} 데이터
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              💡 서버 없이 GitHub로 실시간 업데이트
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
