
import banner from "../assets/images/banner2.png";

const Banner = () => {
  return (
    <div className=" mt-24 mb-20">
    <div
      className="w-[1200px] h-full bg-center ml-40 rounded-3xl"
      style={{
        backgroundImage: `url(${banner})`,
        height: '550px', // Set a specific height for the banner
      }}
    >
      {/* You can add additional content inside the banner if needed */}
    </div>
    </div>
  );
};

export default Banner;