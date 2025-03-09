

const DriverFaqPage = () => {
  const faqs = [
    {
      question: "How do I become a driver with MegaCity Cab Service?",
      answer:
        "To become a driver, simply visit our 'Join Us' page, fill out the application form, and upload the necessary documents. Our team will review your application and get in touch.",
    },
    {
      question: "What are the requirements to drive with MegaCity?",
      answer:
        "You must be at least 21 years old, have a valid driver's license, a clean driving record, and your own reliable car. We also require a background check and vehicle inspection.",
    },
    {
      question: "How do I get paid?",
      answer:
        "Drivers are paid weekly via direct deposit to their bank account. Earnings are based on the number of rides completed, with tips included.",
    },
    {
      question: "Can I drive whenever I want?",
      answer:
        "Yes! One of the benefits of driving with MegaCity is flexibility. You can choose when and where to drive based on your schedule.",
    },
    {
      question: "Is there a minimum ride requirement?",
      answer:
        "There is no minimum ride requirement. You are free to work as much or as little as you want. However, higher earnings come with more rides.",
    },
    {
      question: "How do I contact support if I have an issue during a ride?",
      answer:
        "Our 24/7 driver support team is available via our driver app or by calling our hotline at +1-800-MEGACITY. We're here to assist you at any time.",
    },
  ];

  return (
    <section id="driver-faq" className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">Driver Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {faq.question}
            </h2>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DriverFaqPage;
