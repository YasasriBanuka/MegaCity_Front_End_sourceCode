import { useState, useEffect } from "react";
import slider1 from "../../assets/images/slider-1.jpg";
import slider2 from "../../assets/images/slider-2.jpg";
import slider3 from "../../assets/images/slider-3.jpg";
import sample from "../../assets/images/01.png";
import sample2 from "../../assets/images/shape-6.png";
import sample3 from "../../assets/images/09.png";
import { FaArrowLeftLong, FaArrowRightLong, FaQuestion   } from "react-icons/fa6";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import taxi1 from "../../assets/images/taxi-1.svg"
import driver from "../../assets/images/driver.svg"
import root from "../../assets/images/taxi-location.svg"
import { FaChevronDown } from "react-icons/fa";
import faqImage from "../../assets/images/01.jpg";
import shape2 from "../../assets/images/shape2.png";
import taxi from "../../assets/images/taxi-safety.svg";
import pickup from "../../assets/images/pickup.svg";
import money from "../../assets/images/money.svg";
import support from "../../assets/images/support.svg";


import { Link } from "react-router-dom";
import { CabList } from "./CabCard";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How Long Does A Booking Take?",
      answer:
        "Booking a cab with us is quick and easy! Once you provide your pickup and destination details, our system will confirm your booking within 1-2 minutes. You'll receive a confirmation message with your driver's details and estimated arrival time.",
    },
    {
      question: "How Can I Become A Member?",
      answer:
        "Becoming a member is simple! Just sign up on our website or mobile app using your email address or phone number. Once registered, you'll gain access to exclusive benefits such as faster bookings, ride history, and special discounts. Membership is free and only takes a few minutes to set up!",
    },
    {
      question: "What Payment Gateway You Support?",
      answer:
        "We currently support cash payments only. After your ride, you can pay the driver directly in cash. We do not accept credit/debit cards or digital wallets at this time.",
    },
    {
      question: "How Can I Cancel My Request?",
      answer:
        "Once a booking is confirmed, it cannot be canceled. Please ensure all details are correct before confirming your booking. If you have any issues, contact our customer support team for assistance.",
    },
  ];

  const slides = [
    { image: slider1, title: "WELCOME TO MEGACITY CAB !", text: "BOOK TAXI FOR YOUR RIDE" },
    { image: slider2, title: "FAST & RELIABLE TRANSPORT", text: "RIDE WITH COMFORT AND SAFETY" },
    { image: slider3, title: "24/7 TAXI SERVICE", text: "YOUR DESTINATION, OUR PRIORITY" },
  ];

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };


