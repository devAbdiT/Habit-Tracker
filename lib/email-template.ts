export function getReminderEmailTemplate(taskTitle: string, scheduledTime: string, appUrl: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Habit Reminder</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { border: 1px solid #eaeaea; border-radius: 8px; padding: 32px; text-align: center; }
        .header { margin-bottom: 24px; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 8px; color: #111; }
        .time { font-size: 18px; color: #666; margin-bottom: 32px; }
        .button { display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 16px; margin-bottom: 24px; }
        .footer { font-size: 12px; color: #999; margin-top: 32px; border-top: 1px solid #eaeaea; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title">Time for your habit: ${taskTitle}</div>
          <div class="time">Scheduled for ${scheduledTime}</div>
        </div>
        
        <p>This is a quick reminder to complete your habit today to keep your streak going!</p>
        
        <a href="${appUrl}" class="button">Log Habit Now</a>
        
        <div class="footer">
          <p>You received this email because you have email reminders enabled for this habit.</p>
          <p>To stop receiving these emails, update your notification settings in the app.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
