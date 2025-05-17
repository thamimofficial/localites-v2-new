import { useState, useEffect } from 'react';
import StorageService from '../../services/StorageService/storageService';

const userLocation = () => {
  const [code, setCode] = useState('');
  const [communityId, setCommunityId] = useState(0);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const userLocation = await StorageService.getItem("userLocation");
        if (userLocation) {
          setCode(userLocation.code || '');
          setCommunityId(userLocation.communityId || 0);
        }
      } catch (error) {
        console.error("Error retrieving user location:", error);
      }
    };

    fetchUserLocation();
  }, []);

  return { code, communityId };
};

export default userLocation;
