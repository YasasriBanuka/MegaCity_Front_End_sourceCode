import React from "react";
import {
  Clock,
  Shield,
  MapPin,
  Star,
  Users,
  Car,
  CheckCircle,
  Award,
} from "lucide-react";

export const AboutUsPage = () => {
  return (
    <div  className="w-full">
      {/* Hero Section */}
      <div className="relative bg-gray-900 py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606388906015-10e0d0adf910?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-amber-500">MegaCity</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Sri Lanka's Premier Taxi Service, Delivering Excellence in
              Transportation Across Colombo
            </p>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Your Trusted Transportation Partner in Colombo
              </h2>
              <p className="text-gray-600 mb-6">
                Since our establishment, MegaCity has been at the forefront of
                revolutionizing taxi services in Sri Lanka. Based in the heart
                of Colombo, we combine modern technology with traditional Sri
                Lankan hospitality to deliver an unmatched transportation
                experience.
              </p>
              <p className="text-gray-600">
                Our commitment to safety, reliability, and customer satisfaction
                has made us the preferred choice for both locals and tourists
                seeking premium transportation solutions in Colombo and beyond.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "10K+", label: "Happy Customers" },
                { number: "500+", label: "Professional Drivers" },
                { number: "24/7", label: "Service Available" },
                { number: "98%", label: "Satisfaction Rate" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg text-center"
                >
                  <div className="text-3xl font-bold text-amber-500 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At MegaCity, our values guide every decision we make and every
              service we provide
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-amber-500" />,
                title: "Safety First",
                description: "Rigorous safety protocols and verified drivers",
              },
              {
                icon: <Clock className="w-8 h-8 text-amber-500" />,
                title: "Punctuality",
                description: "Reliable and timely service, every time",
              },
              {
                icon: <Star className="w-8 h-8 text-amber-500" />,
                title: "Excellence",
                description: "Commitment to superior service quality",
              },
              {
                icon: <Users className="w-8 h-8 text-amber-500" />,
                title: "Customer Focus",
                description: "Personalized attention to every rider",
              },
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Coverage */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Services</h2>
              <div className="space-y-4">
                {[
                  "Airport Transfers",
                  "Corporate Transportation",
                  "City Tours",
                  "Long Distance Travel",
                  "Event Transportation",
                  "24/7 On-Demand Service",
                ].map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-amber-500" size={20} />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <MapPin className="text-amber-500 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Primary Service Area</h3>
                    <p className="text-gray-600">
                      Covering all major areas in Colombo and suburbs, including
                      Colombo 1-15, Mount Lavinia, Dehiwala, and surrounding
                      regions
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <Car className="text-amber-500 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Island-Wide Service</h3>
                    <p className="text-gray-600">
                      Extended services available for long-distance travel
                      across Sri Lanka
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Experience the MegaCity Difference
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust MegaCity for their
            transportation needs
          </p>
          <button className="bg-amber-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-amber-600 transition-colors">
            Book Your Ride Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
