import GoogleProvider from "next-auth/providers/google";

export const NEXT_AUTH  = {
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID || "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
          authorization: {
            params: {
              scope: 'profile email openid https://www.googleapis.com/auth/gmail.readonly',
            },
          },
        })
      ],
      secret: process.env.NEXTAUTH_SECRET,
      callbacks: {

       async session({ session, token }: { session: any; token: any }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      return session;
    },
        async jwt({ token, account }: { token: any; account: any }) {
            if (account) {
              token.accessToken = account.access_token;
              token.refreshToken = account.refresh_token;
            }
            return token;
        },
      }
}