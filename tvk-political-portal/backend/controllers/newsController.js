import News from "../models/News.js";

export const getNews = async (req, res) => {
  try {
    const news = await News.find({ isPublished: true }).sort({ publishedAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createNews = async (req, res) => {
  try {
    const news = await News.create(req.body);
    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateNews = async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: "News deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
