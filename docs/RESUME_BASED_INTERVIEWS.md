# Resume-Based Interview System - Complete Guide

## 🎯 Overview

Your PrepMate app now includes an **AI-powered resume-based interview system** that creates personalized interview questions based on the user's actual resume, experience, and skills.

## ✨ Key Features

1. **Resume Upload** - Users can upload their resume PDF (max 5MB)
2. **Automatic Text Extraction** - AI extracts and analyzes resume content
3. **Personalized Questions** - AI asks questions about specific projects, technologies, and experiences from the resume
4. **Optional Feature** - Users can skip resume upload for generic interviews
5. **Secure Storage** - Resumes stored in Cloudinary with secure URLs

## 🔧 Setup Steps

### 1. Install Dependencies

```bash
npm install pdf-parse
```

### 2. Update Database Schema

If you're starting fresh, run the updated migration:
```sql
-- Already in 001_initial_schema.sql
```

If you have existing tables, run the update migration:
```bash
# In Supabase SQL Editor, run:
# supabase/migrations/002_add_resume_support.sql
```

Or manually run:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS resume_text TEXT;
```

### 3. Verify API Routes

The following new API routes have been added:
- `POST /api/resume/upload` - Upload resume PDF to Cloudinary
- `POST /api/resume/extract` - Extract text from uploaded PDF

### 4. Test the Flow

1. Start your dev server: `npm run dev`
2. Navigate to `/interview/new`
3. Follow the 4-step process:
   - **Step 1:** Choose interview type & difficulty
   - **Step 2:** Upload resume (optional)
   - **Step 3:** Select company & role
   - **Step 4:** Review & start

## 📋 How It Works

### User Journey

```
1. User starts new interview
   ↓
2. Selects interview type (Technical/Behavioral/System Design/Mixed)
   ↓
3. Uploads resume PDF (optional)
   - File uploaded to Cloudinary
   - Text extracted using pdf-parse
   - Resume text stored with interview
   ↓
4. Selects target company & role
   ↓
5. Reviews configuration
   ↓
6. Starts interview
   - AI receives resume context
   - Questions personalized to user's experience
```

### AI Personalization

When a resume is uploaded, the AI:

1. **References specific projects** mentioned in the resume
2. **Asks about technologies** the user has listed
3. **Probes deeper** into experiences and accomplishments
4. **Challenges assumptions** based on claimed expertise
5. **Makes it realistic** - questions feel like a real interview

**Example without resume:**
> "Can you explain how a hash table works?"

**Example with resume:**
> "I see you built a real-time chat application using Redis. Can you walk me through how you used Redis for message queueing and why you chose it over other solutions?"

## 🔒 Security & Privacy

- ✅ Resume PDFs stored securely in Cloudinary
- ✅ Only accessible by authenticated users
- ✅ Resume text never exposed to client
- ✅ User can delete resume at any time
- ✅ File size limited to 5MB
- ✅ Only PDF format accepted

## 🎨 UI Components

### Resume Upload Card
- Drag & drop interface
- Upload progress indicator
- File validation (PDF only, max 5MB)
- Success confirmation with file name
- Remove button to delete uploaded resume

### Interview Summary
Shows:
- Interview type
- Difficulty level
- **Resume status** (Uploaded ✓ or not)
- Target company
- Target role

## 🚀 Advanced Features

### Future Enhancements (Optional)

1. **Resume Templates** - Suggest resume improvements
2. **Skills Extraction** - Auto-tag skills from resume
3. **Experience Timeline** - Visualize career progression
4. **Gap Analysis** - Identify skills for target role
5. **Multi-Resume Support** - Different resumes for different roles

## 🐛 Troubleshooting

### Resume Upload Fails
- Check Cloudinary credentials in `.env.local`
- Verify file is valid PDF
- Check file size < 5MB
- Check network connection

### Text Extraction Fails
- Ensure `pdf-parse` is installed
- Check PDF is not password protected
- Verify PDF is text-based (not scanned image)

### Questions Not Personalized
- Verify resume_text is stored in database
- Check AI prompts are receiving resume context
- Review console logs for errors

## 📊 Database Schema

### Users Table
```sql
resume_url TEXT  -- Default resume URL for user
```

### Interviews Table
```sql
resume_url TEXT   -- Resume used for this interview
resume_text TEXT  -- Extracted text from resume
```

## 🔗 API Reference

### POST /api/resume/upload
Upload resume PDF to cloud storage.

**Request:**
- Body: FormData with `file` field (PDF)

**Response:**
```json
{
  "url": "https://cloudinary.com/...",
  "publicId": "prepmate/resumes/user123_1234567890"
}
```

### POST /api/resume/extract
Extract text from uploaded PDF.

**Request:**
```json
{
  "resumeUrl": "https://cloudinary.com/..."
}
```

**Response:**
```json
{
  "text": "John Doe\nSoftware Engineer...",
  "pages": 2
}
```

## ✅ Testing Checklist

- [ ] Install pdf-parse dependency
- [ ] Run database migration
- [ ] Test resume upload
- [ ] Test text extraction
- [ ] Test interview creation with resume
- [ ] Test interview creation without resume
- [ ] Verify AI asks personalized questions
- [ ] Test resume removal
- [ ] Check error handling
- [ ] Verify mobile responsiveness

## 🎉 You're Ready!

Your PrepMate app now offers a **professional, personalized interview experience** that adapts to each user's unique background!

Users will love getting questions about THEIR specific projects and experiences rather than generic questions.

---

**Need Help?** Check the console logs and error messages. Most issues are related to:
1. Missing dependencies (`npm install`)
2. Database schema not updated
3. Cloudinary credentials not configured
