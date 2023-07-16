import React, { useState, useEffect } from "react";
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

const AvatarsModal = ({ user, setUser, isOpen, onClose }) => {
  const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    const fetchAvatars = async () => {
      const { data } = await axios.get("/api/avatar");
      setAvatars(data);
    };

    fetchAvatars();
  }, []);

  const selectAvatar = async (avatar) => {
    const userInfo = user;

    if (userInfo && userInfo.token) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      try {
        const { data } = await axios.put(
          "/api/user/profile",
          { pic: avatar },
          config
        );

        const updatedUserInfo = { ...userInfo, ...data };
        setUser(updatedUserInfo);
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        onClose();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("User info or token not found.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxHeight="750px">
        <ModalHeader>Select Avatar</ModalHeader>
        <ModalCloseButton />
        <ScrollableFeed>
          <ModalBody maxHeight="600px">
            <Grid templateColumns="repeat(5, 1fr)" gap={5}>
              {avatars.map((avatar, index) => (
                <Box
                  key={index}
                  onClick={() => selectAvatar(avatar)}
                  cursor="pointer"
                >
                  <Image src={`/api/avatar/${avatar}`} borderRadius="50%" />
                </Box>
              ))}
            </Grid>
          </ModalBody>
        </ScrollableFeed>
      </ModalContent>
    </Modal>
  );
};

export default AvatarsModal;
