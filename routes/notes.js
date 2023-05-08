import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import notesDataFunctions from "../data/notes.js";
import xss from "xss";
import dayjs from "dayjs";
router
  .route("/:userId/:noteId")
  .get(utils.validateUserId, async (req, res) => {
    let noteId = "";
    let userId = "";
    try {
      utils.checkObjectIdString(xss(req.params.noteId));
      noteId = xss(req.params.noteId.trim());
      utils.checkObjectIdString(xss(req.params.userId));
      userId = req.params.userId.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      let note = await notesDataFunctions.get(noteId, userId);
      return res.status(200).json(note);
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  .delete(utils.validateUserId, async (req, res) => {
    let noteId = "";
    let userId = "";
    try {
      utils.checkObjectIdString(xss(req.params.noteId));
      noteId = req.params.noteId.trim();
      utils.checkObjectIdString(xss(req.params.userId));
      userId = req.params.userId.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      let note = await notesDataFunctions.delete(noteId, userId);
      return res.status(200).json(note);
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  .put(utils.validateUserId, async (req, res) => {
    //code here for PUT
    let noteId = "";
    let userId = "";
    try {
      utils.checkObjectIdString(xss(req.params.noteId));
      noteId = xss(req.params.noteId.trim());
      utils.checkObjectIdString(xss(req.params.userId));
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
    notePutData.dateAddedTo = dayjs(xss(notePutData.dateAddedTo)).format(
      "YYYY-MM-DDTHH:MM"
    );
    try {
      utils.checkObjectIdString(noteId);
      let errorMessages = utils.validateNotesInputs(
        notePutData.title,
        notePutData.dateAddedTo,
        notePutData.textBody,
        notePutData.tag
      );

      if (
        typeof notePutData.tag === "string" &&
        notePutData.tag.trim().length > 0
      ) {
        notePutData.tag = notePutData.tag.trim();
      } else {
        notePutData.tag = "notes";
      }

      if (Object.keys(errorMessages).length !== 0) {
        return res.status(400).json({ errorMessages: errorMessages });
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      const { title, dateAddedTo, textBody, tag } = notePutData;
      const updatednote = await notesDataFunctions.update(
        userId,
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
  .get(utils.validateUserId, async (req, res) => {
    let userId = "";
    try {
      utils.checkObjectIdString(xss(req.params.userId));
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
  .post(utils.validateUserId, async (req, res) => {
    //code here for PUT
    let userId = "";
    try {
      utils.checkObjectIdString(xss(req.params.userId));
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
    notePostData.dateAddedTo = dayjs(xss(notePostData.dateAddedTo)).format(
      "YYYY-MM-DDTHH:MM"
    );
    try {
      //validation
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
    if (typeof tag === "string" && tag.trim().length > 0) {
      notePostData.tag = notePostData.tag.trim();
    } else {
      notePostData.tag = "notes";
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
    const userUploadDir = path.join(uploadDirectory, req.params.userId);
    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir);
    }
    cb(null, userUploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router
  .route("/api/upload-image/:userId/:filename")
  .post(utils.validateUserId, upload.single("image"), (req, res) => {
    try {
      utils.checkObjectIdString(xss(req.params.userId));
      const userId = xss(req.params.userId.trim());
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
      location: `/notes/api/upload-image/${req.params.userId}/${file.filename}`,
    });
  })
  .get(utils.validateUserId, (req, res) => {
    //add error case for file not found
    try {
      utils.checkObjectIdString(xss(req.params.userId));
      const userId = xss(req.params.userId.trim());
      if (userId !== req.session.user.user_id)
        throw new Error("You dont have permission to access that image");

      const file = path.join(
        __dirname,
        `../uploads/${req.params.userId}/${req.params.filename}`
      );
      return res.sendFile(file);
    } catch (error) {
      return res.status(403).json({ error: error.message });
    }
  });
router
  .route("/:userId/:noteId/dateAddedto")
  .put(utils.validateUserId, async (req, res) => {
    //code here for PUT
    let noteId = "";
    let userId = "";
    try {
      utils.checkObjectIdString(xss(req.params.noteId));
      noteId = xss(req.params.noteId.trim());
      utils.checkObjectIdString(xss(req.params.userId));
      userId = xss(req.params.userId.trim());
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const notePutData = await notesDataFunctions.get(noteId, userId);
    if (!notePutData || Object.keys(notePutData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    const previousDate = dayjs(notePutData.dateAddedTo).format("YYYY-M-D");
    try {
      notePutData.textBody = xss(notePutData.textBody);
      notePutData.title = xss(notePutData.title);
      notePutData.tag = xss(notePutData.tag);
      notePutData.dateAddedTo = dayjs(
        xss(req?.body?.dateAddedTo?.trim())
      ).format("YYYY-MM-DDTHH:mm");
      let errorMessages = utils.validateNotesInputs(
        notePutData.title,
        notePutData.dateAddedTo,
        notePutData.textBody,
        notePutData.tag
      );

      if (
        typeof notePutData.tag === "string" &&
        notePutData.tag.trim().length > 0
      ) {
        notePutData.tag = notePutData.tag.trim();
      } else {
        notePutData.tag = "notes";
      }

      if (Object.keys(errorMessages).length !== 0) {
        return res.status(400).json({ errorMessages: errorMessages });
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      const { title, dateAddedTo, textBody, tag } = notePutData;
      const updatednote = await notesDataFunctions.update(
        userId,
        noteId,
        title,
        dateAddedTo,
        textBody,
        tag
      );
      return res.status(200).json({
        userId: userId,
        taskId: updatednote._id,
        previousDate,
      });
    } catch (e) {
      if (e.message === "note Details havent Changed") {
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  });

export default router;
