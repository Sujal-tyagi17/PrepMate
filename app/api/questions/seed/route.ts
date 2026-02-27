import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const sampleQuestions = [
    // Technical Questions
    {
        text: "Explain the difference between var, let, and const in JavaScript.",
        category: "technical",
        difficulty: "easy",
        tags: ["javascript", "fundamentals", "variables"],
        sample_answer: "var is function-scoped and can be redeclared, let is block-scoped and cannot be redeclared, const is block-scoped and cannot be reassigned.",
    },
    {
        text: "What is the time complexity of binary search?",
        category: "technical",
        difficulty: "easy",
        tags: ["algorithms", "complexity", "search"],
        sample_answer: "O(log n) - Binary search divides the search space in half with each iteration.",
    },
    {
        text: "Implement a function to reverse a linked list.",
        category: "technical",
        difficulty: "medium",
        tags: ["data-structures", "linked-list", "coding"],
        sample_answer: "Iterate through the list, reversing the pointers. Keep track of previous, current, and next nodes.",
    },
    {
        text: "Design a URL shortening service like bit.ly.",
        category: "system-design",
        difficulty: "hard",
        tags: ["system-design", "scalability", "databases"],
        sample_answer: "Use a hash function to generate short codes, store mappings in a database, implement caching for popular URLs, use load balancers for scalability.",
    },
    {
        text: "Explain how React hooks work and why they were introduced.",
        category: "technical",
        difficulty: "medium",
        tags: ["react", "hooks", "frontend"],
        sample_answer: "Hooks allow functional components to use state and lifecycle features. They were introduced to simplify component logic and enable better code reuse.",
    },

    // Behavioral Questions
    {
        text: "Tell me about a time when you had to deal with a difficult team member.",
        category: "behavioral",
        difficulty: "medium",
        tags: ["teamwork", "conflict-resolution", "communication"],
        sample_answer: "Use the STAR method: Situation, Task, Action, Result. Focus on how you resolved the conflict professionally.",
    },
    {
        text: "Describe a project where you had to learn a new technology quickly.",
        category: "behavioral",
        difficulty: "easy",
        tags: ["learning", "adaptability", "growth"],
        sample_answer: "Explain the context, your learning approach, challenges faced, and the successful outcome.",
    },
    {
        text: "How do you handle disagreements with your manager?",
        category: "behavioral",
        difficulty: "medium",
        tags: ["communication", "leadership", "conflict"],
        sample_answer: "Emphasize respectful communication, data-driven arguments, and willingness to compromise while maintaining professionalism.",
    },
    {
        text: "Tell me about your biggest professional failure and what you learned from it.",
        category: "behavioral",
        difficulty: "hard",
        tags: ["growth", "resilience", "self-awareness"],
        sample_answer: "Be honest, show accountability, explain lessons learned, and demonstrate how you've grown from the experience.",
    },
    {
        text: "Describe a situation where you had to work under tight deadlines.",
        category: "behavioral",
        difficulty: "easy",
        tags: ["time-management", "pressure", "prioritization"],
        sample_answer: "Explain your prioritization strategy, how you managed stress, and the successful delivery of the project.",
    },

    // More Technical Questions
    {
        text: "What is the difference between SQL and NoSQL databases?",
        category: "technical",
        difficulty: "easy",
        tags: ["databases", "sql", "nosql"],
        sample_answer: "SQL databases are relational with fixed schemas, NoSQL databases are non-relational with flexible schemas. SQL is better for complex queries, NoSQL for scalability.",
    },
    {
        text: "Explain the concept of closures in JavaScript.",
        category: "technical",
        difficulty: "medium",
        tags: ["javascript", "closures", "scope"],
        sample_answer: "A closure is a function that has access to variables in its outer scope, even after the outer function has returned.",
    },
    {
        text: "How would you optimize a slow database query?",
        category: "technical",
        difficulty: "medium",
        tags: ["databases", "optimization", "performance"],
        sample_answer: "Add indexes, analyze query execution plan, optimize joins, denormalize if needed, use caching, limit result sets.",
    },
    {
        text: "Design a rate limiter for an API.",
        category: "system-design",
        difficulty: "hard",
        tags: ["system-design", "api", "scalability"],
        sample_answer: "Use token bucket or sliding window algorithm, implement with Redis for distributed systems, consider different rate limits per user/endpoint.",
    },
    {
        text: "What are the SOLID principles?",
        category: "technical",
        difficulty: "medium",
        tags: ["oop", "design-patterns", "principles"],
        sample_answer: "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion - principles for maintainable OOP code.",
    },
];

export async function POST(req: NextRequest) {
    try {
        const supabase = createClient();

        // Clear existing questions
        const { error: deleteError } = await supabase
            .from('questions')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (deleteError) {
            console.error("Error clearing questions:", deleteError);
        }

        // Insert sample questions
        const { error: insertError } = await supabase
            .from('questions')
            .insert(sampleQuestions);

        if (insertError) {
            console.error("Error inserting questions:", insertError);
            return NextResponse.json(
                { error: "Failed to seed questions" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${sampleQuestions.length} questions`,
            count: sampleQuestions.length,
        });
    } catch (error) {
        console.error("Error seeding questions:", error);
        return NextResponse.json(
            { error: "Failed to seed questions" },
            { status: 500 }
        );
    }
}
