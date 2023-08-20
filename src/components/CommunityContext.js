import React, { createContext, useContext, useState, useEffect } from 'react'

const CommunityContext = createContext()

export const useCommunity = () => {
    return useContext(CommunityContext)
}



export const CommunityProvider = ({ children }) => {
    const [selectedCommunity, setSelectedCommunity] = useState(null);

    useEffect(() => {
        // Do something when selectedCommunity changes
    }, [selectedCommunity]);

    const contextValue = {
        selectedCommunity,
        setSelectedCommunity
    };
    return (
        <CommunityContext.Provider value={contextValue}>{children}</CommunityContext.Provider>
    )

}