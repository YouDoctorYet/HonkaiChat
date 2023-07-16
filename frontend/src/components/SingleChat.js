import React from "react";
import { ChatState } from "../context/ChatProvider";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  IconButton,
  Spinner,
  useToast,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuGroup,
  Flex,
} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon, SettingsIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import BackgroundModal from "./miscellaneous/BackgroundModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import TypingIndicator from "./TypingIndicator";

const ENDPOINT = "http://localhost:5001";
var socket, selectedChatCompare;

let typingTimer;
let stopTypingTimer;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  const [isBackgroundModalOpen, setBackgroundModalOpen] = useState(false);
  const [isUpdateGroupModalOpen, setUpdateGroupModalOpen] = useState(false);

  const openBackgroundModal = () => {
    setBackgroundModalOpen(true);
  };

  const closeBackgroundModal = () => {
    setBackgroundModalOpen(false);
  };

  const openUpdateGroupModal = () => {
    setUpdateGroupModalOpen(true);
  };

  const closeUpdateGroupModal = () => {
    setUpdateGroupModalOpen(false);
  };

  const fetchNotifications = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/notification/${user._id}`, config);
      setNotification(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error Occured!",
        description: "Failed to fetch notifications",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    console.log("Fetching messages for chat:", selectedChat._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const typingHandler = (typingChatId) => {
      if (selectedChat && selectedChat._id === typingChatId) {
        setIsTyping(true);
      }
    };

    const stopTypingHandler = (typingChatId) => {
      if (selectedChat && selectedChat._id === typingChatId) {
        setIsTyping(false);
      }
    };

    socket.on("typing", typingHandler);
    socket.on("stop typing", stopTypingHandler);

    // Clear the typing state when the chat is switched
    return () => {
      setIsTyping(false);
      socket.off("typing", typingHandler);
      socket.off("stop typing", stopTypingHandler);
    };
  }, [selectedChat]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    console.log(
      "Selected chat in useEffect:",
      selectedChat && selectedChat._id
    );
  }, [selectedChat]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id ||
        newMessageReceived.sender._id === user._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification((prevNotification) => {
            if (!prevNotification.includes(newMessageReceived)) {
              return [newMessageReceived, ...prevNotification];
            }
            return prevNotification;
          });
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
    return () => {
      socket.off("message received");
    };
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
        await axios.post(
          "/api/notification",
          {
            sender: user._id,
            chat: selectedChat._id,
            recipient: selectedChat.users.find((u) => u._id !== user._id)._id,
          },
          config
        );
      } catch (error) {
        console.error(error);
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        setTyping(true);
        socket.emit("typing", selectedChat._id);
      }, 100);
    }

    clearTimeout(stopTypingTimer);
    stopTypingTimer = setTimeout(() => {
      setTyping(false);
      socket.emit("stop typing", selectedChat._id);
    }, 2000);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>{getSender(user, selectedChat.users)}</>
            ) : (
              <>{selectedChat.chatName.toUpperCase()}</>
            )}
            <Menu>
              <MenuButton as={Button}>
                <Flex align="center">
                  <SettingsIcon />
                </Flex>
              </MenuButton>
              <MenuList
                style={{
                  fontSize: "16px",
                  fontFamily: "Arial",
                  width: "auto",
                }}
              >
                {!selectedChat.isGroupChat ? (
                  <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                    <MenuItem>View Profile</MenuItem>
                  </ProfileModal>
                ) : (
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                    isOpen={isUpdateGroupModalOpen}
                    onClose={closeUpdateGroupModal}
                  />
                )}
                {selectedChat.isGroupChat && (
                  <MenuItem onClick={openUpdateGroupModal}>
                    Group Profile
                  </MenuItem>
                )}
                <MenuItem onClick={openBackgroundModal}>
                  Change Background
                </MenuItem>
              </MenuList>
            </Menu>
            <BackgroundModal
              user={user}
              chat={selectedChat}
              setChat={setSelectedChat}
              isOpen={isBackgroundModalOpen}
              onClose={closeBackgroundModal}
            />
          </Box>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            backgroundImage={`url(${selectedChat.pic})`}
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
            backgroundPosition="center"
          >
            {console.log("Selected chat in render:", selectedChat._id)}
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? <TypingIndicator /> : <></>}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
