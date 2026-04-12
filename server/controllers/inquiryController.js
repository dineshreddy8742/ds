import * as inquiryService from '../services/inquiryService.js';

export const submitInquiry = async (req, res, next) => {
  try {
    const inquiry = await inquiryService.createInquiry(req.body);
    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. We will contact you soon.',
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

export const getInquiries = async (req, res, next) => {
  try {
    const inquiries = await inquiryService.getAllInquiries();
    res.json({
      success: true,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await inquiryService.updateInquiryStatus(id, status);
    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};
