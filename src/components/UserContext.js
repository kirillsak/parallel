import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const UserContext = createContext()

export const useUser = () => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const storedUser = sessionStorage.getItem('loggedInUser')
  const [loggedInUser, setLoggedInUser] = useState(storedUser || null)
  const [profileImage, setProfileImage] = useState(null)

  const loadProfileImage = async () => {
    if (!loggedInUser) return // No user, no image

    try {
      const { data } = await axios.get(
        `http://localhost:3001/getUserProfilePic/${loggedInUser}`
      )
      const imageUrl = `http://localhost:3001${data.imageUrl}`
      setProfileImage(imageUrl)
      sessionStorage.setItem('profilePicture', imageUrl)
    } catch (error) {
      console.error("Failed to fetch user's profile image:", error)
    }
  }

  useEffect(() => {
    if (loggedInUser) {
      sessionStorage.setItem('loggedInUser', loggedInUser)
      loadProfileImage()
    } else {
      sessionStorage.removeItem('loggedInUser')
      setProfileImage(null)
    }
  }, [loggedInUser])

  const contextValue = {
    loggedInUser,
    setLoggedInUser,
    profileImage, // Expose profile image to any component that consumes this context
  }

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}
