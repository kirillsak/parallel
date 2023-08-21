import { useParams } from 'react-router-dom';

function CommunityProfile() {
    const { communityId } = useParams();

    // Fetch the community details based on communityId or perform any logic here

    return (
        <div>
            Profile for community: {communityId}
            {/* Render your community details here */}
        </div>
    );
}

export default CommunityProfile;