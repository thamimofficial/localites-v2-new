import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from '../screens/Home';
import Stall from '../screens/Stall';
import Location from '../screens/Location';
import OrderConfirmation from '../components/OrderConfirmation/OrderConfirmation';
import Intro from '../auth/IntroductionScreen/Intro';
import Login from '../auth/login';
import SplashScreen from '../auth/Splash/SplashScreen';
import GmailOtpScreen from '../auth/LoginWithGmail/GmailOtp';
import Account from '../screens/Account/Account';
import Notifications from '../screens/Notifications/Notification';
import ExploreCategory from '../components/ServiceCategory/ExploreCategory';
import ItemWiseStallsCard from '../components/ServiceCategory/ItemWiseStallsCard';
import BookingWiseStallsCard from '../components/ServiceCategory/BookingWiseStallsCard';
import Profile from '../components/Account/Profile';
import MyOrder from '../components/Account/MyOrder';
import EmailVerify from '../components/Account/EmailVerify';
import Address from '../components/Account/Address';
import ReviewCart from '../components/OrderConfirmation/ReviewCart/ReviewCart';
import AddressEdit from '../components/Account/AddressEdit';
import ProductDetail from '../screens/ProductDetail/ProductDetail';
import DirectMessage from '../components/CarouselBanner/DirectMessages/DirectMessage';
import MenuScreen from '../screens/MenuScreen/MenuScreen';
import JourneyTracker from '../components/JourneyCoupon/JourneyTracker';
import ItemSaleOrder from '../components/Account/ItemSaleOrder';
import JourneyCompleted from '../components/JourneyCoupon/JourneyCompleted';
import ProviderDashboard from '../screens/MenuScreen/ProviderDashboard/ProviderDashboard';
import ProviderOrders from '../screens/MenuScreen/ProviderOrder/ProviderOrders';
import Privacy from '../screens/MenuScreen/Privacy/Privacy';
import HelpSupport from '../screens/MenuScreen/HelpSupport/HelpSupport';
import CustomerService from '../screens/MenuScreen/CustomerService/CustomerService';
import NoNotifiation from '../screens/Notifications/NoNotifiation';
import ReferFriend from '../components/JourneyCoupon/ReferFriend';
import BookingDetail from '../screens/BookingDetail/BookingDetail';
import OrderSummary from '../components/OrderConfirmation/OrderSummary/OrderSummary';
import OrderConfirmed from '../components/OrderConfirmation/OrderConfirmed/OrderConfirmed';
import OrderAddress from '../components/OrderConfirmation/DeliveryAddress/OrderAddress/OrderAddress';
import ProviderFollower from '../screens/MenuScreen/ProviderFollower/ProviderFollower';
import StallBookingEntry from '../screens/StallBookingEntry/StallBookingEntry';
import BookingOrderSummary from '../screens/BookingOrderSummary/BookingOrderSummary';
import QRCodeScanner from '../screens/QRCodeScanner/QRCodeScanner';
import OrderDetail from '../screens/OrderDetail/OrderDetail';
import GmailVerifyOtp from '../auth/GmailVerifyOtp/GmailVerifyOtp';

const Stack = createStackNavigator();


const StackNavigation = () => {
  return (

      <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{headerShown: false}} >
        
        <Stack.Screen name="SplashScreen" component={SplashScreen} /> 

      {/* Login Screens */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="GmailOtpScreen" component={GmailOtpScreen}  />
      {/* Login Screens */}

      
        <Stack.Screen name="Intro" component={Intro} /> 
        <Stack.Screen name="Location" component={Location} /> 
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Stall" component={Stall} />
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} />

        <Stack.Screen name="OrderSummary" component={OrderSummary} />
        <Stack.Screen name="ReviewCart" component={ReviewCart} />
        <Stack.Screen name="OrderConfirmed" component={OrderConfirmed} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />

        
        <Stack.Screen name="BookingDetail" component={BookingDetail} />
        <Stack.Screen name="StallBookingEntry" component={StallBookingEntry} />
        <Stack.Screen name="BookingOrderSummary" component={BookingOrderSummary} />
        

        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Notification" component={Notifications} />
        <Stack.Screen name="ExploreCategory" component={ExploreCategory} />
        <Stack.Screen name = "ItemWiseStallsCard" component={ItemWiseStallsCard}/>
        <Stack.Screen name = "BookingWiseStallsCard" component={BookingWiseStallsCard}/>
        <Stack.Screen name ="Profile" component={Profile}/>
        <Stack.Screen name ="MyOrder" component={MyOrder}/>
        <Stack.Screen name ="EmailVerify" component={EmailVerify}/>
        <Stack.Screen name ="Address" component={Address}/>
        <Stack.Screen name='AddressEdit' component={AddressEdit} />
        <Stack.Screen name='OrderAddress' component={OrderAddress} />

        <Stack.Screen name='DirectMessage' component={DirectMessage} />
        <Stack.Screen name='MenuScreen' component={MenuScreen} />
        <Stack.Screen name='ProviderDashboard' component={ProviderDashboard} />
        <Stack.Screen name='ProviderOrders' component={ProviderOrders} />
        <Stack.Screen name='Privacy' component={Privacy} />
        <Stack.Screen name='HelpSupport' component={HelpSupport} />
        <Stack.Screen name='CustomerService' component={CustomerService} />

        <Stack.Screen name = "JourneyTracker" component={JourneyTracker}/>
        <Stack.Screen name='JourneyCompleted' component={JourneyCompleted} />   
        <Stack.Screen name='NoNotifiation' component={NoNotifiation} />
        <Stack.Screen name='ReferFriend' component={ReferFriend} />
        <Stack.Screen name='ProviderFollower' component={ProviderFollower}/>

        <Stack.Screen name='QRCodeScanner' component={QRCodeScanner}/>
        <Stack.Screen name='OrderDetail' component={OrderDetail}/>
        <Stack.Screen name='GmailVerifyOtp' component={GmailVerifyOtp}/>


      </Stack.Navigator>  
  )
}

export default StackNavigation

const styles = StyleSheet.create({})