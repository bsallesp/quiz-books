const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, '../../CompTIA A+ Certification Study Guide, Eleventh Edition (Exams 220-1101 & 220-1102).md');
const outputFilePath = path.join(__dirname, '../src/assets/questions.json');

console.log(`Reading file from: ${inputFilePath}`);

try {
    const content = fs.readFileSync(inputFilePath, 'utf-8');
    const lines = content.split(/\r?\n/);

    const questions = [];
    let currentChapter = 'Unknown Chapter';
    let currentQuestion = null;
    let mode = 'SCANNING'; // SCANNING, QUESTIONS, ANSWERS
            let answerMap = new Map(); // Map<questionNumber, {correctAnswer, explanation}>
            let currentAnswer = null;
            
            // Temporary storage for the current chapter's questions before we merge answers
    let chapterQuestions = [];

    // Regex patterns
    const chapterRegex = /^##\s+(Chapter\s+\d+|[0-9]+\s+.*)/i;
    const questionStartRegex = /^\*\*\[(\d+)\]\(.*?\)\.\*\*\s+(.*)/;
    const optionRegex = /^([A-D])\.\s+(.*)/;
    const answerSectionRegex = /###\s+.*SELF TEST ANSWERS/i;
    const answerStartRegex = /^\*\*\[(\d+)\]\(.*?\)\.\*\*\s+(.*)/;
    const answerPrefixRegex = /^((?:\*\*.*?\*\*|\s|and|,)+)(.*)/;
    
    // Helper to save current question
    const saveCurrentQuestion = () => {
        if (currentQuestion) {
            chapterQuestions.push(currentQuestion);
            currentQuestion = null;
        }
    };

    // Helper to process chapter change
    const finishChapter = () => {
        saveCurrentQuestion();
        
        // Merge answers into questions
        chapterQuestions.forEach(q => {
            const ans = answerMap.get(q.localId);
            if (ans) {
                q.correctAnswer = ans.correctAnswer;
                q.explanation = ans.explanation;
            } else {
                console.warn(`Warning: No answer found for Chapter "${q.chapter}" Question ${q.localId}`);
            }
            questions.push(q);
        });

        // Reset for next chapter
        chapterQuestions = [];
        answerMap.clear();
        mode = 'SCANNING';
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Check for Chapter Header
        const chapterMatch = line.match(chapterRegex);
        if (chapterMatch) {
            finishChapter(); // Finish previous chapter
            currentChapter = chapterMatch[1].trim();
            console.log(`Processing ${currentChapter}...`);
            continue;
        }

        // Check for Answer Section
        if (answerSectionRegex.test(line)) {
            saveCurrentQuestion(); // Finish any pending question
            mode = 'ANSWERS';
            continue;
        }

        if (mode === 'ANSWERS') {
            // Parsing Answers
            const ansMatch = line.match(answerStartRegex);
            if (ansMatch) {
                const qNum = ansMatch[1];
                const rest = ansMatch[2];
                
                let correct = '';
                let explanation = rest;

                // Try to split answer keys from explanation
                const splitMatch = rest.match(answerPrefixRegex);
                if (splitMatch) {
                    const answerPart = splitMatch[1];
                    const potentialExplanation = splitMatch[2];
                    
                    // Extract A-D from answerPart
                    const keys = answerPart.match(/[A-D]/g);
                    if (keys && keys.length > 0) {
                        correct = keys.join(',');
                        explanation = potentialExplanation;
                    }
                } 
                
                if (!correct) {
                     // Fallback: try to extract first bolded letter
                     const fallbackMatch = rest.match(/^\*\*([A-D])\.\*\*\s+(.*)/);
                     if (fallbackMatch) {
                         correct = fallbackMatch[1];
                         explanation = fallbackMatch[2];
                     }
                }

                answerMap.set(qNum, {
                    correctAnswer: correct,
                    explanation: explanation
                });
                
                // Determine current answer object for appending text
                currentAnswer = answerMap.get(qNum);
            } else if (currentAnswer) {
                // Append text to explanation if it's not a new answer or header
                // Heuristic: if line starts with **[digit], it's a new answer (handled above)
                // If line starts with #, it's a header
                if (!line.match(/^\*\*\[\d+\]/) && !line.startsWith('#')) {
                    currentAnswer.explanation += ' ' + line;
                }
            }
        } else {
            // Parsing Questions (Default or Explicit QUESTIONS mode)
            // Note: Questions appear before the Answer section in each chapter
            
            const qMatch = line.match(questionStartRegex);
            if (qMatch) {
                saveCurrentQuestion();
                const qNum = qMatch[1];
                const text = qMatch[2];
                
                currentQuestion = {
                    id: `${currentChapter.replace(/\s+/g, '-')}-q${qNum}`,
                    localId: qNum,
                    chapter: currentChapter,
                    text: text,
                    options: [],
                    correctAnswer: '', // Will be filled later
                    explanation: ''    // Will be filled later
                };
            } else if (currentQuestion) {
                const optMatch = line.match(optionRegex);
                if (optMatch) {
                    currentQuestion.options.push({
                        key: optMatch[1],
                        text: optMatch[2]
                    });
                } else {
                    // Append to question text or option text
                    // If we have options, append to the last option
                    if (currentQuestion.options.length > 0) {
                        currentQuestion.options[currentQuestion.options.length - 1].text += ' ' + line;
                    } else {
                        // Append to question text
                        // Check if it's a header or something else
                        if (!line.startsWith('#')) {
                            currentQuestion.text += ' ' + line;
                        }
                    }
                }
            }
        }
    }

    // Finish last chapter
    finishChapter();

    console.log(`Parsed ${questions.length} questions.`);
    
    // Write to file
    fs.writeFileSync(outputFilePath, JSON.stringify(questions, null, 2));
    console.log(`Successfully wrote to ${outputFilePath}`);

} catch (err) {
    console.error('Error parsing markdown:', err);
}
