
import  GoogleProvider  from 'next-auth/providers/google';

export const NEXT_AUTH = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/gmail.readonly',
        },
      },
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({token, account}:{ account: any, token: any }) {
      if (account) {
        token = Object.assign({}, token, { access_token: account.access_token });
      }
      
      return token
    },
    async session({session, token}: { session: any, token: any }) {
    if(session) {
      session = Object.assign({}, session, {access_token: token.access_token})
    }
    return session
}  }
}