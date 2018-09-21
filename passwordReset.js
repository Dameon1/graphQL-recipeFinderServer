async resetPassword(parent, args, ctx, info){
  //1 Check that this is a legit resetToken
  //2 Check that it’s not expired
  Const[user] = await ctx.db.query.users({
  Where:{
  resetToken:args.resetToken,
  resetTokenExpiry_gte: Date.now() - 3600000
  },
  });

  if(!user){
  throw new Error('This token is either invalid or expired');
  }
  
  //3 Check that the passwords match
  if(args.password !== args.confirmPassword) {
   throw new Error('Passwords do not match')}
  //4 Hash
  const password = await bcrypt.hash(args.password, 10);
  //5 Update user
  const updatedUser = await ctx.db.mutation.updatedUser({
  Where: {email:user.email},
  Data: {
  Password,
  resetToken:null,
  resetTokenExpiry:null},
  });
  return {
  Token : jwt.sign({userId: updatedUser.id},process.env.APP_SECRET),
  user:updatedUser
  }
}