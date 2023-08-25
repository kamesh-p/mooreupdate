import React, { useState } from "react";
import "./Library.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const Library = ({ rentedBooks, onDeleteBook }) => {
  const [selectedDates, setSelectedDates] = useState({});
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [dialogOpen, setDialogOpen] = useState(true);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [confirmedRentals, setConfirmedRentals] = useState([]);
  const [rentdetails, setRentDetails] = useState([]);
  const user = useSelector((state) => state.auth.user);
  console.log("user", user);

  const handleOpenDialog = (bookId) => {
    setSelectedBookId(bookId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedBookId(null);
    setDialogOpen(false);
  };

  const handleDateChange = (bookId, dateType, event) => {
    const selectedDate = event.target.value;
    setSelectedDates((prevDates) => ({
      ...prevDates,
      [bookId]: {
        ...prevDates[bookId],
        [dateType]: selectedDate,
      },
    }));
  };

  const getMinStartDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Set to tomorrow
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getMinEndDate = (startDate) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30); // Start from 30 days after start date
    const year = endDate.getFullYear();
    const month = (endDate.getMonth() + 1).toString().padStart(2, "0");
    const day = endDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleProceed = (bookId) => {
    const book = rentedBooks.find((book) => book._id === bookId);
    const confirmedRental = {
      users: user,
      title: book.title,
      startDate: selectedDates[bookId]?.startDate,
      endDate: selectedDates[bookId]?.endDate,
    };
    setConfirmedRentals((prevRentals) => [...prevRentals, confirmedRental]);
    handleCloseDialog();
    setRentDetails(confirmedRental);
    console.log("confirmation", confirmedRental);
    console.log("confirmationtotal", rentdetails);

    axios.post("http://localhost:4000/library/create-user", confirmedRental);
  };
  // if (user) {
  //   console.log("DEWWW", user.Users.RentedSub);
  //   return <p>NO ITEM IN THE LIBRARY</p>;
  // }
  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expirationDate: "",
    cvv: "",
  });

  const handleOpenSubscribeDialog = () => {
    setSubscribeDialogOpen(true);
  };

  const handleCloseSubscribeDialog = () => {
    setSubscribeDialogOpen(false);
  };

  return (
    <div className="library-container-library">
      {isAuthenticated && !user.Users.RentedSub && (
        <div>
          <div className="catchy-text">
            <h3>Subscribe to Our Rented Offer to Rent a Book!</h3>
            <p>
              Don't miss out on our fantastic selection of books. Subscribe now
              to get access to unlimited reading.
            </p>
            <Button variant="contained" color="error">
              Subscribe Now
            </Button>
          </div>
          <div>
            <h2>Rented Books</h2>
            <ul className="book-list-library">
              {rentedBooks.map((book) => (
                <li key={book._id} className="book-item-library">
                  <img
                    src={book.imagelink}
                    alt={book.title}
                    className="book-image-library"
                  />
                  <div className="book-details-library">
                    {/* <p>{user.Users.RentedSub}</p> */}
                    <h3>{book.title}</h3>
                    <p>Author: {book.author}</p>
                    <label htmlFor={`startDate-${book._id}`}>
                      Start Date:{" "}
                    </label>
                    <input
                      type="date"
                      id={`startDate-${book._id}`}
                      min={getMinStartDate()} // Set min attribute
                      value={selectedDates[book._id]?.startDate || ""}
                      onChange={(e) =>
                        handleDateChange(book._id, "startDate", e)
                      }
                    />
                    <br />
                    <label htmlFor={`endDate-${book._id}`}>End Date: </label>
                    <input
                      type="date"
                      id={`endDate-${book._id}`}
                      disabled={!selectedDates[book._id]?.startDate} // Disable if no start date
                      min={
                        selectedDates[book._id]?.startDate
                          ? getMinEndDate(selectedDates[book._id]?.startDate)
                          : ""
                      }
                      value={selectedDates[book._id]?.endDate || ""}
                      onChange={(e) => handleDateChange(book._id, "endDate", e)}
                    />
                    <br />
                  </div>
                  <div className="rent-button-details">
                    <Button
                      className="btn-lib-delete"
                      color="error"
                      onClick={() => onDeleteBook(book._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      className="btn-lib-delete"
                      variant="contained"
                      color="error"
                    >
                      subscribe
                    </Button>
                  </div>
                  <Dialog
                    open={dialogOpen && selectedBookId === book._id}
                    onClose={handleCloseDialog}
                  >
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Are you sure you want to Rent the book "{book.title}"
                      </DialogContentText>
                      <p>Title: {book.title}</p>
                      <p>Author: {book.author}</p>
                      <p>Start Date: {selectedDates[book._id]?.startDate}</p>
                      <p>End Date: {selectedDates[book._id]?.endDate}</p>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog}>Cancel</Button>
                      <Button
                        onClick={() => handleProceed(book._id)}
                        color="success"
                      >
                        Proceed
                      </Button>
                    </DialogActions>
                  </Dialog>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {isAuthenticated && user.Users.RentedSub && (
        <ul className="book-list-library">
          {rentedBooks.map((book) => (
            <li key={book._id} className="book-item-library">
              <img
                src={book.imagelink}
                alt={book.title}
                className="book-image-library"
              />
              <div className="book-details-library">
                {/* <p>{user.Users.RentedSub}</p> */}
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <label htmlFor={`startDate-${book._id}`}>Start Date: </label>
                <input
                  type="date"
                  id={`startDate-${book._id}`}
                  min={getMinStartDate()} // Set min attribute
                  value={selectedDates[book._id]?.startDate || ""}
                  onChange={(e) => handleDateChange(book._id, "startDate", e)}
                />
                <br />
                <label htmlFor={`endDate-${book._id}`}>End Date: </label>
                <input
                  type="date"
                  id={`endDate-${book._id}`}
                  disabled={!selectedDates[book._id]?.startDate} // Disable if no start date
                  min={
                    selectedDates[book._id]?.startDate
                      ? getMinEndDate(selectedDates[book._id]?.startDate)
                      : ""
                  }
                  value={selectedDates[book._id]?.endDate || ""}
                  onChange={(e) => handleDateChange(book._id, "endDate", e)}
                />
                <br />
              </div>
              <div className="rent-button-details">
                <Button
                  className="btn-lib-delete"
                  color="error"
                  onClick={() => onDeleteBook(book._id)}
                >
                  Delete
                </Button>
                <Button
                  className="btn-lib-delete"
                  color="success"
                  onClick={() => handleOpenDialog(book._id)}
                >
                  Confirm
                </Button>
              </div>
              <Dialog
                open={dialogOpen && selectedBookId === book._id}
                onClose={handleCloseDialog}
              >
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to Rent the book "{book.title}"
                  </DialogContentText>
                  <p>Title: {book.title}</p>
                  <p>Author: {book.author}</p>
                  <p>Start Date: {selectedDates[book._id]?.startDate}</p>
                  <p>End Date: {selectedDates[book._id]?.endDate}</p>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button
                    onClick={() => handleProceed(book._id)}
                    color="success"
                  >
                    Proceed
                  </Button>
                </DialogActions>
              </Dialog>
            </li>
          ))}
        </ul>
      )}
      {!isAuthenticated && (
        <div>
          <h2>Rented Books</h2>
          <ul className="book-list-library">
            {rentedBooks.map((book) => (
              <li key={book._id} className="book-item-library">
                <img
                  src={book.imagelink}
                  alt={book.title}
                  className="book-image-library"
                />
                <div className="book-details-library">
                  {/* <p>{user.Users.RentedSub}</p> */}
                  <h3>{book.title}</h3>
                  <p>Author: {book.author}</p>
                  <label htmlFor={`startDate-${book._id}`}>Start Date: </label>
                  <input
                    type="date"
                    id={`startDate-${book._id}`}
                    min={getMinStartDate()} // Set min attribute
                    value={selectedDates[book._id]?.startDate || ""}
                    onChange={(e) => handleDateChange(book._id, "startDate", e)}
                  />
                  <br />
                  <label htmlFor={`endDate-${book._id}`}>End Date: </label>
                  <input
                    type="date"
                    id={`endDate-${book._id}`}
                    disabled={!selectedDates[book._id]?.startDate} // Disable if no start date
                    min={
                      selectedDates[book._id]?.startDate
                        ? getMinEndDate(selectedDates[book._id]?.startDate)
                        : ""
                    }
                    value={selectedDates[book._id]?.endDate || ""}
                    onChange={(e) => handleDateChange(book._id, "endDate", e)}
                  />
                  <br />
                </div>
                <div className="rent-button-details">
                  <Button
                    className="btn-lib-delete"
                    color="error"
                    onClick={() => onDeleteBook(book._id)}
                  >
                    Delete
                  </Button>
                  <Link to="/login">
                    <Button variant="contained" color="error">
                      Login
                    </Button>
                  </Link>
                </div>
                <Dialog
                  open={dialogOpen && selectedBookId === book._id}
                  onClose={handleCloseDialog}
                >
                  <DialogTitle>Confirmation</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to Rent the book "{book.title}"
                    </DialogContentText>
                    <p>Title: {book.title}</p>
                    <p>Author: {book.author}</p>
                    <p>Start Date: {selectedDates[book._id]?.startDate}</p>
                    <p>End Date: {selectedDates[book._id]?.endDate}</p>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                  </DialogActions>
                </Dialog>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Library;
