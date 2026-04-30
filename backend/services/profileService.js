import User from "../models/User.js";

// ===== PIN CODE VALIDATION =====
// Supports Indian (6 digits) and international formats
const validatePinCode = (pincode) => {
  // Indian format: 6 digits
  // International: 3-10 alphanumeric
  const pinRegex = /^[a-zA-Z0-9\s\-]{3,10}$/;
  return pinRegex.test(pincode);
};

// ===== ADDRESS VALIDATION =====
const validateAddress = (address) => {
  const { name, phone, addressLine, city, state, pincode } = address;

  if (!name || !phone || !addressLine || !city || !state || !pincode) {
    throw new Error("All address fields are required");
  }

  if (name.length < 2 || name.length > 100) {
    throw new Error("Name must be between 2-100 characters");
  }

  // Phone: 10 digits
  if (!/^[0-9]{10}$/.test(phone)) {
    throw new Error("Phone must be 10 digits");
  }

  // Validate pin code
  if (!validatePinCode(pincode)) {
    throw new Error("Invalid pin code format (must be 3-10 characters)");
  }

  return true;
};

// Get Profile
export const getProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message || "User not found");
  }
};

// Update Profile
export const updateProfile = async (userId, data) => {
  try {
    const { name, email } = data;

    // Validate if changing email
    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw new Error("Email already in use");
      }
    }

    const updateData = {
      ...(name && { name }),
      ...(email && { email: email.toLowerCase() }),
    };

    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");
  } catch (error) {
    throw new Error(error.message || "Failed to update profile");
  }
};

// Add Address
export const addAddress = async (userId, address) => {
  try {
    // Validate address
    validateAddress(address);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Auto-set as default if it's the first address
    const isFirstAddress = user.addresses.length === 0;

    const newAddress = {
      ...address,
      isDefault: isFirstAddress ? true : address.isDefault || false,
    };

    user.addresses.push(newAddress);
    await user.save();

    return user.addresses;
  } catch (error) {
    throw new Error(error.message || "Failed to add address");
  }
};

// Update Address
export const updateAddress = async (userId, index, updateData) => {
  try {
    validateAddress(updateData);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.addresses[index]) {
      throw new Error("Invalid address index");
    }

    user.addresses[index] = {
      ...user.addresses[index],
      ...updateData,
    };

    await user.save();
    return user.addresses;
  } catch (error) {
    throw new Error(error.message || "Failed to update address");
  }
};

// Delete Address
export const deleteAddress = async (userId, index) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.addresses[index]) {
      throw new Error("Invalid address index");
    }

    const deletedAddress = user.addresses[index];
    user.addresses.splice(index, 1);

    // If deleted address was default and there are still addresses
    if (deletedAddress.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true; // Auto-set first as default
    }

    await user.save();
    return user.addresses;
  } catch (error) {
    throw new Error(error.message || "Failed to delete address");
  }
};

// Set Default Address
export const setDefaultAddress = async (userId, index) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.addresses[index]) {
      throw new Error("Invalid address index");
    }

    // Reset all defaults
    user.addresses = user.addresses.map((addr, i) => ({
      ...addr,
      isDefault: i == index,
    }));

    await user.save();
    return user.addresses;
  } catch (error) {
    throw new Error(error.message || "Failed to set default address");
  }
};

// Get Default Address
export const getDefaultAddress = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const defaultAddress = user.addresses.find((addr) => addr.isDefault);

    if (!defaultAddress) {
      throw new Error("No default address set. Please add an address first.");
    }

    return defaultAddress;
  } catch (error) {
    throw new Error(error.message || "Failed to get default address");
  }
};

// Check if user has addresses (for checkout validation)
export const hasAddress = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return user.addresses.length > 0;
  } catch (error) {
    throw new Error(error.message || "Failed to check addresses");
  }
};
