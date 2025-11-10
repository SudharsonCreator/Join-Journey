import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Headphones as HeadphonesIcon, Bot, X, ChevronDown, ChevronUp } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [showAIBot, setShowAIBot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: '👋 Hi! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I book a ride?",
      answer: "Booking a ride is simple! Go to the Home page, enter your departure city, destination, date, and number of passengers. Click 'Search Amazing Rides' to see available options. Select your preferred ride and click 'Book This Amazing Ride!' to confirm your booking."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept multiple payment methods including Credit/Debit Cards (Visa, MasterCard, RuPay, Amex), UPI (GPay, PhonePe, Paytm), Net Banking, Digital Wallets (Paytm, Mobikwik), and Cash payments directly to the driver. All online payments are secured with 256-bit SSL encryption."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes! You can cancel your booking for free up to 2 hours before departure. To cancel, go to Profile → My Bookings, find your booking, and click 'Cancel Booking'. Refunds are processed instantly for UPI/Wallets and within 3-5 business days for cards."
    },
    {
      question: "How do I track my ride?",
      answer: "Once your ride is confirmed, go to Profile → My Bookings and click 'Track Ride' on your active booking. You'll see real-time GPS tracking, driver location, estimated time of arrival, and can also chat with your driver directly."
    },
    {
      question: "Is it safe to ride with Join Journey?",
      answer: "Absolutely! All our drivers undergo thorough background checks, police verification, and license verification. We provide real-time GPS tracking, emergency support (24/7), live location sharing, and have a comprehensive rating system. Emergency contact: +91 7598418591"
    },
    {
      question: "How can I become a driver?",
      answer: "To become a driver, you need a valid driving license (minimum 2 years), vehicle registration, insurance, and required documents. Call +91 9092297888 to start the application process. Earning potential: ₹15,000-₹50,000/month with flexible working hours."
    },
    {
      question: "What if I have luggage?",
      answer: "Each passenger can bring 1 small bag for free. Medium bags cost ₹50 extra and large bags ₹100 extra. Maximum 20kg per passenger for safety. Please inform the driver about your luggage when booking."
    },
    {
      question: "How do I contact customer support?",
      answer: "We're available 24/7! Call us at +91 7598418591 (Emergency), +91 9092297888 (Customer Care), or email support@joinjourney.com. You can also use our AI chat assistant for instant help or WhatsApp us at +91 7598418591."
    }
  ];

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }]);
    setChatLoading(true);

    // Advanced AI response with better intelligence
    setTimeout(() => {
      let botResponse = "";
      
      const lowerMessage = userMessage.toLowerCase();
      
      // Advanced AI responses with contextual understanding
      if (lowerMessage.includes('book') || lowerMessage.includes('ride') || lowerMessage.includes('search') || lowerMessage.includes('find')) {
        botResponse = "🚗 **Complete Booking Guide:**\n\n**Step 1:** Search for rides\n• Go to Home page\n• Enter departure city (From)\n• Enter destination city (To)\n• Select date and number of passengers\n• Click 'Search Amazing Rides'\n\n**Step 2:** Book your ride\n• Browse available rides\n• Check driver ratings and reviews\n• Click 'Book This Amazing Ride!'\n• Confirm your booking details\n\n**Step 3:** Track your booking\n• Go to Profile → My Bookings\n• View live tracking and driver details\n• Chat with your driver\n\n💡 **Pro Tips:**\n• Book early for better prices\n• Check pickup locations\n• Save driver contact info\n• Rate your experience after the ride\n\n🔧 **Having booking issues?** Try:\n• Refresh the page\n• Clear browser cache\n• Use incognito mode\n• Contact support: +91 7598418591";
      } else if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
        botResponse = "❌ **Comprehensive Cancellation Guide:**\n\n**Free Cancellation:**\n• Up to 2 hours before departure\n• No charges applied\n• Instant refund processing\n\n**How to Cancel:**\n1. Go to Profile → My Bookings\n2. Find your booking\n3. Click 'Cancel Booking'\n4. Confirm cancellation\n5. Receive confirmation email\n\n**Refund Timeline:**\n• Credit/Debit Cards: 3-5 business days\n• UPI/Wallets: Instant to 24 hours\n• Net Banking: 2-4 business days\n\n**Late Cancellation:**\n• Within 2 hours: 50% charge\n• No-show: 100% charge\n• Emergency: Call +91 7598418591\n\n**Refund Status:**\n• Check Profile → Transaction History\n• Email notifications sent\n• SMS updates provided\n\n💡 **Need help?** Our support team is available 24/7!";
      } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('money')) {
        botResponse = "💳 **Complete Payment Guide:**\n\n**Accepted Methods:**\n• 💳 Credit/Debit Cards (Visa, MasterCard, RuPay, Amex)\n• 📱 UPI (GPay, PhonePe, Paytm, BHIM)\n• 🏦 Net Banking (All major banks)\n• 💰 Digital Wallets (Paytm, Mobikwik, Freecharge)\n• 💵 Cash (Pay driver directly)\n\n**Payment Process:**\n1. Select your ride\n2. Choose payment method\n3. Enter payment details\n4. Verify with OTP/PIN\n5. Receive booking confirmation\n\n**Security Features:**\n🔒 256-bit SSL encryption\n🛡️ PCI DSS compliant\n🔐 No card details stored\n📱 Two-factor authentication\n💳 Secure payment gateway\n\n**Payment Issues?**\n• Check internet connection\n• Verify card/account balance\n• Try different payment method\n• Contact bank if payment fails\n• Call support: +91 7598418591\n\n**Offers & Discounts:**\n🎉 First ride: 20% off\n💰 UPI payments: Extra 5% off\n🎁 Referral bonus: ₹100 credit";
      } else if (lowerMessage.includes('safety') || lowerMessage.includes('safe') || lowerMessage.includes('secure')) {
        botResponse = "🛡️ **Comprehensive Safety Measures:**\n\n**Driver Verification:**\n✅ Background checks completed\n✅ Police verification done\n✅ Driving license verified\n✅ Aadhaar authentication\n✅ Vehicle registration checked\n✅ Insurance documents verified\n\n**During Your Ride:**\n📍 Real-time GPS tracking\n📱 Live location sharing\n📞 Emergency button access\n👥 Driver photo & details\n🚗 Vehicle number visible\n⭐ Rating system active\n\n**Safety Features:**\n🆘 24/7 emergency support\n📲 Share trip with contacts\n🔔 Ride status notifications\n📸 Driver photo verification\n🛣️ Route optimization\n⚡ Quick response team\n\n**Emergency Contacts:**\n🚨 Emergency: +91 7598418591\n👮 Police: 100\n🚑 Ambulance: 108\n🔥 Fire: 101\n\n**Safety Tips:**\n• Verify driver & vehicle details\n• Share trip details with family\n• Sit behind the driver\n• Keep emergency contacts ready\n• Trust your instincts\n\n**Women Safety:**\n👩 Female driver option available\n🌙 Night ride safety protocols\n📞 Women helpline: 1091\n👥 Trusted contacts feature";
      } else if (lowerMessage.includes('driver') || lowerMessage.includes('earn') || lowerMessage.includes('become')) {
        botResponse = "🚙 **Complete Driver Partnership Guide:**\n\n**Earning Potential:**\n💰 ₹15,000-₹50,000/month\n📈 Performance bonuses available\n🎯 Peak hour incentives\n💵 Instant daily payouts\n🏆 Top driver rewards\n\n**Benefits Package:**\n✅ Flexible working hours\n✅ Weekly guaranteed payments\n✅ Fuel cost sharing (50-70%)\n✅ Comprehensive insurance\n✅ Vehicle maintenance support\n✅ 24/7 driver support\n✅ Training & certification\n✅ Referral bonuses\n\n**Requirements:**\n📄 Valid driving license (minimum 2 years)\n🚗 Vehicle registration certificate\n🆔 Aadhaar card & PAN card\n📱 Smartphone with GPS\n🏥 Medical fitness certificate\n🛡️ Vehicle insurance\n🔧 Pollution under control certificate\n📸 Recent photographs\n\n**Vehicle Eligibility:**\n🚗 Cars: Sedan, Hatchback, SUV\n📅 Age: Maximum 10 years old\n⛽ Fuel: Petrol, Diesel, CNG\n🔧 Condition: Good working order\n🪑 Seats: Minimum 4 passengers\n\n**Application Process:**\n1. 📞 Call +91 9092297888\n2. 📝 Submit online application\n3. 📄 Document verification\n4. 🚗 Vehicle inspection\n5. 📚 Training session\n6. ✅ Account activation\n7. 🚀 Start earning!\n\n**Support & Training:**\n📚 Free driver training program\n📱 Mobile app tutorial\n🛣️ Route optimization tips\n💬 Customer service training\n🔧 Technical support 24/7\n\n**Payment Details:**\n💳 Weekly bank transfers\n📱 Instant wallet payments\n📊 Transparent earning reports\n💰 No hidden deductions\n🎁 Performance bonuses\n\n**Ready to start?** Call now: +91 9092297888";
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('phone')) {
        botResponse = "📞 **Complete Contact Directory:**\n\n**24/7 Helpline Numbers:**\n🆘 Emergency Support: +91 7598418591\n👥 Customer Care: +91 9092297888\n🚙 Driver Support: +91 8825471794\n💳 Payment Issues: +91 6374769785\n📱 Technical Help: +91 7598418591\n\n**Email Support:**\n📧 General: support@joinjourney.com\n🚙 Driver: drivers@joinjourney.com\n💳 Payments: payments@joinjourney.com\n🛡️ Safety: safety@joinjourney.com\n💼 Business: business@joinjourney.com\n\n**Office Locations:**\n🏢 **Head Office:**\nJoin Journey Headquarters\nGobichettipalayam City\nErode District, Tamil Nadu - 638452\n\n🏢 **Regional Offices:**\n📍 Chennai: T. Nagar Branch\n📍 Coimbatore: RS Puram Branch\n📍 Madurai: Anna Nagar Branch\n📍 Salem: Junction Branch\n\n**Support Hours:**\n⏰ Phone Support: 24/7 Available\n⏰ Email Response: Within 2 hours\n⏰ Office Hours: Mon-Sat, 9AM-8PM\n⏰ Emergency: Always available\n\n**Social Media:**\n📘 Facebook: @JoinJourneyIndia\n📸 Instagram: @joinjourney_rides\n🐦 Twitter: @JoinJourneyIN\n💼 LinkedIn: Join Journey India\n📺 YouTube: Join Journey Official\n\n**Live Chat Options:**\n💬 Website Chat: 24/7 AI Assistant\n📱 WhatsApp: +91 7598418591\n📞 Voice Call: Instant connection\n📧 Email: Quick response guaranteed\n\n**Language Support:**\n🗣️ Hindi, English, Tamil, Telugu\nKannada, Malayalam, Gujarati\nMarathi, Bengali, Punjabi\n\n**Response Time:**\n⚡ Emergency: Immediate\n📞 Phone: Within 30 seconds\n💬 Chat: Instant AI response\n📧 Email: Within 2 hours\n📱 WhatsApp: Within 15 minutes";
      } else if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('error') || lowerMessage.includes('bug')) {
        botResponse = "🔧 **Technical Support Center:**\n\n**Common Issues & Solutions:**\n\n**Booking Problems:**\n❌ Can't book rides?\n✅ Clear browser cache\n✅ Try incognito mode\n✅ Check internet connection\n✅ Update browser/app\n✅ Disable ad blockers\n\n**Payment Failures:**\n❌ Payment not going through?\n✅ Check card/account balance\n✅ Verify card details\n✅ Try different payment method\n✅ Contact your bank\n✅ Use UPI as alternative\n\n**App/Website Issues:**\n❌ Page not loading?\n✅ Refresh the page (Ctrl+F5)\n✅ Clear cookies & cache\n✅ Check internet speed\n✅ Try different browser\n✅ Restart your device\n\n**Account Problems:**\n❌ Can't login?\n✅ Reset password\n✅ Check email/phone number\n✅ Clear browser data\n✅ Try Google sign-in\n✅ Contact support\n\n**Booking Not Showing:**\n❌ Missing bookings?\n✅ Check Profile → My Bookings\n✅ Verify login account\n✅ Check email confirmations\n✅ Contact driver directly\n✅ Call support: +91 7598418591\n\n**Live Tracking Issues:**\n❌ Can't track ride?\n✅ Enable location services\n✅ Allow GPS permissions\n✅ Check internet connection\n✅ Refresh tracking page\n✅ Contact driver\n\n**Quick Fixes:**\n🔄 Refresh page: F5 or Ctrl+R\n🗑️ Clear cache: Ctrl+Shift+Delete\n🔒 Incognito mode: Ctrl+Shift+N\n📱 Restart app: Close & reopen\n🌐 Check connection: Try other sites\n\n**Still having issues?**\n📞 Call: +91 7598418591\n💬 Chat: Available 24/7\n📧 Email: support@joinjourney.com\n📱 WhatsApp: +91 7598418591\n\n**Report a Bug:**\n🐛 Describe the problem\n📱 Mention device/browser\n📸 Share screenshots\n⏰ When did it happen?\n🔄 Steps to reproduce\n\n**Emergency Support:**\n🆘 Ride emergency: +91 7598418591\n🚨 Safety concerns: Immediate help\n💳 Payment disputes: Priority support\n🚗 Driver issues: Instant resolution";
      } else if (lowerMessage.includes('ai') || lowerMessage.includes('bot') || lowerMessage.includes('smart') || lowerMessage.includes('intelligent')) {
        botResponse = "🤖 **Advanced AI Assistant Features:**\n\n**What I Can Do:**\n🧠 **Smart Responses:** Context-aware conversations\n🔍 **Instant Search:** Find rides, drivers, info\n📊 **Data Analysis:** Booking patterns, preferences\n🗣️ **Multi-language:** 10+ Indian languages\n⚡ **Real-time:** Live updates & notifications\n🎯 **Personalized:** Tailored recommendations\n\n**AI Capabilities:**\n✅ Natural language understanding\n✅ Sentiment analysis\n✅ Predictive text suggestions\n✅ Smart route optimization\n✅ Dynamic pricing insights\n✅ Weather-based recommendations\n✅ Traffic pattern analysis\n✅ Driver-passenger matching\n\n**Learning Features:**\n📚 Learns from your preferences\n🎯 Improves recommendations\n📈 Tracks usage patterns\n🔄 Continuous updates\n💡 Proactive suggestions\n🎨 Personalized experience\n\n**Voice Commands:**\n🗣️ \"Book a ride to Chennai\"\n🗣️ \"Show my bookings\"\n🗣️ \"Find cheapest rides\"\n🗣️ \"Call my driver\"\n🗣️ \"Cancel my ride\"\n🗣️ \"Track my journey\"\n\n**Smart Notifications:**\n📱 Ride reminders\n⏰ Departure alerts\n🚗 Driver arrival updates\n💰 Price drop notifications\n🎉 Special offers\n⭐ Rating reminders\n\n**Future AI Features:**\n🔮 Predictive booking\n🎭 Emotion recognition\n🌍 AR navigation\n🤝 Smart carpooling\n📸 Visual search\n🎵 Music preferences\n\n**Privacy & Security:**\n🔒 End-to-end encryption\n🛡️ Data protection compliant\n🚫 No personal data sharing\n✅ GDPR compliant\n🔐 Secure conversations\n\n**How to Use:**\n💬 Just type naturally\n❓ Ask any question\n🎯 Be specific for better results\n🔄 Follow up for clarification\n📝 Provide feedback\n\n**Available 24/7:**\n🌙 Night support\n🌅 Early morning help\n🎉 Holiday assistance\n🚨 Emergency responses\n💬 Instant replies\n\nI'm constantly learning and improving to serve you better! 🚀";
      } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fare') || lowerMessage.includes('cheap')) {
        botResponse = "💰 **Pricing Information:**\n• **Transparent pricing** - no hidden charges\n• **Competitive rates** - up to 60% cheaper than taxis\n• **Distance-based pricing** - fair for all\n• **Fuel sharing** - split costs with co-passengers\n\n💡 **Sample Fares:**\n• Chennai-Coimbatore: ₹800-1200\n• Mumbai-Pune: ₹450-550\n• Delhi-Jaipur: ₹750-850";
      } else if (lowerMessage.includes('cities') || lowerMessage.includes('routes') || lowerMessage.includes('destinations')) {
        botResponse = "🏙️ **Popular Routes:**\n• **Tamil Nadu:** Chennai, Coimbatore, Madurai, Salem, Tiruppur, Erode, Gobichettipalayam\n• **Major Cities:** Mumbai-Pune, Delhi-Jaipur, Bangalore-Chennai\n• **Hill Stations:** Ooty, Kodaikanal, Shimla\n\n🔍 **Search Tip:** Type any city name in the search box - we have 1000+ cities covered!";
      } else if (lowerMessage.includes('time') || lowerMessage.includes('schedule') || lowerMessage.includes('timing')) {
        botResponse = "⏰ **Ride Timings:**\n• **Early Morning:** 5:00 AM - 8:00 AM\n• **Morning:** 8:00 AM - 12:00 PM\n• **Afternoon:** 12:00 PM - 4:00 PM\n• **Evening:** 4:00 PM - 8:00 PM\n• **Night:** 8:00 PM - 11:00 PM\n\n📅 **Advance Booking:** Book up to 7 days in advance!";
      } else if (lowerMessage.includes('account') || lowerMessage.includes('profile') || lowerMessage.includes('login') || lowerMessage.includes('signup')) {
        botResponse = "👤 **Account Management:**\n• **Sign Up:** Click 'Sign up' button (top right)\n• **Login Options:** Email/Password or Google Sign-in\n• **Profile:** Update details in 'Profile' section\n• **Demo Login:** bicigi6832@etenx.com / admin\n\n✨ **Benefits:** Track bookings, save preferences, earn rewards!";
      } else if (lowerMessage.includes('app') || lowerMessage.includes('mobile') || lowerMessage.includes('download')) {
        botResponse = "📱 **Mobile Experience:**\n• **Web App:** Works perfectly on mobile browsers\n• **Responsive Design:** Optimized for all screen sizes\n• **No Download Required:** Access directly via browser\n• **Fast & Secure:** PWA technology for app-like experience\n\n💡 **Tip:** Add to home screen for quick access!";
      } else if (lowerMessage.includes('covid') || lowerMessage.includes('mask') || lowerMessage.includes('sanitizer')) {
        botResponse = "😷 **COVID-19 Safety Measures:**\n• Mandatory masks for all passengers and drivers\n• Hand sanitizer provided in vehicles\n• Regular vehicle sanitization\n• Limited passengers for social distancing\n• Health screening for drivers\n\n🏥 **Stay Safe:** Follow government guidelines during travel.";
      } else if (lowerMessage.includes('luggage') || lowerMessage.includes('baggage') || lowerMessage.includes('bag')) {
        botResponse = "🎒 **Luggage Policy:**\n• **Free:** 1 small bag per passenger\n• **Medium Bags:** ₹50 extra charge\n• **Large Bags:** ₹100 extra charge\n• **Inform Driver:** Mention luggage while booking\n\n📏 **Size Limits:** Max 20kg per passenger for safety.";
      } else if (lowerMessage.includes('rating') || lowerMessage.includes('review') || lowerMessage.includes('feedback')) {
        botResponse = "⭐ **Rating System:**\n• Rate drivers after each trip (1-5 stars)\n• Share your experience with reviews\n• Help other passengers choose better rides\n• Drivers with low ratings are removed\n\n💬 **Your Feedback Matters:** It helps us improve our service!";
      } else {
        // Advanced contextual responses
        if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
          botResponse = "👋 **Hello! Welcome to Join Journey's Advanced AI Assistant!**\n\n🤖 **I'm your intelligent travel companion, powered by advanced AI technology!**\n\n**I can help you with:**\n🚗 **Smart Ride Booking** - Find perfect rides instantly\n💳 **Payment Solutions** - Secure & multiple options\n🛡️ **Safety First** - 24/7 protection & support\n📞 **Instant Support** - Real-time assistance\n💰 **Best Prices** - Dynamic pricing & offers\n🗺️ **Live Tracking** - GPS-powered journey monitoring\n👥 **Driver Matching** - AI-powered compatibility\n📱 **Smart Features** - Voice commands & predictions\n\n**Popular Commands:**\n• \"Book a ride to [destination]\"\n• \"Show my bookings\"\n• \"Find cheapest rides\"\n• \"Track my current ride\"\n• \"Contact my driver\"\n• \"Cancel booking\"\n• \"Payment help\"\n• \"Safety features\"\n\n**What would you like to explore today?** 🚀\n\n*Tip: I understand natural language, so just ask me anything!*";
        } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
          botResponse = "😊 **You're absolutely welcome!** It's my pleasure to assist you!\n\n🌟 **I'm here 24/7 for all your travel needs:**\n\n**Quick Actions:**\n🚗 Book your next amazing ride\n📍 Explore 1000+ connected cities\n💰 Check latest offers & discounts\n🛡️ Learn about our safety features\n📱 Download our mobile app\n⭐ Rate your recent experience\n\n**Smart Suggestions:**\n🎯 Based on your location, I can help you find:\n• Popular routes from your area\n• Best-rated drivers nearby\n• Current traffic conditions\n• Weather-appropriate rides\n• Special weekend offers\n\n**Always Learning:**\n🧠 I remember your preferences\n📈 I improve with every conversation\n🎨 I personalize your experience\n🔄 I provide proactive suggestions\n\n**Happy to assist you anytime!** 🚀\n\n*Is there anything specific you'd like to know about your next journey?*";
        } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
          botResponse = "👋 **Goodbye! Safe and happy travels ahead!**\n\n🌟 **Thank you for choosing Join Journey!**\n\n🚗 **Remember, we're always here for you:**\n• 24/7 AI assistance (that's me!)\n• Instant ride bookings\n• Live customer support\n• Emergency help anytime\n\n📞 **Quick Contact:**\n• Emergency: +91 7598418591\n• Support: Always available\n• WhatsApp: +91 7598418591\n• Email: support@joinjourney.com\n\n🎁 **Before you go:**\n• Check our latest offers\n• Download our mobile app\n• Follow us on social media\n• Refer friends for rewards\n\n**Have an absolutely wonderful day!** ✨\n\n*I'll be right here whenever you need me - just say hello!* 🤖💙";
        } else {
          botResponse = `🤖 **I understand you're asking about: "${userMessage}"**\n\n**My Advanced AI Brain Can Help With:**\n\n🚗 **Ride Services:**\n• Smart booking & search\n• Route optimization\n• Driver matching\n• Live tracking\n• Ride history\n\n💳 **Payment & Pricing:**\n• Multiple payment options\n• Dynamic pricing\n• Offers & discounts\n• Refund processing\n• Transaction history\n\n🛡️ **Safety & Security:**\n• Driver verification\n• Real-time tracking\n• Emergency support\n• Safety features\n• Insurance coverage\n\n👤 **Account Management:**\n• Profile settings\n• Booking management\n• Preferences\n• Notifications\n• Privacy controls\n\n🚙 **Driver Partnership:**\n• Earning opportunities\n• Requirements\n• Application process\n• Training & support\n• Payment details\n\n📞 **Support & Help:**\n• Technical issues\n• Customer service\n• Emergency assistance\n• Feedback & complaints\n• General inquiries\n\n**🎯 Pro Tip:** Try asking me specific questions like:\n• \"How do I book a ride?\"\n• \"What payment methods do you accept?\"\n• \"How safe are your rides?\"\n• \"How can I become a driver?\"\n• \"I'm having a booking problem\"\n\n**I'm powered by advanced AI and I'm learning constantly to serve you better!** 🚀\n\n*What specific topic would you like to explore?*`;
        }
      }
      
      setChatMessages(prev => [...prev, { type: 'bot', message: botResponse }]);
      setChatLoading(false);
    }, 1200 + Math.random() * 800); // Slightly longer for more realistic AI processing
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions, suggestions, or need support? We're here to help! 
            Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">support@joinjourney.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <div className="text-gray-600">
                      <p>+91 7598418591</p>
                      <p>+91 9092297888</p>
                      <p>+91 8825471794</p>
                      <p>+91 6374769785</p>
                    </div>
                    <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 rounded-full p-3">
                    <MapPin className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Office</h3>
                    <p className="text-gray-600">
                      Join Journey Office<br />
                      Gobichettipalayam City<br />
                      Erode District, Tamil Nadu<br />
                      Pincode: 638452, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Help */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Help</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer" onClick={() => {
                  const faqSection = document.getElementById('faq-section');
                  if (faqSection) {
                    faqSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}>
                  <MessageCircle className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">FAQs</h3>
                  <p className="text-sm text-gray-600">Find answers to common questions</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer" onClick={() => setShowAIBot(true)}>
                  <HeadphonesIcon className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">🤖 AI Live Chat</h3>
                  <p className="text-sm text-gray-600">Chat with our AI assistant</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="booking">Booking Support</option>
                  <option value="payment">Payment Issues</option>
                  <option value="technical">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Tell us how we can help you..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white transform hover:scale-105'
                }`}
              >
                <Send className="h-5 w-5" />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq-section" className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find quick answers to common questions about Join Journey</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-left">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <button
              onClick={() => setShowAIBot(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Chat with AI Assistant
            </button>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gray-100 h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive map would be displayed here</p>
              <p className="text-sm text-gray-500">showing our office location in Gobichettipalayam</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Bot Modal */}
      {showAIBot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 rounded-full p-2">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">🤖 AI Assistant</h3>
                  <p className="text-blue-100 text-sm">Online • Ready to help</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIBot(false)}
                className="text-white/80 hover:text-white p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px]">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors duration-200"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}