import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  Alert,
  Share,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import { apiBase, apiService } from '../../services/api';
import Loader from '../Loader/Loader';
import { useNavigation } from '@react-navigation/native';
import Images from '../../constants/Images';
import StorageService from '../../services/StorageService/storageService';
import axios from 'axios';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StallHeader = ({ stallId }) => {
  const navigation = useNavigation();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stallBanner, setStallBanner] = useState();
  const [followInfo, setFollowInfo] = useState({
    followId: 0,
    isFollow: false,
    followedUsers: 0,
  });

  const getStallDetailsById = async () => {
    const inputData = {
      stallId,
      currentDate: new Date().toISOString().split('T')[0],
    };

    try {
      const response = await apiService.post(
        `/portal/stall/${stallId}/withcategory/serviceIds`,
        inputData
      );
      if (response.data?.stall) {
        setItem({
          stall: response.data.stall,
          categories: response.data.categories || [],
        });
      }
    } catch (error) {
      console.error('Error fetching stall details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFollowInfoByUserId = async () => {
    const userId = await StorageService.getItem('userId');
    const token = await StorageService.getItem('sessionId');

    const inputData = {
      userId:userId||0,
      entityId: stallId,
    };

    try {
      const response = await apiService.post(`/portal/follow/query`, inputData, token);
      const follow = response.data?.follow;
      console.log("follow",follow)
      setFollowInfo({
        followId: follow?.id || 0,
        isFollow: follow?.isFollow || false,
        followedUsers: response.data?.followedUsers || 0,
      });
    } catch (error) {
      console.error('Error fetching follow info:', error);
    }
  };

  const handleFollowPress = async () => {
    const userId = await StorageService.getItem('userId');
    const token = await StorageService.getItem('sessionId');

    if (!userId || !token) {
      Alert.alert('Login Required', 'Please login to follow stalls.');
      return;
    }

    if (followInfo.followId === 0) {
      await addFollow();
    } else {
      if (followInfo.isFollow) {
        console.log('followid',followInfo.followId)
        await unFollowStall();
      } else {
        console.log('followid',followInfo.followId)
        await followStall();
      }
    }
  };

  const addFollow = async () => {
    const token = await StorageService.getItem('sessionId');
    console.log(token)

    try {
      await apiService.post(`/follow/add`, { entityId: stallId }, token);
      await getFollowInfoByUserId();
    } catch (error) {
      console.error('Error adding follow:', error);
    }
  };

  // const followStall = async () => {
  //   const token = await StorageService.getItem('sessionId');
  //   console.log(token)
  //   try {
  //     await apiService.put(`/follow/${followInfo.followId}/updatefollow`, token);
  //     await getFollowInfoByUserId();
  //   } catch (error) {
  //     console.error('Error following stall:', error);
  //   }
  // };

  const followStall = async () => {
    // const fixedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDYzNDU0MzQsImF1ZCI6InpmLmxvY2FsaXRlcy5tb2JpbGUiLCJpc3MiOiJ6Zl9pZHBfc2VydmljZXNfdjEiLCJpYXQiOjE3NDUxMzU4MzQsInN1YiI6MTE1MDgsImRhdGEiOnsibmFtZSI6ImxvY2FsaXRlcyIsImFwcGxpY2F0aW9uIjoiemYubG9jYWxpdGVzLmFwaSJ9fQ.hmM0CFio0Y5ZEIUdYiW7SUk_Lr7tdHXKiY_d9GQG-b0';
      const token = await StorageService.getItem('sessionId');
    try {
      const response = await axios.put(
        `https://api.localites.in/api/follow/${followInfo.followId}/updatefollow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Follow response:', response.data);
      await getFollowInfoByUserId();
    } catch (error) {
      console.error('Error following stall:', error.response?.data || error.message);
    }
  };
  
  const unFollowStall = async () => {
    // const fixedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDYzNDU0MzQsImF1ZCI6InpmLmxvY2FsaXRlcy5tb2JpbGUiLCJpc3MiOiJ6Zl9pZHBfc2VydmljZXNfdjEiLCJpYXQiOjE3NDUxMzU4MzQsInN1YiI6MTE1MDgsImRhdGEiOnsibmFtZSI6ImxvY2FsaXRlcyIsImFwcGxpY2F0aW9uIjoiemYubG9jYWxpdGVzLmFwaSJ9fQ.hmM0CFio0Y5ZEIUdYiW7SUk_Lr7tdHXKiY_d9GQG-b0';
      const token = await StorageService.getItem('sessionId');
    try {
      const response = await axios.put(
        `https://api.localites.in/api/follow/${followInfo.followId}/updateunfollow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Follow response:', response.data);
      await getFollowInfoByUserId();
    } catch (error) {
      console.error('Error following stall:', error.response?.data || error.message);
    }
  };
  // const unFollowStall = async () => {
  //   const token = await StorageService.getItem('sessionId');

  //   try {
  //     await apiService.put(`/follow/${followInfo.followId}/updateunfollow`, token);
  //     await getFollowInfoByUserId();
  //   } catch (error) {
  //     console.error('Error unfollowing stall:', error);
  //   }
  // };

const handleSharePress = (slug) => {
  const shareUrl = `https://go-localites-in.app.link/stall?s=${slug}`;
  const message = `Check out this stall: ${shareUrl}`;

  Share.share({
    message,
    url: shareUrl,
  })
    .then((result) => console.log('Share result:', result))
    .catch((error) => console.error('Share error:', error));
};

// const getStallBanner = async () => {
//   // const fixedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDYzNDU0MzQsImF1ZCI6InpmLmxvY2FsaXRlcy5tb2JpbGUiLCJpc3MiOiJ6Zl9pZHBfc2VydmljZXNfdjEiLCJpYXQiOjE3NDUxMzU4MzQsInN1YiI6MTE1MDgsImRhdGEiOnsibmFtZSI6ImxvY2FsaXRlcyIsImFwcGxpY2F0aW9uIjoiemYubG9jYWxpdGVzLmFwaSJ9fQ.hmM0CFio0Y5ZEIUdYiW7SUk_Lr7tdHXKiY_d9GQG-b0';
//     const token = await StorageService.getItem('sessionId');
//   try {
//     const response = await axios.get(
//       `https://api.localites.in/api/stallbanner/stall/${stallId}`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );`
//     console.log('getStallBanner response:', response.data);
//    setStallBanner(response.data)
//   } catch (error) {
//     console.error('Error getStallBanner:', error.response?.data || error.message);
//   }
// };

const getStallBanner = async () => {
  const token = await StorageService.getItem('sessionId');
  console.log(token)
  if(!token)return

  try {
   const response = await apiService.get(`/stallbanner/stall/${stallId}`, token);
   console.log("Banner",response.data)
   setStallBanner(response.data)
  } catch (error) {
    console.error('Error getStallBanner:', error);
  }
};

  useEffect(() => {
    if (stallId) {
      setLoading(true);
      getStallDetailsById();
      getFollowInfoByUserId();
      getStallBanner()
    }
  }, [stallId]);


  
  if (loading || !item?.stall) {
    return <Loader visible={loading} />;
  }

  const { stall, categories } = item;

  return (
    <View style={styles.container}>
      {/* Banner */}

            {stallBanner && stallBanner.length > 0 && stallBanner[0]?.isActive ? (
        <Image
          source={{ uri: `${apiBase.imagePath}${stallBanner[0].imagePath}` }}
          style={styles.banner}
        />
      ) : (
        <Image
        source={typeof Images?.stallBannerDefaultImage === 'string'
          ? { uri: Images.stallBannerDefaultImage }
          : Images?.stallBannerDefaultImage
        }
        style={styles.banner}
        resizeMode="cover"
      />
      )}

      {/* Profile Section */}
      <View style={styles.innerContainer}>
        <View style={styles.profileRow}>
          <View style={styles.profileImageContainer}>

            <Image
            source={{ uri: `${apiBase.imagePath}${stall.imagePath}` }}
            style={styles.profileImage}
          />

            

          </View>

          <View style={styles.titleBlock}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{stall.name}</Text>
              {stall.isVerified && (
                <MaterialIcons name="verified" size={20} color="#4285f4" />
              )}
            </View>

            {stall.communityName && (
              <View style={styles.locationRow}>
                <Entypo name="location-pin" size={18} color="#f69516" />
                <Text style={styles.address}>{stall.communityName}</Text>
              </View>
            )}

            <View style={styles.locationRow}>
              {/* <MaterialCommunityIcons
                name="heart-circle-outline"
                size={18}
                color="#f69516"
              /> */}
              <Image source={{ uri: Images.truefans}} height={15} width={15} />
              <Text style={styles.fansText}> True Fans {followInfo.followedUsers}</Text>
            </View>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          {categories.map((category, index) => (
            <Text key={index} style={styles.category}>
              {category}
            </Text>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.contactContainer}>
          {/* Follow Button */}
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleFollowPress}
          >
            {/* <Icon
              name={followInfo.isFollow ? 'heartbeat' : 'heart-o'}
              size={18}
              color="#f69516"
            /> */}
            {followInfo.isFollow ? (
            <Image source={{ uri: Images.truefans }} height={24} width={24} />
          ):(
            <Image source={{ uri: Images.untruefans }} height={24} width={24} />
          )
            }
          </TouchableOpacity>

          {/* Website */}
          {stall.website && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => Linking.openURL(stall.website)}
            >
              <Icon name="link" size={18} color="#f69516" />
            </TouchableOpacity>
          )}

          {/* Phone */}
          {stall.providerMobile && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => Linking.openURL(`tel:${stall.providerMobile}`)}
            >
              <Icon name="phone" size={18} color="#f69516" />
            </TouchableOpacity>
          )}

          {/* Email */}
          {stall.providerEmail && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => Linking.openURL(`mailto:${stall.providerEmail}`)}
            >
              <Icon name="envelope" size={18} color="#f69516" />
            </TouchableOpacity>
          )}

          {/* Direct Message */}
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => navigation.navigate('DirectMessage',{inputId:stallId,typeName:'stallId'})}
          >
            <Icon name="comment" size={18} color="#f69516" />
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleSharePress(stall?.slug)}
          >
            <Icon name="share" size={18} color="#f69516" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 20,
  },
  banner: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.48,
    marginBottom: 18,
  },
  innerContainer: {
    paddingHorizontal: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImageContainer: {
    borderWidth: 2,
    borderColor: '#eff2f5',
    borderRadius: 50,
    overflow: 'hidden',
    width: 80,
    height: 80,
  },
  profileImage: {
    width: 80,
    height: 80,
  },
  titleBlock: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Sora-Bold',
    color: '#333',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  address: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: '#898F98',
  },
  fansText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: '#898F98',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  category: {
    fontSize: 13,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontFamily: 'Sora-Regular',
  },
  contactContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#eef2f5',
    borderRadius: 10,
    padding: 10,
    justifyContent:'center'
  },
  contactButton: {
    backgroundColor: '#ffe6c7',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 45,
  },
});

export default StallHeader;
