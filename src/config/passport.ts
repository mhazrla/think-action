import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserEntity } from "@src/modules/users/model/user.entity";

passport.serializeUser<UserEntity, any>((user, done) => {
  done(null, user);
});

passport.deserializeUser<UserEntity, any>((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const user: UserEntity = {
        _id: profile.id,
        email: profile.emails ? profile.emails[0].value : "",
        name: profile.displayName,
      };

      done(null, user);
    }
  )
);

export default passport;
