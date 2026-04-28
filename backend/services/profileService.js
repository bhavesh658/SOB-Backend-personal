import User from "../models/User.js";

// Get Profile
export const getProfile = async (userId) => {
  try {
    return await User.findById(userId).select("-password");
  } catch (error) {
    throw new Error("User not found");
  }
};


//  Update Profile
export const updateProfile = async (userId, data) => {
  try {
    return await User.findByIdAndUpdate(userId, data, {
      new: true
    }).select("-password");
  } catch (error) {
    throw new Error("User not found");
  }
};


//  Add Address
export const addAddress = async (userId, address) => {
  try {
    const user = await User.findById(userId);
    

  user.addresses.push(address);

    await user.save();
     return user.addresses;
  } catch (error) {
    throw new Error("User not found");
  }

 
};


//  Delete Address
export const deleteAddress = async (userId, index) => {
  try {
    const user = await User.findById(userId);

  if (!user.addresses[index]) {
    throw new Error("Invalid address index");
  }

  user.addresses.splice(index, 1);

  await user.save();

    return user.addresses;
  } catch (error) {
    throw new Error("User not found");
  }
};


//  Set Default Address
export const setDefaultAddress = async (userId, index) => { 
  try {
  const user = await User.findById(userId);

  user.addresses = user.addresses.map((addr, i) => ({
    ...addr,
    isDefault: i == index
  }));

  await user.save();

  return user.addresses;
} catch (error) {
    throw new Error("User not found");
  } 
};