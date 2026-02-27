# Prep Mate - AI Interview Preparation Platform

An AI-powered interview preparation application built with Next.js, TypeScript, and OpenAI. Practice mock interviews, get instant AI feedback, and track your progress with comprehensive analytics.

## ✨ Features

### 🎯 AI-Powered Mock Interviews
- **Multiple Interview Types**: Technical, Behavioral, System Design, and Mixed
- **Difficulty Levels**: Easy, Medium, and Hard
- **Real-time Chat Interface**: Natural conversation flow with AI interviewer
- **Instant Feedback**: Get scored evaluations (0-10) with detailed feedback
- **Dynamic Questions**: AI generates contextual follow-up questions based on your answers

### 📚 Question Bank
- **Extensive Library**: Pre-loaded with 15+ sample interview questions
- **Smart Filtering**: Search and filter by category, difficulty, tags, and company
- **Sample Answers**: Learn from example responses
- **Practice Mode**: Practice individual questions with AI feedback

### 📊 Analytics Dashboard
- **Performance Metrics**: Track total interviews, questions answered, and average scores
- **Visual Charts**: Performance trends and category breakdowns using Recharts
- **Strengths & Weaknesses**: AI-identified patterns in your interview performance
- **Interview History**: Review past interviews and scores

### 👤 User Management
- **Clerk Authentication**: Secure authentication with Clerk (email/password, OAuth)
- **Profile Management**: Edit your profile information
- **Secure Sessions**: JWT-based authentication with automatic session management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Gemini API key (free) OR Groq API key (free)
- Clerk account for authentication

### Installation

1. **Clone the repository** (or you already have it)
   ```bash
   cd "c:\Users\tyagi\Desktop\prep mate"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # Database
   MONGODB_URI=mongodb://localhost:27017/prepmate
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prepmate

   # Clerk Authentication (get from https://clerk.com)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   CLERK_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # AI API (at least one REQUIRED - both are FREE)
   GEMINI_API_KEY=your-gemini-api-key-here  # Get from https://ai.google.dev
   GROQ_API_KEY=your-groq-api-key-here      # Get from https://console.groq.com

   # Cloudinary (OPTIONAL - for image uploads)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### First-Time Setup

1. **Sign Up**: Create an account at `/signup`
2. **Seed Questions**: Go to `/questions` and click "Seed Questions" to populate the question bank
3. **Start Interview**: Click "Start Interview" on the dashboard to begin your first mock interview

## 📁 Project Structure

```
prep mate/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/       # Main dashboard
│   │   ├── interview/       # Interview pages
│   │   ├── questions/       # Question bank
│   │   ├── analytics/       # Analytics dashboard
│   │   └── profile/         # User profile
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── interview/      # Interview CRUD & AI
│   │   ├── questions/      # Question management
│   │   ├── analytics/      # Analytics data
│   │   └── user/           # User profile
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── error.tsx           # Error boundary
│   └── not-found.tsx       # 404 page
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── interview/          # Interview-specific components
│   ├── questions/          # Question components
│   └── providers/          # Context providers
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # MongoDB connection
│   ├── openai.ts          # OpenAI client
│   ├── prompts.ts         # AI prompt templates
│   └── utils.ts           # Utility functions
├── models/                # MongoDB schemas
│   ├── User.ts
│   ├── Interview.ts
│   └── Question.ts
└── types/                 # TypeScript definitions
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CVA (Class Variance Authority)
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **AI**: OpenAI GPT-3.5/GPT-4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Validation**: Zod

## 🎨 Key Features Explained

### AI Interview Flow
1. User selects interview type and difficulty
2. AI generates first question based on configuration
3. User submits answer
4. AI evaluates answer, provides score (0-10) and feedback
5. AI generates next question based on conversation context
6. Process repeats until user ends interview
7. Interview saved to database with all Q&A pairs

### Question Bank
- Pre-seeded with technical, behavioral, and system design questions
- Each question includes category, difficulty, tags, and sample answer
- Users can search and filter to find relevant questions
- Click any question to view details and sample answers

### Analytics
- Aggregates data from all completed interviews
- Calculates average scores, trends, and patterns
- Identifies common strengths and areas for improvement
- Visualizes performance with interactive charts

## 🔐 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT-based session management
- Protected API routes with authentication checks
- Middleware for route protection
- Environment variables for sensitive data

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Interviews
- `POST /api/interview/create` - Create new interview
- `GET /api/interview/[id]` - Get interview details
- `PATCH /api/interview/[id]` - Update interview
- `POST /api/interview/[id]/question` - Generate AI question
- `POST /api/interview/[id]/evaluate` - Evaluate answer with AI

### Questions
- `GET /api/questions` - List questions (with filters)
- `GET /api/questions/[id]` - Get question details
- `POST /api/questions/seed` - Seed sample questions

### Analytics & Profile
- `GET /api/analytics` - Get user analytics
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile

## 🎯 Usage Tips

1. **Start with Easy Difficulty**: Get comfortable with the AI interview format
2. **Seed Questions First**: Populate the question bank before browsing
3. **Review Analytics**: Check your performance trends regularly
4. **Practice Regularly**: Consistency improves interview skills
5. **Read Feedback**: AI feedback provides valuable insights

## 🐛 Troubleshooting

### OpenAI API Errors
- Verify your API key is correct in `.env.local`
- Check your OpenAI account has credits
- Ensure API key has proper permissions

### Database Connection Issues
- Verify MongoDB is running (if local)
- Check MONGODB_URI is correct
- For Atlas, ensure IP is whitelisted

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run lint`

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📧 Support

For issues or questions, please check the troubleshooting section above.

---

**Built with ❤️ using Next.js and OpenAI**
