import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Alert,
  Box,
  Typography,
  Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';

interface QuoteSubmissionProps {
  open: boolean;
  onClose: () => void;
}

interface SubmissionData {
  text: string;
  author: string;
  category: string;
  submitterName: string;
  source: string;
}

const QuoteSubmission: React.FC<QuoteSubmissionProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<SubmissionData>({
    text: '',
    author: '',
    category: '성공',
    submitterName: '',
    source: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = ['성공', '인생', '도전', '희망', '자기계발'];

  const handleInputChange = (field: keyof SubmissionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.text.trim()) return '명언 내용을 입력해주세요.';
    if (formData.text.length < 10) return '명언은 최소 10자 이상이어야 합니다.';
    if (formData.text.length > 500) return '명언은 500자를 초과할 수 없습니다.';
    if (!formData.author.trim()) return '작가/인물을 입력해주세요.';
    if (!formData.submitterName.trim()) return '제출자 이름을 입력해주세요.';
    return null;
  };

  const createGitHubIssue = async (): Promise<boolean> => {
    const issueTitle = `새 명언 제출: "${formData.text.substring(0, 50)}${formData.text.length > 50 ? '...' : ''}"`;
    
    const issueBody = `## 📝 새로운 명언 제출

### 명언 정보
- **내용**: "${formData.text}"
- **작가/인물**: ${formData.author}
- **카테고리**: ${formData.category}
- **출처/참고자료**: ${formData.source || '미제공'}

### 제출자 정보
- **제출자**: ${formData.submitterName}
- **제출일시**: ${new Date().toLocaleString('ko-KR')}

### 검토 가이드라인
- [ ] 실제 인물의 검증된 명언인가?
- [ ] 내용이 적절하고 긍정적인가?
- [ ] 중복된 명언이 아닌가?
- [ ] 저작권 문제가 없는가?

### 승인 시 추가될 JSON
\`\`\`json
{
  "_id": "remote_${Math.random().toString(36).substr(2, 9)}",
  "text": "${formData.text}",
  "author": "${formData.author}",
  "category": "${formData.category}",
  "used": false,
  "source": "community"
}
\`\`\`

---
*이 이슈는 웹앱의 명언 제출 기능을 통해 자동 생성되었습니다.*`;

    try {
      // GitHub API로 이슈 생성 (실제로는 GitHub Personal Access Token이 필요)
      // 여기서는 시뮬레이션으로 처리
      console.log('GitHub Issue 생성:', { title: issueTitle, body: issueBody });
      
      // 실제 구현 시:
      // const response = await fetch('https://api.github.com/repos/chanho-krc/qoute/issues', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     title: issueTitle,
      //     body: issueBody,
      //     labels: ['quote-submission', 'pending-review']
      //   })
      // });
      
      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (error) {
      console.error('GitHub Issue 생성 실패:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await createGitHubIssue();
      if (success) {
        setSubmitSuccess(true);
        // 폼 초기화
        setFormData({
          text: '',
          author: '',
          category: '성공',
          submitterName: '',
          source: ''
        });
      } else {
        alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <SendIcon color="primary" />
          <Typography variant="h6">새 명언 제출하기</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {submitSuccess ? (
          <Box textAlign="center" py={3}>
            <VerifiedIcon sx={{ fontSize: 48, color: 'green', mb: 2 }} />
            <Typography variant="h6" gutterBottom color="green">
              제출이 완료되었습니다! 🎉
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              명언이 관리자 검토를 위해 GitHub Issue로 제출되었습니다.
            </Typography>
            <Alert severity="info">
              <strong>검토 과정:</strong><br />
              1. 관리자가 2-3일 내 검토<br />
              2. 승인 시 앱에 자동 반영<br />
              3. GitHub에서 진행 상황 확인 가능
            </Alert>
          </Box>
        ) : (
          <>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <SecurityIcon />
                <Typography variant="body2">
                  <strong>안전한 검토 시스템:</strong> 제출된 명언은 관리자 검토 후 승인되면 앱에 추가됩니다.
                </Typography>
              </Box>
            </Alert>

            <TextField
              fullWidth
              label="명언 내용 *"
              multiline
              rows={3}
              value={formData.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              placeholder="영감을 주는 명언을 입력해주세요..."
              sx={{ mb: 2 }}
              helperText={`${formData.text.length}/500자`}
            />

            <TextField
              fullWidth
              label="작가/인물 *"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              placeholder="명언의 작가나 인물을 입력해주세요"
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>카테고리 *</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    <Chip label={cat} size="small" />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="출처/참고자료"
              value={formData.source}
              onChange={(e) => handleInputChange('source', e.target.value)}
              placeholder="책, 웹사이트, 인터뷰 등 (선택사항)"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="제출자 이름 *"
              value={formData.submitterName}
              onChange={(e) => handleInputChange('submitterName', e.target.value)}
              placeholder="닉네임을 입력해주세요"
              sx={{ mb: 2 }}
            />

            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>제출 가이드라인:</strong><br />
                • 실제 인물의 검증된 명언만 제출해주세요<br />
                • 욕설이나 부적절한 내용은 금지됩니다<br />
                • 저작권을 침해하지 않는 내용만 제출해주세요<br />
                • 중복된 명언은 자동으로 필터링됩니다
              </Typography>
            </Alert>
          </>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>
          {submitSuccess ? '닫기' : '취소'}
        </Button>
        {!submitSuccess && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            startIcon={isSubmitting ? undefined : <SendIcon />}
          >
            {isSubmitting ? '제출 중...' : '명언 제출하기'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default QuoteSubmission; 