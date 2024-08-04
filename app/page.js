"use client";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddModal from "./component/AddModal";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  orderBy,
  where,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function Home() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Debounce input

  // Add new item
  const handleAddItem = async (newItem) => {
    console.log(newItem);
    if (newItem !== "") {
      try {
        await addDoc(collection(db, "pantry"), {
          item: newItem.toLowerCase(),
          createdAt: new Date(),
        });
      } catch (err) {
        console.error("Error adding item to Firestore:", err);
      }
    }
  };

  // Show DB data
  useEffect(() => {
    const q = query(collection(db, "pantry"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapShot) => {
      const ArrList = [];
      querySnapShot.forEach((docSnap) => {
        ArrList.push({ ...docSnap.data(), id: docSnap.id });
      });
      setItems(ArrList);
    });
    return () => unsubscribe();
  }, []);

  //Delete items
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "pantry", id));
    } catch (err) {
      console.log(err);
    }
  };

  //Search items

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (debouncedSearchQuery !== "") {
          const q = query(
            collection(db, "pantry"),
            where("item", ">=", debouncedSearchQuery.toLowerCase()),
            where("item", "<=", debouncedSearchQuery.toLowerCase() + "\uf8ff")
          );
          const querySnapshot = await getDocs(q);
          const searchResult = [];
          querySnapshot.forEach((doc) => {
            searchResult.push({ ...doc.data(), id: doc.id });
          });
          setItems(searchResult);
        } else {
          // If search query is empty, re-fetch items
          const q = query(
            collection(db, "pantry"),
            orderBy("createdAt", "desc")
          );
          const querySnapshot = await getDocs(q);
          const allItems = [];
          querySnapshot.forEach((doc) => {
            allItems.push({ ...doc.data(), id: doc.id });
          });
          setItems(allItems);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [debouncedSearchQuery]); // Trigger search when debouncedSearchQuery changes

  return (
    <>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        sx={{
          background: "linear-gradient(135deg, #f0f0f0 25%, #cce7ff 100%)",
          padding: "20px",
        }}
      >
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          label="Search..."
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => handleSearch(searchQuery)}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => setIsModalOpen(true)}
        >
          Add
        </Button>
        <AddModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          addItem={handleAddItem}
        />
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="10px"
          boxShadow="0px 4px 15px rgba(0, 0, 0, 0.1)"
          mb={4}
        >
          <Typography
            variant="h2"
            color="#333"
            textAlign="center"
            sx={{ fontWeight: "bold", fontFamily: "Tapestry, cursive" }}
          >
            Pantry Tracker
          </Typography>
        </Box>
        <Stack
          spacing={2}
          width="800px"
          height="300px"
          overflow="auto"
          sx={{
            padding: "10px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          {items.map(
            (
              { item, id } // Destructure item and id from the object
            ) => (
              <Box
                key={id}
                width="100%"
                height="60px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#f0f0f0"
                borderRadius="5px"
                boxShadow="0px 2px 10px rgba(0, 0, 0, 0.05)"
              >
                <Typography
                  variant="h5"
                  color="#333"
                  textAlign="center"
                  textTransform="capitalize"
                  sx={{ fontWeight: 500 }}
                >
                  {item} {/* Access the 'item' property directly */}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => deleteItem(id)}
                >
                  Delete
                </Button>
              </Box>
            )
          )}
        </Stack>
      </Box>
    </>
  );
}
