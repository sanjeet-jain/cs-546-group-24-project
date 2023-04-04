import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import notesDataFunctions from "../data/notes.js";
import constants from "../constants/constants.js";
router
  .route("/note/:noteId")
  .get(async (req, res) => {
    let noteId = "";
    try {
      utils.checkObjectIdString(req.params.noteId);
      noteId = req.params.noteId.trim();
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
    try {
      utils.checkObjectIdString(req.params.noteId);
      noteId = req.params.noteId.trim();
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
    try {
      utils.checkObjectIdString(req.params.noteId);
      noteId = req.params.noteId.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const notePutData = req.body;
    if (!notePutData || Object.keys(notePutData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    try {
      //validation
      utils.checkObjectIdString(notePutData.noteId);
      // utils.checkObjectIdString(userId);
      this.validateStringInput(
        notePutData.title,
        "title",
        constants.stringLimits["title"]
      );
      this.validateDate(notePutData.dateAddedTo, "DateAddedTo");
      // textbody?
      //doc links ?
      this.validateStringInput(
        notePutData.tag,
        "tag",
        constants.stringLimits["tag"]
      );
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      const { title, dateAddedTo, textBody, tag, documentLinks } = notePutData;
      const updatednote = await notesDataFunctions.update(
        // userId,
        noteId,
        title,
        dateAddedTo,
        textBody,
        tag,
        documentLinks
      );
      return res.status(200).json(updatednote);
    } catch (e) {
      if (
        e.message === "Error: same object passed for update with no changes"
      ) {
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  });

router
  .route("notes/:userId/")
  .get(async (req, res) => {
    let userId = "";
    try {
      utils.checkObjectIdString(req.params.userId);
      userId = req.params.noteId.trim();
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
    //code here for PUT
    let userId = "";
    try {
      utils.checkObjectIdString(req.params.userId);
      userId = req.params.noteId.trim();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const notePostData = req.body;
    if (!notePostData || Object.keys(notePostData).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    try {
      //validation
      utils.checkObjectIdString(notePostData.noteId);
      // utils.checkObjectIdString(userId);
      this.validateStringInput(
        notePostData.title,
        "title",
        constants.stringLimits["title"]
      );
      this.validateDate(notePostData.dateAddedTo, "DateAddedTo");
      // textbody?
      //doc links ?
      this.validateStringInput(
        notePostData.tag,
        "tag",
        constants.stringLimits["tag"]
      );
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    try {
      const { title, dateAddedTo, textBody, tag, documentLinks } = notePostData;
      const createdNote = await notesDataFunctions.create(
        userId,
        title,
        dateAddedTo,
        textBody,
        tag,
        documentLinks
      );
      return res.status(200).json(createdNote);
    } catch (e) {
      if (e.message === "User not found.") {
        return res.status(404).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  });
