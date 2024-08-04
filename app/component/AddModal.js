"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ isOpen, onClose, addItem }) {
  const [newItem, setNewItem] = React.useState("");
  const addNewItem = async () => {
    await addItem(newItem.trim());

    setNewItem("");
    onClose();
  };
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <TextField
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            fullWidth
            variant="outlined"
            label="Item name"
            sx={{ mt: 2 }}
          />
          <Button
            onClick={addNewItem}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Add item
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
