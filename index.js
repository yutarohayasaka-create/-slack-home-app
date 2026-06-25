const { App, ExpressReceiver } = require('@slack/bolt');

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

receiver.router.post('/slack/events', (req, res) => {
  if (req.body && req.body.challenge) {
    return res.json({ challenge: req.body.challenge });
  }
});

app.event('app_home_opened', async ({ event, client }) => {
  await client.views.publish({
    user_id: event.user,
    view: {
      type: 'home',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '📎 社内資料リンク',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*よく使う資料はこちらからアクセスできます*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '📄 *a-資料集（ミドルオフィス）*\n社内の重要資料をまとめたリンク集です',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '開く',
            },
            url: 'YOUR_RESOURCE_LINK',
          },
        },
      ],
    },
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('App is running!');
})();
