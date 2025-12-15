import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { generateBookContent, generateQuiz } from '@/services/gemini';
import { QuizQuestion } from '@/services/types';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { LANGUAGES, LanguageCode } from '@/constants/languages';
import { QuizComponent } from '@/components/QuizComponent';

export default function ReadingScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const params = useLocalSearchParams();
  const bookTitle = params.title as string;
  const bookAuthor = params.author as string;
  const publishedDate = params.publishedDate as string;
  const topic = params.topic as string;
  const results = params.results as string;

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [contentCache, setContentCache] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [readingTab, setReadingTab] = useState<'guide' | 'quiz'>('guide');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // Auth check - show loading while Clerk initializes
  if (!isLoaded) {
    return (
      <View style={styles.authLoadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.authLoadingText}>Loading...</Text>
      </View>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  useEffect(() => {
    setLoading(true);
    setContent('');
    setCurrentLang('en');
    setContentCache({});
    fetchReadingGuide();
  }, [bookTitle, bookAuthor]);

  const fetchReadingGuide = async () => {
    const prompt = `I want to read and understand the book "${bookTitle}" by "${bookAuthor}".

    Please provide a comprehensive "Read With Me" guide that includes:
    1. A detailed synopsis of the book's core argument or plot
    2. Key themes and main ideas
    3. Important takeaways
    4. Discussion questions for reflection

    Format your response with clear sections using:
    ## for main section headings
    ### for subsections
    **text** for emphasis

    Use Google Search to ensure accuracy.`;

    try {
      const response = await generateBookContent(prompt, true);
      setContent(response.text);
      setContentCache({ 'en': response.text });
    } catch (error) {
      console.error('Failed to fetch reading guide:', error);
      setContent('Failed to load reading guide. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadQuiz = async () => {
    setLoadingQuiz(true);
    try {
      const questions = await generateQuiz(bookTitle, bookAuthor);
      setQuizQuestions(questions);
      setReadingTab('quiz');
    } catch (error) {
      console.error('Failed to load quiz:', error);
      alert('Failed to load quiz. Please try again.');
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleLanguageChange = async (langCode: LanguageCode) => {
    if (langCode === currentLang) return;

    // Check cache first
    if (contentCache[langCode]) {
      setCurrentLang(langCode);
      setContent(contentCache[langCode]);
      return;
    }

    const originalText = contentCache['en'];
    if (!originalText) return;

    setIsTranslating(true);

    try {
      const targetLang = LANGUAGES.find(l => l.code === langCode)?.native || langCode;
      const prompt = `Translate the following markdown text into ${targetLang}.
IMPORTANT: Maintain all Markdown formatting exactly (headers ##, bold **, lists *, etc.).
Do not shorten the content. Translate it fully and accurately.

Content to translate:
${originalText}`;

      const response = await generateBookContent(prompt, false);

      setContentCache(prev => ({ ...prev, [langCode]: response.text }));
      setContent(response.text);
      setCurrentLang(langCode);
    } catch (error) {
      console.error('Translation failed:', error);
      alert('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Helper component for gradient text
  const GradientText = ({
    children,
    colors,
    style
  }: {
    children: React.ReactNode;
    colors: readonly [string, string, ...string[]];
    style?: any;
  }) => {
    return (
      <MaskedView
        maskElement={
          <Text style={[style, { backgroundColor: 'transparent' }]}>
            {children}
          </Text>
        }>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <Text style={[style, { opacity: 0 }]}>{children}</Text>
        </LinearGradient>
      </MaskedView>
    );
  };

  // Parse markdown and render
  const renderContent = () => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        elements.push(<View key={`space-${index}`} style={styles.spacer} />);
        return;
      }

      // Main heading (##)
      if (trimmed.startsWith('##') && !trimmed.startsWith('###')) {
        const text = trimmed.replace(/^##\s*/, '');
        elements.push(
          <Text key={index} style={styles.heading1}>
            {text.replace(/\*\*/g, '')}
          </Text>
        );
        return;
      }

      // Subheading (###)
      if (trimmed.startsWith('###')) {
        const text = trimmed.replace(/^###\s*/, '');
        elements.push(
          <Text key={index} style={styles.heading2}>
            {text.replace(/\*\*/g, '')}
          </Text>
        );
        return;
      }

      // List item
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const text = trimmed.replace(/^[*-]\s*/, '');
        elements.push(
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>{parseBoldText(text)}</Text>
          </View>
        );
        return;
      }

      // Regular paragraph
      elements.push(
        <Text key={index} style={styles.paragraph}>
          {parseBoldText(line)}
        </Text>
      );
    });

    return elements;
  };

  // Parse **bold text** into Text components
  const parseBoldText = (text: string) => {
    // Strip quotes first
    const cleanText = text.replace(/["\"\"]/g, '');

    const parts = cleanText.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <MaskedView
            key={i}
            maskElement={
              <Text style={[styles.bold, { backgroundColor: 'transparent' }]}>
                {part}
              </Text>
            }>
            <LinearGradient
              colors={['#F97316', '#EF4444']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text style={[styles.bold, { opacity: 0 }]}>{part}</Text>
            </LinearGradient>
          </MaskedView>
        );
      }
      return <Text key={i}>{part}</Text>;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push({
            pathname: '/book-results',
            params: {
              topic: topic,
              results: results,
            },
          })}>
          <Ionicons name="arrow-back" size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {bookTitle}
          </Text>
          <Text style={styles.headerAuthor}>by {bookAuthor}</Text>
          {publishedDate && (
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>{publishedDate}</Text>
            </View>
          )}

          {/* Language Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.languageScrollContainer}
            style={styles.languageScrollView}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageButton,
                  currentLang === lang.code && styles.languageButtonActive,
                ]}
                onPress={() => handleLanguageChange(lang.code as LanguageCode)}
                disabled={isTranslating}>
                <Text
                  style={[
                    styles.languageText,
                    currentLang === lang.code && styles.languageTextActive,
                  ]}>
                  {lang.symbol}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, readingTab === 'guide' && styles.tabButtonActive]}
            onPress={() => setReadingTab('guide')}>
            <Text style={[styles.tabText, readingTab === 'guide' && styles.tabTextActive]}>
              Guide
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, readingTab === 'quiz' && styles.tabButtonActive]}
            onPress={handleLoadQuiz}
            disabled={loadingQuiz}>
            <Text style={[styles.tabText, readingTab === 'quiz' && styles.tabTextActive]}>
              {loadingQuiz ? 'Loading...' : 'Quiz'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}>
        {readingTab === 'guide' ? (
          (loading || isTranslating) ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={styles.loadingText}>
                {isTranslating ? 'Translating content...' : 'Preparing your reading guide...'}
              </Text>
            </View>
          ) : (
            renderContent()
          )
        ) : (
          loadingQuiz ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={styles.loadingText}>Generating quiz questions...</Text>
            </View>
          ) : quizQuestions.length > 0 ? (
            <QuizComponent
              questions={quizQuestions}
              onComplete={() => setReadingTab('guide')}
            />
          ) : null
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  authLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  authLoadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 36,
  },
  headerAuthor: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  dateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    lineHeight: 32,
    color: '#8B5CF6',
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    lineHeight: 28,
    color: '#3B82F6',
  },
  paragraph: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 26,
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#8B5CF6',
    marginRight: 12,
    fontWeight: 'bold',
  },
  listText: {
    flex: 1,
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
  },
  spacer: {
    height: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  languageScrollView: {
    marginTop: 16,
  },
  languageScrollContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  languageButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  languageTextActive: {
    color: '#8B5CF6',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tabTextActive: {
    color: '#8B5CF6',
  },
});
