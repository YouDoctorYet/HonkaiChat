import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Grid,
  Image,
  Box,
} from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../context/ChatProvider";

const BackgroundModal = ({ user, chat, setChat, isOpen, onClose }) => {
  const [backgrounds, setBackgrounds] = useState([]);
  const { chats, setChats } = ChatState();

  useEffect(() => {
    const fetchBackgrounds = async () => {
      const { data } = await axios.get("/api/background");
      setBackgrounds(data);
    };

    fetchBackgrounds();
  }, [chat]);

  const selectBackground = async (background) => {
    const userInfo = user;
    const chatInfo = chat;
    if (userInfo && userInfo.token) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      try {
        const { data } = await axios.put(
          "/api/chat/chatbackground",
          { chatId: chatInfo._id, pic: background },
          config
        );

        const updatedChatInfo = { ...chatInfo, pic: data.pic };
        setChats(
          chats.map((chat) =>
            chat._id === updatedChatInfo._id ? updatedChatInfo : chat
          )
        );
        console.log("Updated chat info:", updatedChatInfo._id);
        setChat(updatedChatInfo);
        localStorage.setItem("chatInfo", JSON.stringify(updatedChatInfo));
        console.log(
          "Chat info from local storage:",
          JSON.parse(localStorage.getItem("chatInfo"))._id
        );
        onClose();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Chat info or token not found.");
    }
  };

  return (
    <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent maxHeight="750px">
        <ModalHeader>Select New Background</ModalHeader>
        <ModalCloseButton />
        <ScrollableFeed>
          <ModalBody maxHeight="600px">
            <Grid templateColumns="repeat(5, 1fr)" gap={5}>
              {backgrounds.map((background, index) => (
                <Box
                  key={index}
                  onClick={() => selectBackground(background)}
                  cursor="pointer"
                >
                  <Image
                    src={`/api/background/${background}`}
                    borderRadius="50%"
                  />
                </Box>
              ))}
            </Grid>
          </ModalBody>
        </ScrollableFeed>
      </ModalContent>
    </Modal>
  );
};

export default BackgroundModal;
