import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { TopicCard } from './components/TopicCard';
import { LiveModal } from './components/LiveModal';
import { BookResultCard } from './components/BookResultCard';
import { QuizComponent } from './components/QuizComponent';
import { generateBookContent } from './services/gemini';
import { TOPICS, LANGUAGES } from './constants';
import { Topic, ViewMode, AIState, Book, QuizQuestion, LanguageCode } from './types';
import { Search, Loader2, Sparkles, ChevronRight, BookOpen, Brain, Lightbulb, ArrowLeft, GraduationCap, Languages } from 'lucide-react';

// Helper to parse inline bold markdown from **text** to <strong>text</strong>
const parseFormattedText = (text: string) => {
  if (!text) return null;
  // Split by bold markers
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, index) => {
    // Even indices are regular text, odd are bold (captured group)
    if (index % 2 === 1) {
      return <strong key={index} className="font-bold text-stone-900">{part}</strong>;
    }
    return part;
  });
};

export default function App() {
  const [view, setView] = useState<ViewMode>(ViewMode.HOME);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tabs state for Reading View
  const [readingTab, setReadingTab] = useState<'guide' | 'quiz'>('guide');

  // Translation State
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [contentCache, setContentCache] = useState<Record<string, string>>({});

  // AI Content State - Separated to prevent "Global" changes when translating
  const [topicState, setTopicState] = useState<AIState>({
    isLoading: false,
    text: '',
    groundingChunks: []
  });

  const [bookState, setBookState] = useState<AIState>({
    isLoading: false,
    text: '',
    groundingChunks: []
  });

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  const handleTopicClick = async (topic: Topic) => {
    setActiveTopic(topic);
    setView(ViewMode.TOPIC_RESULT);
    setTopicState({ isLoading: true, text: '', groundingChunks: [] });
    
    // Initial fetch for the topic
    try {
      const prompt = `
        I am interested in the topic: "${topic.label}". 
        Please recommend 5 highly-rated books in this category, prioritizing recent publications if relevant, but classics are okay too.
        
        CRITICAL FORMATTING INSTRUCTION:
        Format each book entry exactly like this:
        ### <Title> by <Author> | <Published Date>
        <Summary>

        Use Google Search to ensure the books are real, highly rated, and the published dates are correct.
      `;
      const { text, groundingChunks } = await generateBookContent(prompt);
      setTopicState({ isLoading: false, text, groundingChunks });
    } catch (e) {
      setTopicState({ isLoading: false, text: "Sorry, I couldn't fetch recommendations right now.", groundingChunks: [] });
    }
  };

  const handleCustomSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setActiveTopic({ id: 'custom', label: searchQuery, icon: 'Search', color: 'bg-stone-100 text-stone-700' });
    setView(ViewMode.TOPIC_RESULT);
    setTopicState({ isLoading: true, text: '', groundingChunks: [] });

    try {
      const prompt = `
        I am looking for books about: "${searchQuery}". 
        Please recommend 3-5 best books that match this query.
        
        CRITICAL FORMATTING INSTRUCTION:
        Format each book entry exactly like this:
        ### <Title> by <Author> | <Published Date>
        <Summary>

        Use Google Search to find the most relevant and popular ones and verify published dates.
      `;
      const { text, groundingChunks } = await generateBookContent(prompt);
      setTopicState({ isLoading: false, text, groundingChunks });
    } catch (e) {
      setTopicState({ isLoading: false, text: "Sorry, search failed.", groundingChunks: [] });
    }
  };

  const handleDeepDive = async (query: string) => {
    setTopicState(prev => ({ ...prev, isLoading: true }));
    try {
      const prompt = `
        Analyze the following request in the context of our current topic (${activeTopic?.label}): 
        "${query}"
        Provide a detailed explanation, key insights, and perhaps a quiz question at the end.
      `;
      const { text, groundingChunks } = await generateBookContent(prompt);
      setTopicState({ isLoading: false, text, groundingChunks });
    } catch (e) {
      setTopicState(prev => ({ ...prev, isLoading: false, text: prev.text + "\n\n[Error fetching details]" }));
    }
  };

  const handleReadBook = async (book: Book) => {
    setActiveBook(book);
    setView(ViewMode.READING);
    setReadingTab('guide');
    setQuizQuestions([]); // Reset quiz
    setCurrentLang('en'); // Reset language
    setContentCache({}); // Reset cache
    setBookState({ isLoading: true, text: '', groundingChunks: [] });

    try {
      const prompt = `
        I want to read and understand the book "${book.title}" by "${book.author}".
        
        Please provide a comprehensive "Read With Me" guide that includes:
        1. A detailed synopsis of the book's core argument or plot.
        2. "Chapter 1 Simulation": Summarize the opening chapter or key starting concepts to give me a feel for reading it.
        3. Key Themes & Takeaways.
        4. A "Discussion Question" for me to think about.

        Use Google Search to ensure accuracy of the plot and themes.
      `;
      const { text, groundingChunks } = await generateBookContent(prompt);
      setBookState({ isLoading: false, text, groundingChunks });
      setContentCache({ 'en': text }); // Cache original English
    } catch (e) {
       setBookState({ isLoading: false, text: "Sorry, I couldn't load the book details right now.", groundingChunks: [] });
    }
  };

  const handleLanguageChange = async (langCode: LanguageCode) => {
    if (langCode === currentLang) return;
    setCurrentLang(langCode);

    // If cached, use it
    if (contentCache[langCode]) {
      setBookState(prev => ({ ...prev, text: contentCache[langCode] }));
      return;
    }

    // If not cached, translate
    const originalText = contentCache['en'];
    if (!originalText) return;

    setBookState(prev => ({ ...prev, isLoading: true }));

    try {
      const targetLang = LANGUAGES.find(l => l.code === langCode)?.native || langCode;
      const prompt = `
        Translate the following markdown text into ${targetLang}. 
        IMPORTANT: Maintain all Markdown formatting exactly (headers ##, bold **, lists *, etc.).
        Do not shorten the content. Translate it fully and accurately.
        
        Content to translate:
        ${originalText}
      `;
      
      // We don't need search for translation, and jsonMode is false
      const { text } = await generateBookContent(prompt, { useSearch: false });
      
      setContentCache(prev => ({ ...prev, [langCode]: text }));
      setBookState(prev => ({ ...prev, isLoading: false, text }));
    } catch (e) {
      console.error("Translation error", e);
      setBookState(prev => ({ ...prev, isLoading: false }));
      // Revert to English if failed? Or just stay on loading? 
      // Let's just alert (or show in text) and revert UI
      alert("Translation failed. Please try again.");
      setCurrentLang(currentLang); // Revert to previous
    }
  };

  const handleLoadQuiz = async () => {
    if (!activeBook) return;
    setIsQuizLoading(true);
    
    try {
      const prompt = `
        Create a 5-question multiple choice quiz about the book "${activeBook.title}" by "${activeBook.author}".
        
        Return the result as a raw JSON array. 
        Each object in the array should have:
        - "question": string
        - "options": array of 4 strings
        - "answer": integer (0-3 index of correct option)
        - "explanation": string (brief explanation of why the answer is correct)

        Do NOT use markdown code blocks. Just return the JSON.
      `;
      
      // Use jsonMode: true which disables search but enforces JSON structure
      const { text } = await generateBookContent(prompt, { jsonMode: true });
      
      // Clean potential markdown just in case
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(jsonStr);
      setQuizQuestions(data);
    } catch (e) {
      console.error("Quiz Error", e);
      // Fallback manual error question if parsing fails
      setQuizQuestions([{
        question: "We encountered an error generating the quiz. Please try again.",
        options: ["Retry"],
        answer: 0,
        explanation: "Error in generation."
      }]);
    } finally {
      setIsQuizLoading(false);
    }
  };

  // Extract books from the formatted AI response (Topic State)
  const parsedBooks = useMemo(() => {
    if (!topicState.text) return [];
    
    const books: Book[] = [];
    const lines = topicState.text.split('\n');
    let currentBook: Partial<Book> | null = null;

    lines.forEach(line => {
      if (line.trim().startsWith('###')) {
        // Save previous book if exists
        if (currentBook && currentBook.title && currentBook.author) {
          books.push(currentBook as Book);
        }
        
        // Parse new header: ### Title by Author | Date
        const cleanLine = line.replace(/^###\s*/, '').trim();
        
        let titleAndAuthor = cleanLine;
        let publishedDate = '';

        // Check for date separator '|'
        if (cleanLine.includes('|')) {
          const splitDate = cleanLine.split('|');
          publishedDate = splitDate.pop()?.trim() || '';
          titleAndAuthor = splitDate.join('|').trim();
        }

        // Split Title by Author
        const parts = titleAndAuthor.split(/ by /i);
        if (parts.length >= 2) {
          const author = parts.pop(); // Last part is author
          const title = parts.join(' by '); // Rejoin rest as title just in case
          currentBook = { 
            title: title?.trim(), 
            author: author?.trim(), 
            publishedDate: publishedDate,
            description: '' 
          };
        } else {
           // Fallback if "by" isn't found perfectly
           currentBook = { 
             title: titleAndAuthor, 
             author: 'Unknown', 
             publishedDate: publishedDate,
             description: '' 
           };
        }
      } else if (currentBook) {
        // Append to description if it's not a markdown header or empty line
        if (line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('[')) {
           // Remove bold markers from description preview if present
           const cleanDesc = line.replace(/\*\*/g, '');
           currentBook.description = (currentBook.description + ' ' + cleanDesc).trim();
        }
      }
    });

    // Push last book
    if (currentBook && currentBook.title && currentBook.author) {
      books.push(currentBook as Book);
    }

    return books;
  }, [topicState.text]);

  const renderContent = () => {
    if (view === ViewMode.HOME) {
      return (
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto mt-8">
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-stone-800 tracking-tight">
              What do you want to read today?
            </h2>
            <p className="text-lg text-stone-500 font-sans">
              Discover your next favorite book with AI-powered insights, real-time search, and voice conversations.
            </p>
            
            <form onSubmit={handleCustomSearch} className="relative max-w-lg mx-auto mt-8">
              <input 
                type="text" 
                placeholder="Search for a topic, genre, or specific book..."
                className="w-full px-6 py-4 rounded-full bg-white border border-stone-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-sans text-stone-800 placeholder:text-stone-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {TOPICS.map(topic => (
              <TopicCard key={topic.id} topic={topic} onClick={handleTopicClick} />
            ))}
          </div>
        </div>
      );
    }

    if (view === ViewMode.TOPIC_RESULT) {
      return (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <button 
              onClick={() => setView(ViewMode.HOME)} 
              className="flex items-center text-sm text-stone-500 hover:text-indigo-600 font-sans font-medium mb-4"
            >
              <ChevronRight className="rotate-180" size={16} /> Back to Topics
            </button>
            
            <div className={`p-6 rounded-2xl ${activeTopic?.color} bg-opacity-10 border border-stone-100`}>
              <h2 className="text-2xl font-serif font-bold mb-2">{activeTopic?.label}</h2>
              <p className="text-sm opacity-80 font-sans">AI Curated List</p>
            </div>

            <div className="space-y-2 font-sans">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Quick Actions</p>
              <button 
                onClick={() => handleDeepDive("Generate a quiz about this topic")}
                className="w-full text-left px-4 py-3 rounded-xl bg-white border border-stone-200 hover:border-indigo-300 hover:shadow-sm transition-all flex items-center gap-2 text-stone-700 text-sm"
              >
                <Brain size={16} className="text-purple-500" />
                Take a Quiz
              </button>
              <button 
                onClick={() => handleDeepDive("Explain the key themes and history of this genre")}
                className="w-full text-left px-4 py-3 rounded-xl bg-white border border-stone-200 hover:border-indigo-300 hover:shadow-sm transition-all flex items-center gap-2 text-stone-700 text-sm"
              >
                <Lightbulb size={16} className="text-amber-500" />
                Key Themes
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {topicState.isLoading ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <Loader2 size={40} className="animate-spin text-indigo-600" />
                <p className="text-stone-500 font-sans animate-pulse">Consulting the library...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Books Grid - Only show if we parsed any books */}
                {parsedBooks.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-serif font-bold text-stone-800 mb-4 flex items-center gap-2">
                      <BookOpen size={24} className="text-indigo-600" />
                      Select a book to read
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {parsedBooks.map((book, idx) => (
                        <BookResultCard key={idx} book={book} onRead={handleReadBook} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 min-h-[50vh]">
                   <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Full Overview</h4>
                   {/* Render Main AI Text with Formatting */}
                   <div className="prose prose-stone max-w-none prose-headings:font-serif prose-p:font-serif prose-p:text-lg prose-a:text-indigo-600">
                     {topicState.text.split('\n').map((line, i) => {
                       const cleanLine = line.trim();
                       if (!cleanLine) return <br key={i} />;

                       if (cleanLine.startsWith('###')) {
                          return <h3 key={i} className="text-xl font-bold mt-6 mb-3 text-stone-800">{parseFormattedText(cleanLine.replace(/^###\s*/, ''))}</h3>;
                       }
                       if (cleanLine.startsWith('##')) {
                          return <h2 key={i} className="text-2xl font-bold mt-6 mb-3 text-stone-800">{parseFormattedText(cleanLine.replace(/^##\s*/, ''))}</h2>;
                       }
                       // Handle lines that are purely bold as headers/emphasis
                       if (cleanLine.startsWith('**') && cleanLine.endsWith('**') && cleanLine.length < 100) {
                          return <h3 key={i} className="text-xl font-bold mt-4 mb-2 text-stone-800">{cleanLine.replace(/\*\*/g, '')}</h3>;
                       }
                       if (cleanLine.startsWith('* ') || cleanLine.startsWith('- ')) {
                          return <li key={i} className="ml-4 list-disc marker:text-indigo-400 pl-2">{parseFormattedText(cleanLine.replace(/^[*|-]\s/, ''))}</li>;
                       }
                       
                       return <p key={i} className="leading-relaxed text-stone-700 mb-4">{parseFormattedText(line)}</p>;
                     })}
                   </div>

                   {/* Grounding Sources */}
                   {topicState.groundingChunks.length > 0 && (
                     <div className="mt-12 pt-8 border-t border-stone-100">
                       <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                         <Sparkles size={14} /> Sources
                       </h4>
                       <div className="flex flex-wrap gap-2">
                         {topicState.groundingChunks.map((chunk, i) => {
                           if (!chunk.web?.uri) return null;
                           return (
                             <a 
                               key={i} 
                               href={chunk.web.uri} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-xs bg-stone-100 hover:bg-indigo-50 text-stone-600 hover:text-indigo-700 px-3 py-1 rounded-full transition-colors border border-stone-200 truncate max-w-[200px]"
                             >
                               {chunk.web.title || chunk.web.uri}
                             </a>
                           );
                         })}
                       </div>
                     </div>
                   )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (view === ViewMode.READING) {
      return (
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setView(ViewMode.TOPIC_RESULT)} 
            className="flex items-center text-sm text-stone-500 hover:text-indigo-600 font-sans font-medium mb-6"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Recommendations
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden min-h-[80vh]">
             {/* Book Header */}
             <div className="bg-indigo-900 text-white p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <BookOpen size={200} />
                </div>
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                      <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">{activeBook?.title}</h1>
                      <p className="text-xl md:text-2xl font-serif italic opacity-90">by {activeBook?.author}</p>
                      {activeBook?.publishedDate && (
                        <div className="inline-block mt-4 bg-white/10 px-4 py-2 rounded-lg text-sm font-sans backdrop-blur-sm border border-white/10">
                          {activeBook.publishedDate}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tabs & Language Controls */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mt-8 gap-4">
                     <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setReadingTab('guide')}
                          className={`px-4 py-2 rounded-full text-sm font-sans font-medium transition-all ${
                            readingTab === 'guide' 
                            ? 'bg-white text-indigo-900' 
                            : 'bg-indigo-800/50 text-indigo-100 hover:bg-indigo-800'
                          }`}
                        >
                          <span className="flex items-center gap-2"><BookOpen size={16} /> Guide</span>
                        </button>
                        <button 
                          onClick={() => {
                            setReadingTab('quiz');
                            if (quizQuestions.length === 0) handleLoadQuiz();
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-sans font-medium transition-all ${
                            readingTab === 'quiz' 
                            ? 'bg-white text-indigo-900' 
                            : 'bg-indigo-800/50 text-indigo-100 hover:bg-indigo-800'
                          }`}
                        >
                          <span className="flex items-center gap-2"><GraduationCap size={16} /> Quiz</span>
                        </button>
                     </div>
                     
                     {/* Language Selector - Only show in guide tab */}
                     {readingTab === 'guide' && (
                       <div className="flex items-center gap-2 bg-indigo-800/30 p-1 rounded-full">
                         <div className="px-3 text-indigo-200">
                           <Languages size={16} />
                         </div>
                         <div className="flex gap-1">
                           {LANGUAGES.map(lang => (
                             <button
                               key={lang.code}
                               onClick={() => handleLanguageChange(lang.code as LanguageCode)}
                               className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all ${
                                 currentLang === lang.code
                                 ? 'bg-white/90 text-indigo-900 shadow-sm'
                                 : 'text-indigo-200 hover:bg-white/10'
                               }`}
                             >
                               {lang.native}
                             </button>
                           ))}
                         </div>
                       </div>
                     )}
                  </div>
                </div>
             </div>

             <div className="p-8 md:p-12">
               {readingTab === 'guide' && (
                 bookState.isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                      <Loader2 size={40} className="animate-spin text-indigo-600" />
                      <p className="text-stone-500 font-sans">
                        {currentLang === 'en' ? 'Generating your reading guide...' : 'Translating content...'}
                      </p>
                    </div>
                 ) : (
                   <>
                     <div className="prose prose-lg prose-indigo max-w-none font-serif">
                       {bookState.text.split('\n').map((line, i) => {
                          const cleanLine = line.trim();
                          if (!cleanLine) return <br key={i} />;

                          if (cleanLine.startsWith('##')) {
                            return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-stone-800">{parseFormattedText(cleanLine.replace(/^##\s*/, ''))}</h2>;
                          }
                          if (cleanLine.startsWith('###')) {
                            return <h3 key={i} className="text-xl font-bold mt-6 mb-3 text-stone-800">{parseFormattedText(cleanLine.replace(/^###\s*/, ''))}</h3>;
                          }
                          // Handle purely bold lines as emphasis/subheads
                          if (cleanLine.startsWith('**') && cleanLine.endsWith('**') && cleanLine.length < 100) {
                            return <h3 key={i} className="text-xl font-bold mt-4 mb-2 text-stone-800">{cleanLine.replace(/\*\*/g, '')}</h3>;
                          }
                          if (cleanLine.startsWith('* ') || cleanLine.startsWith('- ')) {
                            return <li key={i} className="ml-4 pl-2 list-disc">{parseFormattedText(cleanLine.replace(/^[*|-]\s/, ''))}</li>;
                          }
                          
                          return <p key={i} className="mb-4 text-stone-700 leading-relaxed">{parseFormattedText(line)}</p>;
                       })}
                     </div>
                     
                     {/* Grounding for Reading Mode - Always show grounding, even if translated */}
                     {bookState.groundingChunks.length > 0 && (
                       <div className="mt-12 pt-8 border-t border-stone-100">
                         <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">References (Original)</h4>
                         <div className="flex flex-wrap gap-2">
                           {bookState.groundingChunks.map((chunk, i) => chunk.web?.uri && (
                             <a key={i} href={chunk.web.uri} target="_blank" className="text-xs text-stone-400 hover:underline">{chunk.web.title}</a>
                           ))}
                         </div>
                       </div>
                     )}
                   </>
                 )
               )}

               {readingTab === 'quiz' && (
                 isQuizLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 size={40} className="animate-spin text-indigo-600" />
                    <p className="text-stone-500 font-sans">Preparing your exam...</p>
                  </div>
                 ) : (
                   <QuizComponent questions={quizQuestions} onRetry={handleLoadQuiz} />
                 )
               )}
             </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout 
      onLiveClick={() => setIsLiveOpen(true)}
      goHome={() => setView(ViewMode.HOME)}
    >
      {renderContent()}
      <LiveModal isOpen={isLiveOpen} onClose={() => setIsLiveOpen(false)} />
    </Layout>
  );
}