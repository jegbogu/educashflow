import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "ali@gmail.com", type: "text", placeholder: "ali@gmail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          const { email, password, role } = credentials
   
          const response = await fetch('https://www.eduquizzglobal.com/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, role}),
            headers: {
              'Content-type': 'application/json'
            },
  
          });
          if(!response.ok){
            throw new Error('Password Or Email is not Correct')
            
          }
          let user = await response.json()
  
          if (response.ok && user) {
            return user;
          } else return null;
        } catch (error) {
         
          return;
        }
       

      },
    }),


  ],

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user._id
      token.email = user.email
      token.fullname = user.fullname
      token.username = user.username
      token.role = user.role
      token.level = user.level
      token.activate = user.activate
      token.createdAt = user.createdAt
      token.spaceOne = user.spaceOne
      token.amountMade = user.amountMade
      token.points = user.points
      token.membership = user.membership
      token.playedGames = user.playedGames
      token.usergames = user.usergames
    }
    return token
  },

  async session({ session, token }) {
    session.user = {
      id: token.id,
      email: token.email,
      fullname: token.fullname,
      username: token.username,
      role: token.role,
      level: token.level,
      activate: token.activate,
      createdAt: token.createdAt,
      spaceOne: token.spaceOne,
      amountMade: token.amountMade,
      points: token.points,
      membership: token.membership,
      playedGames: token.playedGames,
      usergames: token.usergames
    }
    return session
  }
},
  jwt: {
    secret: ' ep&lqwaiFX$R',
    encryption: true,
    maxAge: 60 * 60, // ⏰ 1 hour in seconds
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // ⏰ 1 hour in seconds
  },
  pages:{
      signIn: "../../login"
    }
};

export default NextAuth(authOptions)