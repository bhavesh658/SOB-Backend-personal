import * as profileService from "../../services/profileService.js";

//  Get Profile
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
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};


//  Update Profile
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
      message: "Failed to update profile",
      error: error.message
    });
  }
};


//  Add Address
export const addAddress = async (req, res) => {
  try {
    const addresses = await profileService.addAddress(
      
      req.user.id,
      req.body
    );
   

    res.status(200).json({
      success: true,
      message: "Address added successfully",
      data: addresses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add address",
      error: error.message
    });
  }
};


//  Delete Address
export const deleteAddress = async (req, res) => {
  try {
    const addresses = await profileService.deleteAddress(
      req.user.id,
      req.params.index
    );

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: addresses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message
    });
  }
};


// Set Default Address
export const setDefaultAddress = async (req, res) => {
  try {
    const addresses = await profileService.setDefaultAddress(
      req.user.id,
      req.params.index
    );

    res.status(200).json({
      success: true,
      message: "Default address updated",
      data: addresses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to set default address",
      error: error.message
    });
  }
};