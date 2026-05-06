import * as profileService from "../../services/profileService.js";

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await profileService.getProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const user = await profileService.updateProfile(
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add Address
export const addAddress = async (req, res) => {
  try {
    const addresses = await profileService.addAddress(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: addresses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update Address
export const updateAddress = async (req, res) => {
  try {
    const { index } = req.params;
    const addresses = await profileService.updateAddress(
      req.user.id,
      parseInt(index),
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: addresses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Address
export const deleteAddress = async (req, res) => {
  try {
    const addresses = await profileService.deleteAddress(
      req.user.id,
      parseInt(req.params.index)
    );

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: addresses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Set Default Address
export const setDefaultAddress = async (req, res) => {
  try {
    const addresses = await profileService.setDefaultAddress(
      req.user.id,
      parseInt(req.params.index)
    );

    res.status(200).json({
      success: true,
      message: "Default address updated",
      data: addresses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get Default Address
export const getDefaultAddress = async (req, res) => {
  try {
    const defaultAddress = await profileService.getDefaultAddress(req.user.id);

    res.status(200).json({
      success: true,
      data: defaultAddress
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Check if user has address (for checkout)
export const checkHasAddress = async (req, res) => {
  try {
    const hasAddress = await profileService.hasAddress(req.user.id);

    res.status(200).json({
      success: true,
      hasAddress: hasAddress
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};