const features = [
    {
      icon: taxi, // Use the taxi SVG
      title: "Safety Guarantee",
      description:
        "There are many variations of majority have suffered alteration in some form injected humour randomised words.",
    },
    {
      icon: pickup, // Use the pickup SVG
      title: "Fast Pickup",
      description:
        "There are many variations of majority have suffered alteration in some form injected humour randomised words.",
    },
    {
      icon: money, // Use the money SVG
      title: "Affordable Rate",
      description:
        "There are many variations of majority have suffered alteration in some form injected humour randomised words.",
    },
    {
      icon: support, // Use the support SVG
      title: "24/7 Support",
      description:
        "There are many variations of majority have suffered alteration in some form injected humour randomised words.",
    },
  ];

  const FeatureCard = ({ icon, title, description, isRaised }) => (
    <div
      className={`flex flex-col items-center p-8 bg-white rounded-lg border-2 border-yellow-400 w-[250px] h-[330px] mx-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out ${
        isRaised ? "-translate-y-6" : "translate-y-6"
      } hover:-translate-y-1 hover:scale-105`}
    >
      <div
       id ="image"
       className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center mb-6 border-4 border-black">
        <img src={icon} alt={title} className="w-14 h-14" /> {/* Add SVG here */}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-center text-sm">{description}</p>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <div className="relative w-full h-[100vh] overflow-hidden rounded-l">
  {/* Slide Container */}
  <div id = "header" className="flex w-full h-full transition-transform duration-700 ease-in-out"
    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
  >
    {slides.map((slide, index) => (
      <div
        key={index}
        className="relative w-full h-full flex-shrink-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div> {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          
          {/* Animated Title */}
          <motion.h1
            className="text-2xl md:text-2xl font-semibold mb-4 tracking-wide text-yellow-500 "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {slide.title}
          </motion.h1>

          {/* Animated Main Text */}
          <motion.p
            className="text-6xl md:text-6xl font-bold"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            {slide.text.split("TAXI").map((part, i) => (
              <span key={i} className={i === 1 ? "text-yellow-500" : ""}>
                {i === 1 && "TAXI"}
                {part}
              </span>
            ))}
          </motion.p>

          {/* Animated Description */}
          <motion.p
            className="mt-9 font-semibold text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            Whether you're heading to work, catching a flight, or exploring the city, our reliable and affordable taxi service <br />
            ensures a smooth, comfortable, and hassle-free ride to your destination, anytime and anywhere.
          </motion.p>

          {/* Animated Button */}
          <Link to="/availablecabs">
          <motion.button
            className="font-medium p-3 bg-white text-black rounded-full flex gap-2 text-center hover:bg-yellow-500 mt-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          >
            BOOK A RIDE NOW
            <FaArrowRightLong className="text-2xl" />
          </motion.button>
          </Link>

        </div>
      </div>
    ))}
  </div>

  {/* Left Arrow */}
  <button
    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-slate-50 bg-opacity-15 p-2 rounded-full text-white hover:bg-white hover:text-yellow-500"
    onClick={prevSlide}
  >
    <FaArrowLeftLong className="w-5 h-5 md:w-8 md:h-8" />
  </button>

  {/* Right Arrow */}
  <button
    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-slate-50 bg-opacity-15 p-2 rounded-full text-white hover:bg-white hover:text-yellow-500"
    onClick={nextSlide}
  >
    <FaArrowRightLong className="w-5 h-5 md:w-8 md:h-8" />
  </button>
</div>



      {/* Services Section */}
      <section id="#" className="flex flex-col md:flex-row items-center justify-between px-4 md:px-20 py-12 bg-white">
  {/* Left Side - Image */}
  <div className="relative w-full md:w-1/2 flex justify-center">
    <img
      src={sample}
      className="w-full max-w-md md:max-w-xl"
      alt="Cab Service"
    />
    {/* Badge */}
    <div className="absolute top-0 left-0 bg-black text-white px-4 py-2 rounded-full flex items-center shadow-lg text-sm md:text-base">
      <span className="bg-yellow-500 p-1 md:p-2 rounded-full mr-2 md:mr-3">
        <FaCheckCircle className="text-lg md:text-xl" />
      </span>
      <p className="font-semibold">30 Years Of Quality Service</p>
    </div>
  </div>

  {/* Right Side - Content */}
  <div className="w-full md:w-1/2 mt-8 md:mt-0 md:pl-8">
  <div id ="aboutus"></div>
    <h4 className="text-yellow-500 font-bold text-lg">ABOUT US</h4>
    <h2 className="text-3xl md:text-4xl font-bold mt-3">
      We Provide Trusted{" "}
      <span className="text-yellow-500">Cab Service</span> In Colombo City
    </h2>
    <p className="text-gray-600 mt-4 text-sm md:text-base">
      There are many variations of passages of Lorem Ipsum available, but the
      majority have suffered alteration in some form, by injected humour.
    </p>
    <ul className="mt-6 space-y-2">
      <li className="flex items-center text-gray-700 text-sm md:text-base">
        <FaCheckCircle className="text-yellow-500 mr-2" /> At vero eos et
        accusamus et iusto odio.
      </li>
      <li className="flex items-center text-gray-700 text-sm md:text-base">
        <FaCheckCircle className="text-yellow-500 mr-2" /> Established fact that
        a reader will be distracted.
      </li>
      <li className="flex items-center text-gray-700 text-sm md:text-base">
        <FaCheckCircle className="text-yellow-500 mr-2" /> Sed ut perspiciatis
        unde omnis iste natus sit.
      </li>
    </ul>
    <Link to="/about">
    <button  className="mt-8 bg-yellow-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-600 flex items-center text-sm md:text-base">
      DISCOVER MORE →
    </button>
    </Link>
  </div>
</section>


      {/* Call to Action Section */}
      <section className="py-12">
           <p className="text-center font-semibold text-yellow-500">OUR TAXI</p>
           <h2 className="text-4xl text-center font-bold mb-16">Let's Check Available Taxi</h2>


           <CabList/>
      </section>



    {/*   <div className="w-full bg-gray-50 py-16 mt-10 relative mb-96">
 
  <div
    className="absolute inset-0 bg-cover bg-center z-0"
    style={{
      backgroundImage: `url(${slider1})`,
    }}
  ></div>

 
  <div
    className="absolute inset-0 bg-black z-1"
    style={{
      opacity: 0.7,
    }}
  ></div>

 
  <div className="relative z-10">
    <div className="text-center mb-12">
      <p className="text-yellow-500 font-medium mb-2 text-xl">FEATURE</p>
      <h2 className="text-4xl font-bold text-white" style={{ fontSize: "45px" }}>
        Our Awesome Feature
      </h2>
    </div>

   
    <div className="flex flex-wrap justify-center mb-32 mt-24 gap-4 lg:gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`
            w-full sm:w-[48%] lg:w-[23%] 
            ${index % 2 === 0 ? "lg:mt-8" : "lg:mb-8"}
          `}
        >
          <FeatureCard
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            isRaised={index % 2 === 0} 
          />
        </div>
      ))}
    </div>
  </div>


  <div className="w-full h-[35px] absolute bottom-0 left-0 overflow-hidden">
    <div
      className="absolute top-0 left-0 w-[1000%] h-full animate-scroll"
      style={{
        backgroundImage: `url(${shape2})`,
        backgroundRepeat: "repeat-x",
        backgroundPosition: "top",
        backgroundSize: "auto 35px",
      }}
    ></div>
  </div>
</div>

 */}



      <div id = "service" className="bg-black text-white py-16 relative"   style={{ backgroundImage: `url(${sample2})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-90"></div>
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Video Thumbnail */}
        <div className="relative">
        <h4 className="text-white font-bold uppercase text-xl">Why Choose Us</h4>
          <h2 className="text-5xl font-bold mt-2">
            We Are Dedicated <span className="text-yellow-500">To Provide</span> Quality Service
          </h2>
          <p className="text-white mt-5 font-semibold text-lg mb-8">
            There are many variations of passages available but the majority have suffered alteration in some form
            injected humour words which don't look even slightly believable.
          </p>
          <img
            src={sample3}
            alt="Taxi Service Video"
            className="w-full rounded-lg"
          />
          <button className="absolute inset-0 flex items-center justify-center">
          
          </button>
        </div>

        {/* Text Content */}
        <div>


          {/* Features List */}
          <div className="mt-6 space-y-6">
            <div className="flex items-start space-x-4 p-4 bg-white rounded-3xl" style={{ width: "580px" }}>
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
              <img src={taxi1} className="w-14 h-14"/>
              </div>
              <div style={{ width: "400px" }}>
                <h3 className="font-semibold text-black text-2xl">Best Quality Taxi</h3>
                <p className="text-gray-400 text-lg mt-3">
                There are many variations of passages available but the majority have suffered alteration in form injected humour words which don't look even slightly believable.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white rounded-3xl ml-20" style={{ width: "500px" }}>
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
              <img src={driver} className="w-12 h-12"/>
              </div>
              <div style={{ width: "395px" }}>
                <h3 className="font-semibold text-black text-2xl">Expert Drivers</h3>
                <p className="text-gray-400 text-lg mt-3">
                There are many variations of passages available but the majority have suffered alteration in form injected humour words which even slightly believable.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white rounded-3xl" style={{ width: "580px" }}>
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
              <img src={root} className="w-12 h-12"/>
              </div>
              <div style={{ width: "400px" }}>
                <h3 className="font-semibold text-black text-2xl">Best Quality Taxi</h3>
                <p className="text-gray-400 text-lg mt-3">
                There are many variations of passages available but the majority have suffered alteration in form injected humour words which don't look even slightly believable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto p-6 mt-16">
  <h2 
  id ="FAQ"
  className="text-yellow-500 font-bold text-lg mt-11">FAQ'S</h2>
  <h1 className="text-5xl font-bold my-2">
    General <span className="text-yellow-500">Frequently</span> Asked <br />Questions
  </h1>
  <p className="text-gray-600 mt-4 text-lg">
    There are many variations of passages of Lorem Ipsum available, but the <br />majority have suffered alteration in some form, by injected humour, or <br />randomised words which don't look even.
  </p>
  <div className="flex gap-6 items-start">
    <div style={{ width: "580px" }} className="self-start mt-20">
      <img src={faqImage} alt="FAQ" className="rounded-2xl shadow-lg -mt-14" />
    </div>
    <div className="space-y-5 -mt-52" style={{ width: "580px" }}>
      {faqs.map((faq, index) => (
        <div key={index} className="p-4 bg-white rounded-lg shadow-md">
          <button
            className="flex items-center justify-between w-full text-left text-xl font-bold gap-5 py-1"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shrink-0"> {/* Reduced icon size */}
              <FaQuestion className="text-2xl text-white" /> {/* Adjusted icon size */}
            </div>
            <span className={`flex-1 ${openIndex === index ? "text-yellow-500" : ""}`}>{faq.question}</span>
            <FaChevronDown
              className={`transition-transform ${openIndex === index ? "rotate-180 text-yellow-500" : ""}`}
            />
          </button>
          {openIndex === index && (
            <div className="mt-2 text-gray-700">{faq.answer}</div>
          )}
        </div>
      ))}
    </div>
  </div>
</div>
    </div>
  );
};

export default HomePage;
