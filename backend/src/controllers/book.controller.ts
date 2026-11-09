import { Response } from "express";
import { AuthRequest } from "../types";
import { findBook, getAllBooks, newBook } from "../services/book.service";

// POST /book
export const addNewBook = async (req: AuthRequest, res: Response) => {
  try {
    const { title, author, noOfPages, noOfChapters, startedAt, label, url } =
      req.body;

    const clubId = req.user?.clubId;

    if (!title || !author || !noOfPages || !noOfChapters) {
      return res.status(400).json({
        status: "error",
        code: "ALL_FIELDS_REQUIRED",
        message: "All input fields are required",
      });
    }

    if (!clubId) {
      return res.status(400).json({
        status: "error",
        message: "Club ID is required",
      });
    }

    if (noOfPages < 1) {
      return res.status(400).json({
        status: "error",
        code: "PAGES_CANNOT_BE_LESS_THAN_1",
        message: "Number of pages cannot be less than 1",
      });
    }

    if (noOfChapters < 1) {
      return res.status(400).json({
        status: "error",
        code: "CHAPTERS_CANNOT_BE_LESS_THAN_1",
        message: "Number of chapters cannot be less than 1",
      });
    }

    const sourceLink = { label, url };
    const book = await newBook(
      String(clubId),
      title,
      author,
      noOfPages,
      noOfChapters,
      sourceLink,
      startedAt,
    );

    if (!book) {
      return res.status(400).json({
        status: "error",
        code: "BOOK_ERROR",
        message: "Book cannot be added",
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Successfully added a new book",
      data: book,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      code: "SERVER_ERROR",
      message: `An error occured: ${error}`,
    });
  }
};

export const getBooks = async (req: AuthRequest, res: Response) => { 
  try {
    const clubId = req.user?.clubId;

    if (!clubId) {
      return res.status(400).json({
        status: "error",
        code: "CLUB_ID_ERROR",
        message: "User does not have a club",
      });
    }

    const books = await getAllBooks();

    if (!books) {
      return res.status(400).json({
        status: "error",
        code: "BOOK_NOT_FOUND",
        message: "Books not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Books fetched successfully",
      data: books
    })


  } catch (error) {
    
  }
}