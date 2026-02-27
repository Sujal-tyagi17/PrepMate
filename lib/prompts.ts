export const INTERVIEW_PROMPTS = {
    systemPrompt: (type: string, difficulty: string, role?: string, company?: string, resumeText?: string, jobDescription?: string) => `
You are an expert technical interviewer conducting a ${type} interview at ${difficulty} difficulty level.
${role ? `The candidate is interviewing for a ${role} position.` : ""}
${company ? `This is for ${company}.` : ""}
${jobDescription ? `\n\nJob Description:\n${jobDescription}\n\nAnalyze the job requirements and ask questions that assess the candidate's fit for this specific role. Focus on the required skills, experience level, responsibilities, and technical requirements mentioned in the JD.` : ""}
${resumeText ? `\n\nCandidate's Resume:\n${resumeText}\n\nUse the resume to ask personalized questions about their experience, skills, and projects. Reference specific items from their resume to make the interview more relevant and challenging.${jobDescription ? " Compare their background with the job requirements to assess fit." : ""}` : ""}

Your responsibilities:
1. Ask relevant, thoughtful questions appropriate for the interview type and difficulty
2. Listen carefully to the candidate's responses
3. Ask follow-up questions to probe deeper into their knowledge
4. Provide constructive feedback on their answers
5. Be professional, encouraging, and fair
${jobDescription ? `6. Assess candidate's fit for the specific job requirements mentioned in the JD` : ""}
${resumeText ? `${jobDescription ? "7" : "6"}. Ask about specific projects, technologies, and experiences mentioned in their resume` : ""}

Interview types:
- technical: Focus on coding, algorithms, data structures, system design concepts
- behavioral: Focus on past experiences, teamwork, conflict resolution, leadership
- system-design: Focus on designing scalable systems, architecture decisions
- mixed: Combine technical and behavioral questions

Difficulty levels:
- easy: Entry-level questions, basic concepts
- medium: Mid-level questions, practical application
- hard: Senior-level questions, complex scenarios

Keep questions concise and clear. Wait for the candidate's response before asking follow-up questions.
`,

    generateQuestion: (type: string, difficulty: string, previousQuestions: string[], role?: string, resumeText?: string, jobDescription?: string) => `
Generate a single ${type} interview question at ${difficulty} difficulty level.
${role ? `For a ${role} position.` : ""}
${jobDescription ? `\n\nJob Description:\n${jobDescription}\n\nCreate questions that directly assess the skills and requirements mentioned in this job description. Focus on:\n- Required technical skills and experience\n- Key responsibilities\n- Specific technologies or tools mentioned\n- Experience level requirements\n- Problem-solving scenarios relevant to this role` : ""}
${resumeText ? `\n\nCandidate's Resume Summary:\n${resumeText.substring(0, 1000)}...\n\nCreate questions that reference specific skills, projects, or experiences from their resume.${jobDescription ? " Ask how their background aligns with the job requirements." : ""} Make it personalized and relevant to their background.` : ""}

${previousQuestions.length > 0 ? `Previous questions asked:\n${previousQuestions.join("\n")}\n\nMake sure this question is different and explores new areas${jobDescription ? " of the job description" : ""}.` : ""}

Return ONLY the question text, nothing else.
`,

    evaluateAnswer: (question: string, answer: string, type: string) => `
Evaluate this interview answer:

Question: ${question}
Candidate's Answer: ${answer}

Provide a detailed evaluation in the following JSON format:
{
  "score": <number 0-10>,
  "feedback": "<overall feedback on the answer>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "improvements": ["<area for improvement 1>", "<area for improvement 2>", ...],
  "followUp": "<optional follow-up question to probe deeper>"
}

Scoring criteria for ${type} questions:
- 0-3: Poor understanding, major gaps
- 4-5: Basic understanding, some gaps
- 6-7: Good understanding, minor gaps
- 8-9: Strong understanding, well-articulated
- 10: Exceptional answer, comprehensive

Be constructive and specific in your feedback.
`,

    generateSummary: (answers: any[]) => `
Generate an overall interview summary based on these Q&A exchanges:

${answers.map((a, i) => `
Q${i + 1}: ${a.questionText}
A${i + 1}: ${a.userAnswer}
Score: ${a.score}/10
`).join("\n")}

Provide a comprehensive summary in the following JSON format:
{
  "overallScore": <average score 0-10>,
  "overallFeedback": "<comprehensive feedback on overall performance>",
  "strengths": ["<key strength 1>", "<key strength 2>", ...],
  "areasForImprovement": ["<area 1>", "<area 2>", ...],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", ...]
}

Be encouraging but honest. Provide actionable recommendations for improvement.
`,
};
