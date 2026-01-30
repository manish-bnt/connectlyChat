function welcomeEmail(username) {
  return {
    subject: `Welcome to Our App 🎉`,
    html: `
      <h2>Welcome, ${username} 👋</h2>
      <p>We're excited to have you with use.</p>
      <p>Feel free to explore the app.</p>
      <br />
      <p>Team Connectly</p>
    `
  }
}

module.exports = welcomeEmail