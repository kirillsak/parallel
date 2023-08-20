import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSubstrateState } from '../substrate-lib'

const CommunityContext = createContext()

export const useCommunity = () => {
    return useContext(CommunityContext)
}



export const CommunityProvider = ({ children }) => {
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [communityHead, setCommunityHead] = useState('')
    const [admins, setAdmins] = useState([]);
    const { api } = useSubstrateState();

    useEffect(() => {
        const fetchCommunityAdmins = async () => {
            if (!api || !selectedCommunity) return; // Ensure the API is set before fetching

            try {
                const allKeys = await api.query.communities.admins.keys(selectedCommunity.id);

                const adminAccountIds = allKeys.map(({ args: [, accountId] }) => accountId.toString());

                setAdmins(adminAccountIds);

            } catch (error) {
                console.error("Error fetching community admins:", error);
            }
        };

        fetchCommunityAdmins();
    }, [api, selectedCommunity]);


    useEffect(() => {
        const fetchCommunityHead = async () => {
            if (!api || !selectedCommunity) {
                return;
            } // Ensure the API is set before fetching


            try {
                const result = await api.query.communities.communities(selectedCommunity.id);
                const jsonResult = result.toJSON();


                if (jsonResult && jsonResult.head !== undefined) {
                    setCommunityHead(jsonResult.head);
                } else {
                    console.warn(
                        "Unable to set the Community Head"
                    );

                }
            } catch (error) {
                console.error("Error fetching community (AdminsCard)", error);
            }
        };

        fetchCommunityHead();
    }, [api, selectedCommunity]);

    const contextValue = {
        selectedCommunity,
        setSelectedCommunity,
        admins,
        setAdmins,
        communityHead,
        setCommunityHead
    };
    return (
        <CommunityContext.Provider value={contextValue}>{children}</CommunityContext.Provider>
    )

}