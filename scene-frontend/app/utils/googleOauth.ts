
export const getGoogleOAuthUrl = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  
    const options = {
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!, // Django backend callback
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
      ].join(" "),
    };
  
    const qs = new URLSearchParams(options).toString();
    return `${rootUrl}?${qs}`;
  };