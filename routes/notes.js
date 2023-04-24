import { Router } from "express";
const router = Router();
import utils from "../utils/utils.js";
import notesDataFunctions from "../data/notes.js";

router
  .route("/:userId/:noteId")
  .get(async (req, res) => {
    let noteId = "";
    let userId = "";
    try {
      utils.checkObjectIdString(req.params.noteId);
      noteId = req.params.noteId.trim();
      utils.checkObjectIdString(req.params.userId);
      userId = req.params.userId.trim();
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
      noteId = req.params.noteId.trim();
      utils.checkObjectIdString(req.params.userId);
      userId = req.params.userId.trim();
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
      noteId = req.params.noteId.trim();
      utils.checkObjectIdString(req.params.userId);
      userId = req.params.userId.trim();
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
      utils.checkObjectIdString(noteId);
      // utils.checkObjectIdString(userId);
      utils.validateNotesInputs(
        notePutData.title,
        notePutData.dateAddedTo,
        notePutData.textBody,
        notePutData.tag,
        notePutData.documentLinks // how to use this ???????
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
      if (e.message === "Meeting Details havent Changed") {
        return res.status(400).json({ error: e.message });
      }
      return res.status(500).json({ error: e.message });
    }
  });

router
  .route("/notes/:userId")
  .get(async (req, res) => {
    let userId = "";
    try {
      utils.checkObjectIdString(req.params.userId);
      userId = req.params.userId.trim();
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
      userId = req.params.userId.trim();
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
      utils.checkObjectIdString(userId);
      utils.validateNotesInputs(
        notePostData.title,
        notePostData.dateAddedTo,
        notePostData.textBody,
        notePostData.tag,
        notePostData.documentLinks // how to use this ???????
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

export default router;
