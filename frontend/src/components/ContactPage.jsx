import React, { useState, useEffect } from 'react';
import ProfessionalFooter from './Footer';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  HeadphonesIcon,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get help via email within 24 hours',
    contact: 'support@chetro.com',
    action: 'mailto:support@chetro.com',
    available: '24/7'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team instantly',
    contact: 'Available in app',
    action: '#',
    available: 'Mon-Fri 9AM-6PM EST'
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak directly with our team',
    contact: '+1 (555) 123-4567',
    action: 'tel:+15551234567',
    available: 'Mon-Fri 9AM-5PM EST'
  },
  {
    icon: HeadphonesIcon,
    title: 'Premium Support',
    description: 'Priority support for premium users',
    contact: 'chetro.com',
    action: 'mailto:premium@chetro.com',
    available: '24/7 Priority'
  }
];

const offices = [
  {
    city: 'San Francisco',
    address: '123 Innovation Drive, Suite 100',
    zipcode: 'San Francisco, CA 94105',
    phone: '+1 (555) 123-4567',
    email: 'sf@chetro.com'
  },
  {
    city: 'New York',
    address: '456 Business Ave, Floor 15',
    zipcode: 'New York, NY 10001',
    phone: '+1 (555) 987-6543',
    email: 'azikeshinye@gmail.com'
  },
  {
    city: 'London',
    address: '789 Tech Street, Level 8',
    zipcode: 'London, UK EC1A 1BB',
    phone: '+44 20 1234 5678',
    email: 'london@chtro.com'
  }
];

const faqItems = [
  {
    question: 'How do I reset my password?',
    answer: 'You can reset your password by clicking the "Forgot Password" link on the login page.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we use enterprise-grade encryption and security measures to protect your data.'
  },
  {
    question: 'Can I export my tasks?',
    answer: 'Yes, you can export your tasks in various formats including CSV, JSON, and PDF.'
  },
  {
    question: 'Do you offer team plans?',
    answer: 'Yes, we offer team collaboration features and enterprise plans for organizations.'
  }
];

const HERO_IMG = "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=800&q=80";

const ContactPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: '',
        priority: 'medium'
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-black">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        {/* Hero */}
        <section className={`flex flex-col md:flex-row items-center gap-8 py-8 sm:py-16 transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 text-blue-200 border border-blue-500/30 px-4 py-1.5 text-sm font-medium mb-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <MessageCircle className="h-4 w-4 animate-pulse" />
              <span>Contact Us</span>
            </div>
            <div className="flex items-start gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-blue-100">
                We're here to help — get in touch with our team
              </h1>
              <Sparkles className="h-6 w-6 text-blue-400 animate-pulse flex-shrink-0 mt-1" />
            </div>
            <p className="mt-4 text-blue-200/70 text-lg">
              Have questions, feedback, or need support? Our team is here to help you make the most of Chetro.
            </p>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-600/20 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
              <img
                src={HERO_IMG}
                alt="Contact illustration"
                className="relative rounded-2xl shadow-2xl shadow-blue-900/30 object-cover w-full max-w-md h-64 md:h-72 border border-blue-800/40 group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* Quick stats */}
        <section className={`mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {[
            { k: "4", v: "Ways to contact" },
            { k: "3", v: "Global offices" },
            { k: "99.9%", v: "Uptime" },
            { k: "24/7", v: "Support" }
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-blue-800/40 bg-black/40 backdrop-blur-xl p-5 text-center hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300 hover:border-blue-700/50 group"
            >
              <div className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors group-hover:scale-110 inline-block">{s.k}</div>
              <div className="text-sm text-blue-200/60 mt-1">{s.v}</div>
            </div>
          ))}
        </section>

        {/* Contact Methods */}
        <section className={`mt-12 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h2 className="text-xl font-semibold text-blue-100 mb-4 flex items-center gap-2">
            Choose Your Preferred Contact Method
            <div className="h-1 flex-1 bg-gradient-to-r from-blue-600/50 to-transparent rounded-full"></div>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className="group rounded-2xl border border-blue-800/40 bg-black/40 backdrop-blur-xl p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300 hover:border-blue-700/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-100 mb-2 group-hover:text-white transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-blue-200/60 text-sm mb-3">
                    {method.description}
                  </p>
                  <p className="text-blue-400 font-medium text-sm mb-2">
                    {method.contact}
                  </p>
                  <div className="flex items-center text-xs text-blue-300/60 mb-4">
                    <Clock className="h-3 w-3 mr-1" />
                    {method.available}
                  </div>
                  <button
                    onClick={() => window.open(method.action, '_blank')}
                    className="w-full bg-blue-800/40 hover:bg-blue-700/50 text-blue-200 hover:text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 border border-blue-700/30 hover:border-blue-600/50 hover:scale-105 active:scale-95"
                  >
                    Contact Now
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className={`mt-12 grid lg:grid-cols-2 gap-8 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {/* Contact Form */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-blue-800/40 hover:border-blue-700/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-blue-100 mb-6 flex items-center gap-2">
              <Send className="h-6 w-6 text-blue-400" />
              Send us a Message
            </h2>

            {submitStatus && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-center space-x-3 backdrop-blur-sm border animate-slideDown ${
                  submitStatus === 'success'
                    ? 'bg-green-900/20 border-green-500/30 text-green-200'
                    : 'bg-red-900/20 border-red-500/30 text-red-200'
                }`}
              >
                {submitStatus === 'success' ? (
                  <CheckCircle className="h-5 w-5 animate-bounce" />
                ) : (
                  <AlertCircle className="h-5 w-5 animate-pulse" />
                )}
                <span className="font-medium text-sm">
                  {submitStatus === 'success'
                    ? "Message sent successfully! We'll get back to you soon."
                    : 'Failed to send message. Please try again.'}
                </span>
              </div>
            )}

            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="group">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-blue-800/40 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600/50 transition-all bg-blue-950/30 backdrop-blur-sm text-blue-100 placeholder-blue-400/40 hover:border-blue-700/50"
                    placeholder="Your full name"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-blue-800/40 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600/50 transition-all bg-blue-950/30 backdrop-blur-sm text-blue-100 placeholder-blue-400/40 hover:border-blue-700/50"
                    placeholder="chetro@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-blue-800/40 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600/50 transition-all bg-blue-950/30 backdrop-blur-sm text-blue-100 hover:border-blue-700/50"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-blue-800/40 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600/50 transition-all bg-blue-950/30 backdrop-blur-sm text-blue-100 hover:border-blue-700/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-blue-800/40 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600/50 transition-all bg-blue-950/30 backdrop-blur-sm text-blue-100 placeholder-blue-400/40 hover:border-blue-700/50"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-blue-800/40 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600/50 transition-all resize-none bg-blue-950/30 backdrop-blur-sm text-blue-100 placeholder-blue-400/40 hover:border-blue-700/50"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-95 group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-6">
            {/* Office Locations */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-blue-800/40 hover:border-blue-700/50 transition-all duration-500">
              <h3 className="text-xl font-bold text-blue-100 mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-400 animate-pulse" />
                Our Offices
              </h3>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="border-b border-blue-800/30 last:border-b-0 pb-5 last:pb-0 hover:translate-x-1 transition-transform duration-300">
                    <h4 className="font-semibold text-blue-100 mb-3">{office.city}</h4>
                    <div className="text-sm text-blue-200/60 space-y-2">
                      <p>{office.address}</p>
                      <p>{office.zipcode}</p>
                      <p className="flex items-center hover:text-blue-300 transition-colors cursor-pointer">
                        <Phone className="h-3 w-3 mr-2" />
                        {office.phone}
                      </p>
                      <p className="flex items-center hover:text-blue-300 transition-colors cursor-pointer">
                        <Mail className="h-3 w-3 mr-2" />
                        {office.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick FAQ */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-blue-800/40 hover:border-blue-700/50 transition-all duration-500">
              <h3 className="text-xl font-bold text-blue-100 mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <div key={index} className="border-b border-blue-800/30 last:border-b-0 pb-4 last:pb-0 hover:translate-x-1 transition-transform duration-300">
                    <h4 className="font-medium text-blue-100 mb-2">{faq.question}</h4>
                    <p className="text-sm text-blue-200/60">{faq.answer}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate && onNavigate('services')}
                className="mt-6 text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center transition-all duration-300 group"
              >
                View all FAQs 
                <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* Response Time Promise */}
        <section className={`mt-12 py-12 bg-gradient-to-r from-blue-600/80 to-blue-700/80 backdrop-blur-xl rounded-3xl border border-blue-500/30 shadow-2xl shadow-blue-900/30 transition-all duration-700 delay-400 hover:scale-[1.01] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              Our Response Time Promise
              <Sparkles className="h-6 w-6 animate-pulse" />
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              We're committed to providing fast, helpful support when you need it.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">1 hour</div>
                <div className="text-blue-100">Critical Issues</div>
              </div>
              <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">24 hours</div>
                <div className="text-blue-100">General Support</div>
              </div>
              <div className="text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">3 days</div>
                <div className="text-blue-100">Feature Requests</div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <ProfessionalFooter onNavigate={onNavigate} />

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;