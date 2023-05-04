import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import notesDataFunctions from "../data/notes.js";
import xss from "xss";
router
  .route("/:userId/:noteId")
  .get(async (req, res) => {
    let noteId = "";
    let userId = "";
    try {
      utils.checkObjectIdString(req.params.noteId);
      noteId = xss(req.params.noteId.trim());
      utils.checkObjectIdString(req.params.userId);
      userId = xss(req.params.userId.trim());
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      let note = await notesDataFunctions.get(noteId);
      return res.status(200).json(note);
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  .delete(async (req, res) => {
    let noteId = "";
    let userId = "";
    try {
      utils.checkObjectIdString(req.params.noteId);
      noteId = xss(req.params.noteId.trim());
      utils.checkObjectIdString(req.params.userId);
      userId = xss(req.params.userId.trim());
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      let note = await notesDataFunctions.delete(noteId, "");
      return res.status(200).json(note);
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })

  .put(async (req, res) => {
    //code here for PUT
    let noteId = "";
    let userId = "";
    try {
      utils.checkObjectIdString(req.params.noteId);
      noteId = xss(req.params.noteId.trim());
      utils.checkObjectIdString(req.params.userId);
      userId = xss(req.params.userId.trim());
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const notePutData = req.body;
    if (!notePutData || Object.keys(notePutData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    notePutData.textBody = xss(notePutData.textBody);
    notePutData.title = xss(notePutData.title);
    notePutData.tag = xss(notePutData.tag);
    try {
      utils.checkObjectIdString(noteId);
      let errorMessages = utils.validateNotesInputs(
        notePutData.title,
        notePutData.dateAddedTo,
        notePutData.textBody,
        notePutData.tag
      );
      if (Object.keys(errorMessages).length !== 0) {
        return res.status(400).json({ errorMessages: errorMessages });
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      const { title, dateAddedTo, textBody, tag } = notePutData;
      const updatednote = await notesDataFunctions.update(
        noteId,
        title,
        dateAddedTo,
        textBody,
        tag
      );
      return res.status(200).json(updatednote);
    } catch (e) {
      if (e.message === "Meeting Details havent Changed") {
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  });

router
  .route("/user/:userId")
  .get(async (req, res) => {
    let userId = "";
    try {
      utils.checkObjectIdString(req.params.userId);
      userId = xss(req.params.userId.trim());
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      let note = await notesDataFunctions.getAll(userId);
      return res.status(200).json(note);
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })

  .post(async (req, res) => {
    let userId = "";
    try {
      utils.checkObjectIdString(req.params.userId);
      userId = xss(req.params.userId.trim());
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const notePostData = req.body;
    if (!notePostData || Object.keys(notePostData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    notePostData.textBody = xss(notePostData.textBody);
    notePostData.title = xss(notePostData.title);
    notePostData.tag = xss(notePostData.tag);
    try {
      utils.checkObjectIdString(userId);
      utils.validateNotesInputs(
        notePostData.title,
        notePostData.dateAddedTo,
        notePostData.textBody,
        notePostData.tag
      );
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      const { title, dateAddedTo, textBody, tag } = notePostData;
      const createdNote = await notesDataFunctions.create(
        userId,
        title,
        dateAddedTo,
        textBody,
        tag
      );
      return res.status(200).json(createdNote);
    } catch (e) {
      if (e.message === "User not found.") {
        return res.status(404).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  });
import multer from "multer";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// create the directory if it doesn't exist
const uploadDirectory = "uploads";
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}
// configure multer middleware to handle multipart form data
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = xss(req.params.userId);
    const userUploadDir = path.join(uploadDirectory, userId);
    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir);
    }
    cb(null, userUploadDir);
  },
  filename: function (req, file, cb) {
    const sanitizedFilename = xss(file.originalname);
    cb(null, Date.now() + path.extname(sanitizedFilename));
  },
});
const upload = multer({ storage: storage });

router
  .route("/api/upload-image/:userId/:filename")
  .post(upload.single("image"), (req, res) => {
    try {
      utils.checkObjectIdString(req.params.userId);
      const userId = xss(req.params.userId);
      if (userId !== req.session.user.user_id)
        throw new Error("You dont have permission to access that image");
    } catch (error) {
      return res.status(403).send(error.message);
    }
    const file = req.file;
    if (!file) {
      return res.status(400).send("No image file");
    }
    return res.status(200).json({
      location: `/notes/api/upload-image/${xss(req.params.userId)}/${xss(
        file.filename
      )}`,
    });
  })
  .get((req, res) => {
    //add error case for file not found
    try {
      utils.checkObjectIdString(req.params.userId);
      const userId = xss(req.params.userId);
      if (userId !== req.session.user.user_id)
        throw new Error("You dont have permission to access that image");

      const file = path.join(
        __dirname,
        `../uploads/${userId}/${xss(req.params.filename)}`
      );
      return res.sendFile(file);
    } catch (error) {
      return res.status(403).json({ error: error.message });
    }
  });

export default router;
