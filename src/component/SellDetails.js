import React, { useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { fetchBooks } from "../store/authSlice";
import "./Selldetails.css";

const SellDetails = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const [deletedBooks, setDeletedBooks] = useState([]);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleCancel = async (book) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/selling/delete-selling/${book._id}`
      );
      setDeletedBooks((prevDeletedBooks) => [...prevDeletedBooks, book._id]);
      console.log("Book canceled and deleted:", response.data);
    } catch (error) {
      console.error("Error canceling book:", error);
    }
  };

  const handleConfirm = async (book) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/books/create-user",
        book
      );
      console.log("Book confirmed and posted:", response.data);
      await axios.delete(
        `http://localhost:4000/selling/delete-selling/${book._id}`
      );
      setDeletedBooks((prevDeletedBooks) => [...prevDeletedBooks, book._id]);
    } catch (error) {
      console.error("Error posting book:", error);
    }
  };

  return (
    <div className="selldetails-full-container">
      <Container maxWidth="lg" className="container-selldetails-box">
        <Typography variant="h4" component="h1" className="title">
          Sell Details
        </Typography>

        {books.length === 0 ? (
          <Typography variant="body1" className="empty-text">
            No books to display.
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Cancel</TableCell>
                  <TableCell>Confirm</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map(
                  (book, index) =>
                    !deletedBooks.includes(book._id) && (
                      <TableRow key={index}>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.description}</TableCell>
                        <TableCell>₹{book.price}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleCancel(book)}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleConfirm(book)}
                          >
                            Confirm
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </div>
  );
};

export default SellDetails;
