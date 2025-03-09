import './App.css'
import LoginPage from './Authenticationpage/LoginPage'
import SignUpPage from './Authenticationpage/SignUpPage'
import AboutUsPage from './components/AboutUsPage'
import BookingPage from './components/bookingpage/BookingPage'
import RoadDistanceCalculator from './components/bookingpage/RoadDistanceCalculator '
import Footer from './components/homepage/Footer'
import Header from './components/homepage/Header'
import HomePage from './components/homepage/HomePage'
import { Routes, Route } from "react-router-dom"
import { AuthProvider } from './Authenticationpage/AuthContext'
import DriverSignup from './components/DriverPage/DriverSignup'
import Sidebar from './Admin/Sidebar'
import AdminRoutes from './Admin/AdminRoutes'
import AdminLayout from './Admin/AdminLayout'
import Unauthorized from './Authenticationpage/Unauthorized'
import DriverBookings from './components/DriverPage/DriverBookings'
import BookingForm from './components/bookingpage/BookingForm'
import MapDistance from './components/bookingpage/MapDistance'
import CustomerProfile from './CustomerPage/CustomerProfile'
import { CabRegistrationForm } from './components/DriverPage/CabRegistrationForm'
import AvailableCabs from './components/bookingpage/AvailableCabs'
import DriverRoutes from './components/DriverPage/DriverRoutes'
import TestimonialsSection from './components/homepage/TestimonialsSection'
import "./index.css";
import Bar from './components/homepage/Bar'
import Banner from './CustomerPage/Banner'
import BackButtonHandler from './Authenticationpage/BackButtonHandler'




function App() {
 

  return (
      <AuthProvider>
        <BackButtonHandler/>
      <Routes>
        <Route path="/" element = {
         <main className="overflow-hidden">
        <Header/>
        <HomePage/>
        <TestimonialsSection/>
        <Bar/>
        <Banner/>
        <Footer/>
        </main> 
      
        }/>

        {/*other routes*/}
        <Route path="/booking" element={
          <BookingPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/availablecabs" element={<AvailableCabs />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/driversignup" element={<DriverSignup />} />
        <Route path="/road" element={<RoadDistanceCalculator />} />
          <Route path="/driverbookings" element={<DriverBookings />} />
          <Route path="/side" element={<Sidebar />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/adminlayout" element={<AdminLayout />} />
          <Route path="/unauthorized" element={<Unauthorized/>}/>
          <Route path="/bookigform" element={<BookingForm />} />
          <Route path="/map" element={<MapDistance />} />
          <Route path="/customerprofile" element={<CustomerProfile />} />
          <Route path="/cabRegistration" element={<CabRegistrationForm />} />
          <Route path="/driver/*" element={<DriverRoutes />} />
        </Routes>
        </AuthProvider>

  )
}

export default App;