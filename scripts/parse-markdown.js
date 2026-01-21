const fs = require('fs');
const path = require('path');
const readline = require('readline');

const inputFile = path.join(__dirname, '../../CompTIA A+ Certification Study Guide, Eleventh Edition (Exams 220-1101 & 220-1102).md');
const outputFile = path.join(__dirname, '../src/assets/questions.json');

// Ensure assets directory exists
const assetsDir = path.dirname(outputFile);
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const questions = new Map(); // Key: "chapter-number" -> Question Object

let currentChapter = '';
let currentSection = 'NONE'; // 'QUESTIONS' or 'ANSWERS'
let currentQuestion = null;
let currentOptionKey = null;

const rl = readline.createInterface({
  input: fs.createReadStream(inputFile),
  crlfDelay: Infinity
});

// Regex Patterns
const questionStartRegex = /^\*\*\[(\d+)\]\((.*?)\)\.\*\*\s+(.*)$/;
const optionStartRegex = /^([A-E])\.\s+(.*)$/;
const answerStartRegex = /^\*\*\[(\d+)\]\((.*?)\)\.\*\*\s+\*\*([A-E])\.\*\*\s+(.*)$/;
const chapterRegex = /^##\s+Chapter\s+(\d+)/i;
const sectionQARegex = /^\*\*Q &A\*\*\s+Self Test/i;
// The text has "**Q &A** Self Test", let's be flexible
const sectionQARegexFlexible = /^\*\*Q\s?&A\*\*\s+Self Test/i;
const sectionAnswersRegex = /Self Test Answers/i;

function getUniqueId(link) {
    // link format: ch1.xhtml#ch1ques17 or ch1.xhtml#r_ch1ques17
    // Extract ch1ques17
    const match = link.match(/([a-z0-9]+ques\d+)/);
    if (match) return match[1].replace('r_', '');
    return link;
}

rl.on('line', (line) => {
  line = line.trim();
  if (!line) return;

  // Detect Chapter
  const chapterMatch = line.match(chapterRegex);
  if (chapterMatch) {
    currentChapter = chapterMatch[1];
    return;
  }

  // Detect Section Change
  if (sectionQARegexFlexible.test(line)) {
    currentSection = 'QUESTIONS';
    currentQuestion = null;
    currentOptionKey = null;
    return;
  }
  
  if (sectionAnswersRegex.test(line) && !line.includes('(')) { // Avoid matching links like [Self Test Answers](...)
    currentSection = 'ANSWERS';
    return;
  }

  if (currentSection === 'QUESTIONS') {
    // Try to match start of a question
    const qMatch = line.match(questionStartRegex);
    if (qMatch) {
      const [_, num, link, text] = qMatch;
      const id = getUniqueId(link);
      
      currentQuestion = {
        id: id,
        number: num,
        chapter: currentChapter || 'Unknown',
        text: text,
        options: [],
        correctAnswer: '',
        explanation: ''
      };
      questions.set(id, currentQuestion);
      currentOptionKey = null;
      return;
    }

    if (currentQuestion) {
      // Try to match start of an option
      const optMatch = line.match(optionStartRegex);
      if (optMatch) {
        const [_, key, text] = optMatch;
        currentQuestion.options.push({ key, text });
        currentOptionKey = key;
      } else if (currentOptionKey) {
        // Append to current option (multiline option)
        const opt = currentQuestion.options.find(o => o.key === currentOptionKey);
        if (opt) opt.text += ' ' + line;
      } else {
        // Append to question text (multiline question)
        currentQuestion.text += ' ' + line;
      }
    }
  } 
  else if (currentSection === 'ANSWERS') {
    // Try to match start of an answer
    const ansMatch = line.match(answerStartRegex);
    if (ansMatch) {
        const [_, num, link, correctKey, explanationStart] = ansMatch;
        const id = getUniqueId(link);
        const q = questions.get(id);
        
        if (q) {
            q.correctAnswer = correctKey;
            q.explanation = explanationStart;
            currentQuestion = q; // Re-use currentQuestion to append explanation
        } else {
            currentQuestion = null; // Answer for unknown question
        }
        return;
    }

    if (currentQuestion) {
        // Append to explanation
        currentQuestion.explanation += ' ' + line;
    }
  }
});

rl.on('close', () => {
  const questionsArray = Array.from(questions.values()).filter(q => q.options.length > 0 && q.correctAnswer);
  
  fs.writeFileSync(outputFile, JSON.stringify(questionsArray, null, 2));
  console.log(`Parsed ${questionsArray.length} questions.`);
});
