import User from "../models/user.model.js";

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({success : true, data : users});
  } catch (error) {
    next(error);
  }
};
const getUser = async (req, res, next) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }

    res.status(200).json({success : true, data : user});
  } catch (error) {
    next(error);
  }
};

export default { getUsers, getUser };