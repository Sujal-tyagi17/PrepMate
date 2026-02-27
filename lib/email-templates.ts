/**
 * Email templates for PrepMate notifications
 */

const baseStyles = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
`;

const buttonStyles = `
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(to right, #8b5cf6, #d946ef);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin: 20px 0;
`;

export const emailTemplates = {
    /**
     * Daily interview reminder
     */
    dailyReminder: (name: string, streakDays?: number) => ({
        subject: '🔥 Keep your interview streak alive!',
        html: `
            <div style="${baseStyles} max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #8b5cf6; margin: 0;">PrepMate</h1>
                </div>
                
                <h2 style="color: #1f2937;">Hi ${name}! 👋</h2>
                
                ${streakDays ? `
                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #92400e;">
                            <strong>🔥 ${streakDays} day streak!</strong> Don't break it now!
                        </p>
                    </div>
                ` : ''}
                
                <p>Your interview skills won't improve themselves! Take a few minutes today to practice.</p>
                
                <p><strong>Quick practice session:</strong></p>
                <ul>
                    <li>5-10 minute technical questions</li>
                    <li>Instant AI feedback</li>
                    <li>Track your progress over time</li>
                </ul>
                
                <div style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/interview/new" 
                       style="${buttonStyles}">
                        Start Interview Now
                    </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                    Keep practicing, keep improving! 💪
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    You're receiving this because you enabled interview reminders.<br/>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/profile?section=notifications" 
                       style="color: #8b5cf6;">Manage notification preferences</a>
                </p>
            </div>
        `
    }),

    /**
     * Score improvement notification
     */
    scoreUpdate: (name: string, newScore: number, previousScore: number) => {
        const improvement = newScore - previousScore;
        const isImprovement = improvement > 0;
        
        return {
            subject: isImprovement 
                ? '📈 Your interview score improved!' 
                : '📊 Interview Score Update',
            html: `
                <div style="${baseStyles} max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #8b5cf6; margin: 0;">PrepMate</h1>
                    </div>
                    
                    <h2 style="color: #1f2937;">${isImprovement ? 'Great job' : 'Keep going'}, ${name}! ${isImprovement ? '🎉' : '💪'}</h2>
                    
                    <div style="background: ${isImprovement ? '#d1fae5' : '#fef3c7'}; 
                                border-left: 4px solid ${isImprovement ? '#10b981' : '#f59e0b'}; 
                                padding: 20px; 
                                margin: 20px 0; 
                                border-radius: 4px;">
                        <p style="margin: 0; font-size: 18px; color: #1f2937;">
                            Your average score ${isImprovement ? 'increased' : 'changed'} from 
                            <strong>${previousScore}%</strong> to 
                            <strong style="color: ${isImprovement ? '#059669' : '#d97706'};">${newScore}%</strong>
                            ${isImprovement ? `(+${improvement}%)` : `(${improvement}%)`}
                        </p>
                    </div>
                    
                    ${isImprovement ? `
                        <p>You're making excellent progress! Your consistent practice is paying off.</p>
                        <p><strong>Keep the momentum going:</strong></p>
                        <ul>
                            <li>Try harder difficulty questions</li>
                            <li>Focus on your weaker areas</li>
                            <li>Maintain your practice streak</li>
                        </ul>
                    ` : `
                        <p>Every interview is a learning opportunity. Review your recent feedback to identify areas for improvement.</p>
                    `}
                    
                    <div style="text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/analytics" 
                           style="${buttonStyles}">
                            View Detailed Analytics
                        </a>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                    
                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/profile?section=notifications" 
                           style="color: #8b5cf6;">Manage notification preferences</a>
                    </p>
                </div>
            `
        };
    },

    /**
     * New feature announcement
     */
    newFeature: (name: string, featureTitle: string, featureDescription: string) => ({
        subject: `🎁 New Feature: ${featureTitle}`,
        html: `
            <div style="${baseStyles} max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #8b5cf6; margin: 0;">PrepMate</h1>
                </div>
                
                <h2 style="color: #1f2937;">Hi ${name}! 🎉</h2>
                
                <div style="background: linear-gradient(to right, #f3e8ff, #fae8ff); 
                            padding: 20px; 
                            border-radius: 8px; 
                            margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #7c3aed;">✨ ${featureTitle}</h3>
                    <p style="margin-bottom: 0;">${featureDescription}</p>
                </div>
                
                <p>We're constantly improving PrepMate to help you ace your interviews!</p>
                
                <div style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/dashboard" 
                       style="${buttonStyles}">
                        Try It Now
                    </a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/profile?section=notifications" 
                       style="color: #8b5cf6;">Manage notification preferences</a>
                </p>
            </div>
        `
    }),

    /**
     * Weekly interview tip
     */
    weeklyTip: (name: string, tip: string, tipTitle?: string) => ({
        subject: '💡 Weekly Interview Tip from PrepMate',
        html: `
            <div style="${baseStyles} max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #8b5cf6; margin: 0;">PrepMate</h1>
                </div>
                
                <h2 style="color: #1f2937;">Hi ${name}! 💡</h2>
                
                <p>Here's your weekly tip to improve your interview skills:</p>
                
                <div style="background: #eff6ff; 
                            border-left: 4px solid #3b82f6; 
                            padding: 20px; 
                            margin: 20px 0; 
                            border-radius: 4px;">
                    ${tipTitle ? `<h3 style="margin-top: 0; color: #1e40af;">${tipTitle}</h3>` : ''}
                    <p style="margin-bottom: 0; font-size: 16px;">${tip}</p>
                </div>
                
                <p>Want to put this into practice?</p>
                
                <div style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/interview/new" 
                       style="${buttonStyles}">
                        Start Practicing
                    </a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/profile?section=notifications" 
                       style="color: #8b5cf6;">Manage notification preferences</a>
                </p>
            </div>
        `
    }),

    /**
     * Welcome email for new users
     */
    welcome: (name: string) => ({
        subject: 'Welcome to PrepMate! 🎯',
        html: `
            <div style="${baseStyles} max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #8b5cf6; margin: 0; font-size: 36px;">PrepMate</h1>
                    <p style="color: #6b7280; margin-top: 8px;">AI-Powered Interview Preparation</p>
                </div>
                
                <h2 style="color: #1f2937;">Welcome, ${name}! 🎉</h2>
                
                <p>We're thrilled to have you on PrepMate. Get ready to ace your next interview with AI-powered practice sessions!</p>
                
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #1f2937;">🚀 Get Started:</h3>
                    <ol style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Complete your profile and select your focus areas</li>
                        <li style="margin-bottom: 10px;">Take your first AI interview</li>
                        <li style="margin-bottom: 10px;">Review detailed feedback and improve</li>
                        <li>Track your progress over time</li>
                    </ol>
                </div>
                
                <div style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/interview/new" 
                       style="${buttonStyles}">
                        Start Your First Interview
                    </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                    💪 Practice makes perfect. Start today!
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    Questions? Reply to this email or visit our help center.<br/>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/profile?section=notifications" 
                       style="color: #8b5cf6;">Manage notification preferences</a>
                </p>
            </div>
        `
    })
};
