import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  HeadphonesIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get help via email within 24 hours',
    contact: 'support@taskmaster.com',
    action: 'mailto:support@taskmaster.com',
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
    contact: 'premium@taskmaster.com',
    action: 'mailto:premium@taskmaster.com',
    available: '24/7 Priority'
  }
];

const offices = [
  {
    city: 'San Francisco',
    address: '123 Innovation Drive, Suite 100',
    zipcode: 'San Francisco, CA 94105',
    phone: '+1 (555) 123-4567',
    email: 'sf@taskmaster.com'
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
    email: 'london@taskmaster.com'
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      {/* Ambient blobs (match Services theme: blue/indigo) */}
      <div className="pointer-events-none select-none absolute inset-0 opacity-40 dark:opacity-20">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-300 to-indigo-300 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-200 to-blue-200 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        {/* Hero */}
        <section className={`flex flex-col md:flex-row items-center gap-8 py-8 sm:py-16 transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-1.5 text-sm font-medium mb-6">
              <MessageCircle className="h-4 w-4" />
              <span>Contact Us</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              We're here to help — get in touch with our team
            </h1>
            <p className="mt-3 text-zinc-600 dark:text-zinc-300">
              Have questions, feedback, or need support? Our team is here to help you make the most of TaskMaster.
            </p>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <img
              src={HERO_IMG}
              alt="Contact illustration"
              className="rounded-2xl shadow-lg object-cover w-full max-w-md h-64 md:h-72"
              style={{ background: "linear-gradient(135deg, #e0f2fe 60%, #e0e7ff 100%)" }}
            />
          </div>
        </section>

        {/* Quick stats */}
        <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { k: "4", v: "Ways to contact" },
            { k: "3", v: "Global offices" },
            { k: "99.9%", v: "Uptime" },
            { k: "24/7", v: "Support" }
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl p-5 text-center hover:-translate-y-0.5 hover:shadow-md transition"
            >
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{s.k}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{s.v}</div>
            </div>
          ))}
        </section>

        {/* Contact Methods */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Choose Your Preferred Contact Method</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className="group rounded-2xl border border-zinc-200/70 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl p-6 hover:-translate-y-0.5 hover:shadow-md transition"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 mb-4">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">
                    {method.description}
                  </p>
                  <p className="text-blue-600 font-medium text-sm mb-2">
                    {method.contact}
                  </p>
                  <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                    <Clock className="h-3 w-3 mr-1" />
                    {method.available}
                  </div>
                  <button
                    onClick={() => window.open(method.action, '_blank')}
                    className="w-full bg-white/80 dark:bg-zinc-900/60 hover:bg-blue-50 text-blue-700 dark:text-blue-300 py-2 px-4 rounded-lg text-sm hover:text-black font-medium transition-colors duration-200"
                  >
                    Contact Now
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="mt-12 grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/80 dark:bg-zinc-900/60 rounded-2xl p-8 shadow-lg border border-zinc-200/70 dark:border-white/10 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
              Send us a Message
            </h2>

            {submitStatus && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                  submitStatus === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {submitStatus === 'success' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span className="font-medium">
                  {submitStatus === 'success'
                    ? "Message sent successfully! We'll get back to you soon."
                    : 'Failed to send message. Please try again.'}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-zinc-900/30 placeholder:text-zinc-400"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-zinc-900/30 placeholder:text-zinc-400"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-zinc-900/30 text-zinc-700 dark:text-zinc-200"
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
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-zinc-900/30 text-zinc-700 dark:text-zinc-200"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-zinc-900/30 placeholder:text-zinc-400"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none bg-white dark:bg-zinc-900/30 placeholder:text-zinc-400"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Office Locations */}
            <div className="bg-white/80 dark:bg-zinc-900/60 rounded-2xl p-8 shadow-lg border border-zinc-200/70 dark:border-white/10 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Our Offices
              </h3>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">{office.city}</h4>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                      <p>{office.address}</p>
                      <p>{office.zipcode}</p>
                      <p className="flex items-center">
                        <Phone className="h-3 w-3 mr-2" />
                        {office.phone}
                      </p>
                      <p className="flex items-center">
                        <Mail className="h-3 w-3 mr-2" />
                        {office.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick FAQ */}
            <div className="bg-white/80 dark:bg-zinc-900/60 rounded-2xl p-8 shadow-lg border border-zinc-200/70 dark:border-white/10 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <div key={index} className="border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-medium text-zinc-900 dark:text-white mb-2">{faq.question}</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate && onNavigate('services')}
                className="mt-6 text-blue-600 hover:text-indigo-600 font-medium text-sm flex items-center transition-colors"
              >
                View all FAQs →
              </button>
            </div>
          </div>
        </section>

        {/* Response Time Promise */}
        <section className="mt-12 py-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Our Response Time Promise
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              We're committed to providing fast, helpful support when you need it.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">1 hour</div>
                <div className="text-blue-100">Critical Issues</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24 hours</div>
                <div className="text-blue-100">General Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">3 days</div>
                <div className="text-blue-100">Feature Requests</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;