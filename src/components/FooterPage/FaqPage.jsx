

const FaqPage = () => {
  const faqs = [
    {
      question: "What is MegaCity Cab Service?",
      answer:
        "MegaCity Cab Service is a reliable platform offering cab services with professional drivers, ensuring a safe and convenient ride.",
    },
    {
      question: "How do I book a cab?",
      answer:
        "You can book a cab through our website by navigating to the 'Booking' page, selecting a car, and confirming your booking.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept various payment methods, including credit/debit cards, online wallets, and cash upon completion of the ride.",
    },
    {
      question: "Can I cancel a booking?",
      answer:
        "Yes, you can cancel your booking. Please refer to our cancellation policy on the website for more details.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can contact our customer support by emailing support@megacitycab.com or calling our 24/7 hotline at +1-800-MEGACITY.",
    },
  ];

  return (
    <section id="faq" className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
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

export default FaqPage;
