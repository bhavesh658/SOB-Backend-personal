import Banner from "../models/Banner.js";


//  Create Banner
export const createBanner = async (req, res) => {
  try {
    const { redirectUrl } = req.body;
    const images = req.files?.map(file => file.filename) || [];

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required"
      });
    }

    const banner = await Banner.create({
      image: images[0], // Assuming only one banner image is allowed
      redirectUrl
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating banner",
      error: error.message
    });
  }
};


//  Get All Banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching banners",
      error: error.message
    });
  }
};


//  Update Banner (toggle active / edit link)
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    const { redirectUrl, isActive } = req.body;

    banner.redirectUrl = redirectUrl || banner.redirectUrl;

    if (typeof isActive === "boolean") {
      banner.isActive = isActive;
    }

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: banner
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating banner",
      error: error.message
    });
  }
};


//  Delete Banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting banner",
      error: error.message
    });
  }
};