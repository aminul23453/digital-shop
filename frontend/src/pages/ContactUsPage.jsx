// src/pages/ContactUsPage.jsx
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquareIcon, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    error: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ submitted: false, error: null });

    console.log('Form data to be submitted:', formData);
    setTimeout(() => {
      setSubmitStatus({ submitted: true, error: null });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus({ submitted: false, error: null });
      }, 5000);
    }, 1500);
  };

  return (
    <div className="bg-background text-foreground">
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 md:py-16 text-center">
        <div className="container mx-auto px-4">
          <MessageSquareIcon className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-3">Get In Touch</h1>
          <p className="text-lg md:text-xl text-emerald-700 max-w-2xl mx-auto">
            We're here to help and answer any question you might have. We look forward to hearing from you!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-6 text-center md:text-left">Send Us a Message</h2>
            {!submitStatus.submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">Full Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Jane Doe"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email Address</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-1">Subject</Label>
                  <Input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">Your Message</Label>
                  <Textarea
                    name="message"
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    required
                    className="w-full"
                  />
                </div>
                {submitStatus.error && (
                  <p className="text-sm text-destructive text-center">{submitStatus.error}</p>
                )}
                <div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send className="mr-2 h-4 w-4" /> Send Message
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="p-4 py-8 text-center bg-green-50 text-green-700 rounded-md border border-green-200">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <p className="text-xl font-semibold">Thank You!</p>
                <p className="mt-1">Your message has been sent successfully. We'll be in touch soon.</p>
              </div>
            )}
          </div>

          <div className="space-y-8 md:pt-0">
            <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-6 text-center md:text-left">Other Ways to Connect</h2>
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/10 transition-colors">
              <Mail className="h-7 w-7 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Email Our Support</h3>
                <p className="text-muted-foreground text-sm">For general inquiries, support, or feedback.</p>
                <a href="mailto:support@ecothreads.com" className="text-primary hover:underline break-all block mt-1">
                  support@ecothreads.com
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/10 transition-colors">
              <Phone className="h-7 w-7 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Call Us</h3>
                <p className="text-muted-foreground text-sm">Customer support available Mon-Fri, 9am - 5pm (Your Timezone).</p>
                <a href="tel:+11234567890" className="text-primary hover:underline block mt-1">
                  (123) 456-7890
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/10 transition-colors">
              <MapPin className="h-7 w-7 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Our Office (By Appointment)</h3>
                <p className="text-muted-foreground text-sm">123 Green Way, Eco City, State 12345</p>
                <a
                  href="https://maps.google.com/?q=123+Green+Way,+Eco+City"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm block mt-1"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUsPage;