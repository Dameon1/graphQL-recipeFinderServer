'use strict';
//************** NOT BEING USED YET *****************/
async resetPassword(parent, args, ctx, info) {
  //1 Check that this is a legit resetToken
  //2 Check that it’s not expired
  const [user] = await ctx.db.query.users({
    where: {
      resetToken: args.resetToken,
      resetTokenExpiry_gte: Date.now() - 3600000
    },
  });

  if (!user) {
    throw new Error('This token is either invalid or expired');
  }

  //3 Check that the passwords match
  if (args.password !== args.confirmPassword) {
    throw new Error('Passwords do not match')
  }
  //4 Hash
  const password = await bcrypt.hash(args.password, 10);
  //5 Update user
  const updatedUser = await ctx.db.mutation.updatedUser({
    where: {
      email: user.email
    },
    data: {
      password,
      resetToken: null,
      resetTokenExpiry: null
    },
  });
  return {
    token: jwt.sign({
      userId: updatedUser.id
    }, process.env.APP_SECRET),
    user: updatedUser
  }
}