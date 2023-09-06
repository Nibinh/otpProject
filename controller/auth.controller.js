const { generateOTP } = require("../config/otp");
const { sendmail } = require("../config/mail");
const User = require("../models/user");

module.exports.signUpUser = async (req, res) => {
  const data = req.body;
  console.log("ff", data);
  const { email, password } = req.body;
  const isExisting = await findUserByEmail(email);
  if (isExisting) {
    return res.send("Alredy existing");
  }
  //create newUser
  const newUser = await createUser(email, password);
  if (!newUser[0]) {
    return res.status(400).send({
      message: "Unable to create",
    });
  }
  res.send(newUser);
};

module.exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  const user = await validateUserSignUP(email, otp);
  res.send(user);
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }
  return user;
};

const createUser = async (email, password) => {
  const otpGenerated = generateOTP();
  const newUser = await User.create({
    email,
    password,
    otp: otpGenerated,
  });
  if (!newUser) {
    return [false, "Unable to sign you up"];
  }

  try {
    await sendmail({
      to: email,
      OTP: otpGenerated,
    });
    return [true, newUser];
  } catch (error) {
    return [false, "Unable to sign you up", error];
  }
};

const validateUserSignUP = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) {
    return [false, "user not found"];
  }
  if (user && user.otp !== otp) {
    return [false, "Invalid OTP"];
  }
  const updateUser = await User.findByIdAndUpdate(user._id, {
    $set: { active: true },
  });
  const userUpdated = await User.findOne({ email });
  return [true, userUpdated];
};
